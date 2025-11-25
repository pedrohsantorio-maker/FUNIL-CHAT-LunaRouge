"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  query,
  where,
  Timestamp,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { formatDuration, intervalToDuration } from "date-fns";
import { ptBR } from "date-fns/locale";

export function useDashboardStats(selectedDate?: Date) {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    totalLeads: 0,
    onlineLeads: 0,
    completedConversations: 0,
    abandonedConversations: 0,
    conversionRate: 0,
    avgConversationTime: "0m 0s",
  });
  const [dailyLeads, setDailyLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const usersRef = useMemoFirebase(
    () => (firestore ? collection(firestore, "users") : null),
    [firestore]
  );

  const calculateStats = useCallback((allUsers: any[]) => {
    const totalLeads = allUsers.length;

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const onlineLeads = allUsers.filter(
      (user) => user.lastInteractionAt?.toMillis() > fiveMinutesAgo
    ).length;

    const completedConversations = allUsers.filter(
      (user) => user.currentStep === 15 // Assuming step 15 is completion
    ).length;

    const abandonedConversations = totalLeads - completedConversations;

    const conversionRate =
      totalLeads > 0 ? (completedConversations / totalLeads) * 100 : 0;

    const conversationTimes = allUsers
      .filter((user) => user.createdAt && user.lastInteractionAt)
      .map(
        (user) =>
          user.lastInteractionAt.toMillis() - user.createdAt.toMillis()
      ); // in milliseconds

    const totalConversationTime =
      conversationTimes.length > 0
        ? conversationTimes.reduce((a, b) => a + b, 0)
        : 0;
    const avgConversationTimeMillis =
      conversationTimes.length > 0
        ? totalConversationTime / conversationTimes.length
        : 0;
    
    const duration = intervalToDuration({ start: 0, end: avgConversationTimeMillis });
    const formattedAvgTime = formatDuration(duration, {
        format: ['minutes', 'seconds'],
        locale: ptBR
    }).replace(' minutos', 'm').replace(' segundos', 's');


    setStats({
      totalLeads,
      onlineLeads,
      completedConversations,
      abandonedConversations,
      conversionRate,
      avgConversationTime: formattedAvgTime,
    });
  }, []); // Empty dependency array as setStats is stable

  const fetchDailyLeads = useCallback(() => {
    if (!selectedDate || !usersRef) return () => {};

    setIsLoading(true);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    const q = query(
      usersRef,
      where("createdAt", ">=", startTimestamp),
      where("createdAt", "<=", endTimestamp)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDailyLeads(leads);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching daily leads:", error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [selectedDate, usersRef]);

  useEffect(() => {
    if (!usersRef) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    // Listener for all users to calculate general stats
    const unsubscribeAll = onSnapshot(
      usersRef,
      (snapshot) => {
        const allUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        calculateStats(allUsers);
        // We set loading to false here after stats are calculated,
        // but daily leads might still be loading. The daily leads
        // fetch will manage the final loading state.
      },
      (error) => {
        console.error("Error fetching all users for stats:", error);
        setIsLoading(false);
      }
    );

    // Listener for leads of the selected day
    const unsubscribeDaily = fetchDailyLeads();

    return () => {
      unsubscribeAll();
      unsubscribeDaily();
    };
  }, [usersRef, fetchDailyLeads, calculateStats]);

  return { stats, dailyLeads, isLoading };
}