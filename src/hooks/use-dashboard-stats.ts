"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  Timestamp,
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

  const fetchStats = useCallback(async () => {
    if (!usersRef || !selectedDate) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all users for general stats
      const allUsersSnapshot = await getDocs(usersRef);
      const allUsers = allUsersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate general stats
      const totalLeads = allUsers.length;
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      const onlineLeads = allUsers.filter(
        (user: any) => user.lastInteractionAt?.toMillis() > fiveMinutesAgo
      ).length;
      
      const completedConversations = allUsers.filter(
        (user: any) => user.hasConverted
      ).length;
      
      const abandonedConversations = totalLeads - completedConversations;
      const conversionRate =
        totalLeads > 0 ? (completedConversations / totalLeads) * 100 : 0;

      const conversationTimes = allUsers
        .filter((user: any) => user.createdAt && user.lastInteractionAt)
        .map(
          (user: any) =>
            user.lastInteractionAt.toMillis() - user.createdAt.toMillis()
        );

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

      // Fetch daily leads
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      const dailyQuery = query(
        usersRef,
        where("createdAt", ">=", startTimestamp),
        where("createdAt", "<=", endTimestamp)
      );
      const dailySnapshot = await getDocs(dailyQuery);
      const leads = dailySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDailyLeads(leads);

    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [usersRef, selectedDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, dailyLeads, isLoading, refetchStats: fetchStats };
}
