"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Users,
  Wifi,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  BarChartBig,
  CalendarDays,
  MoreHorizontal,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  subDays,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const { stats, dailyLeads, isLoading } = useDashboardStats(date);

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    isLoading,
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  const handleDatePreset = (preset: "today" | "yesterday" | "7d" | "30d") => {
    const today = new Date();
    switch (preset) {
      case "today":
        setDate(today);
        break;
      case "yesterday":
        setDate(subDays(today, 1));
        break;
      case "7d":
        setDate(subDays(today, 7)); // this will set the start, but our current logic uses single date
        break;
      case "30d":
        setDate(subDays(today, 30)); // this will set the start, but our current logic uses single date
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePreset("today")}
        >
          Hoje
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePreset("yesterday")}
        >
          Ontem
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePreset("7d")}
        >
          7 dias
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDatePreset("30d")}
        >
          30 dias
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              size="sm"
              className={cn("w-[240px] justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{format(date, "PPP", { locale: ptBR })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Leads Totais"
          value={stats.totalLeads}
          description="Total de pessoas que iniciaram"
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title={`Leads em ${format(date, "dd/MM/yyyy")}`}
          value={dailyLeads.length}
          description="Novos leads na data selecionada"
          icon={CalendarDays}
          isLoading={isLoading}
        />
        <StatCard
          title="Leads Online"
          value={stats.onlineLeads}
          description="Usuários ativos nos últimos 5 min"
          icon={Wifi}
          isLoading={isLoading}
        />
        <StatCard
          title="Conversas Concluídas"
          value={stats.completedConversations}
          description="Leads que clicaram no link final"
          icon={CheckCircle2}
          isLoading={isLoading}
        />
        <StatCard
          title="Conversas Abandonadas"
          value={stats.abandonedConversations}
          description="Leads que não finalizaram"
          icon={XCircle}
          isLoading={isLoading}
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.conversionRate.toFixed(1)}%`}
          description="Percentual de leads que concluíram"
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Tempo Médio"
          value={stats.avgConversationTime}
          description="Duração média das conversas"
          icon={Clock}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead do Dia</TableHead>
                <TableHead>ID do Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Última Interação</TableHead>
                <TableHead>Etapa da Conversa</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading &&
                dailyLeads.map((lead, index) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      Lead {String(index + 1).padStart(2, "0")}
                    </TableCell>
                    <TableCell>{lead.id.substring(0, 8)}...</TableCell>
                    <TableCell>{lead.email || "N/A"}</TableCell>
                    <TableCell>
                      {format(lead.createdAt.toDate(), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(lead.lastInteractionAt.toDate(), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      {lead.currentStep ? `${lead.currentStep}/15` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/conversations/${lead.id}`}>
                              Ver Conversa
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && dailyLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum usuário encontrado para esta data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
