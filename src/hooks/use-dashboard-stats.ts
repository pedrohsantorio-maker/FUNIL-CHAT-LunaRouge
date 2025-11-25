"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  query,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";

export function useDashboardStats(selectedDate?: Date) {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    totalLeads: 0,
    onlineLeads: 0,
    completedConversations: 0,
    abandonedConversations: 0,
    conversionRate: 0,
    avgConversationTime: 0,
  });
  const [dailyLeads, setDailyLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const usersRef = useMemo(() => collection(firestore, "users"), [firestore]);

  const calculateStats = useCallback((users: any[]) => {
    const totalLeads = users.length;

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const onlineLeads = users.filter(
      (user) => user.lastInteractionAt?.toMillis() > fiveMinutesAgo
    ).length;

    const completedConversations = users.filter(
      (user) => user.currentStep === 15 // Assuming step 15 is completion
    ).length;
    
    const abandonedConversations = totalLeads - completedConversations;
    
    const conversionRate = totalLeads > 0 ? (completedConversations / totalLeads) * 100 : 0;
    
    const conversationTimes = users
        .filter(user => user.createdAt && user.lastInteractionAt)
        .map(user => (user.lastInteractionAt.toMillis() - user.createdAt.toMillis()) / (1000 * 60)); // in minutes
    
    const avgConversationTime = conversationTimes.length > 0
      ? conversationTimes.reduce((a, b) => a + b, 0) / conversationTimes.length
      : 0;

    setStats({
      totalLeads,
      onlineLeads,
      completedConversations,
      abandonedConversations,
      conversionRate,
      avgConversationTime: Math.round(avgConversationTime),
    });

  }, []);

  const fetchDailyLeads = useCallback(() => {
    if (!selectedDate) return () => {};

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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDailyLeads(leads);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching daily leads:", error);
        setIsLoading(false);
    });

    return unsubscribe;
  }, [selectedDate, usersRef]);


  const refetchStats = useCallback(() => {
     // The onSnapshot listener will automatically refetch. 
     // This function can be used to manually trigger updates if needed in the future.
  }, []);

  useEffect(() => {
    const unsubscribeAll = onSnapshot(usersRef, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      calculateStats(allUsers);
    }, (error) => {
        console.error("Error fetching all users for stats:", error);
    });
    
    const unsubscribeDaily = fetchDailyLeads();

    const interval = setInterval(() => {
        // Recalculate online status and avg time based on current data without re-fetching all docs
        setStats(prevStats => {
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            const onlineLeads = dailyLeads.filter(
              (user) => user.lastInteractionAt?.toMillis() > fiveMinutesAgo
            ).length;
             return { ...prevStats, onlineLeads };
        })
    }, 5000); // Update every 5 seconds

    return () => {
      unsubscribeAll();
      unsubscribeDaily();
      clearInterval(interval);
    };
  }, [firestore, usersRef, calculateStats, fetchDailyLeads, dailyLeads]);

  return { stats, dailyLeads, isLoading, refetchStats };
}
