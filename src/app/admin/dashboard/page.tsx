"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { stats, dailyLeads, isLoading, refetchStats } = useDashboardStats(
    date
  );

  const StatCard = ({ title, value, isLoading }: { title: string, value: string | number, isLoading: boolean }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Leads Totais" value={stats.totalLeads} isLoading={isLoading} />
        <StatCard title="Leads Online" value={stats.onlineLeads} isLoading={isLoading} />
        <StatCard title="Conversas Concluídas" value={`${stats.completedConversations} / ${stats.abandonedConversations}`} isLoading={isLoading} />
        <StatCard title="Taxa de Conversão" value={`${stats.conversionRate.toFixed(1)}%`} isLoading={isLoading} />
        <StatCard title="Tempo Médio de Conversa" value={`${stats.avgConversationTime} min`} isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Leads do Dia</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Horário de Início</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead>Etapa Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!isLoading && dailyLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                     <Link href={`/admin/conversations/${lead.id}`} className="text-primary hover:underline">
                        {lead.id.substring(0, 8)}...
                     </Link>
                  </TableCell>
                  <TableCell>{lead.email || "N/A"}</TableCell>
                  <TableCell>
                    {format(lead.createdAt.toDate(), "HH:mm:ss", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(lead.lastInteractionAt.toDate(), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{lead.currentStep || "N/A"}</TableCell>
                </TableRow>
              ))}
              {!isLoading && dailyLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nenhum lead encontrado para esta data.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
