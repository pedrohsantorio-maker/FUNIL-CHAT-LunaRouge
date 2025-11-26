"use client";

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
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function UsersPage() {
  const firestore = useFirestore();
  const usersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, "users") : null),
    [firestore]
  );
  const usersQuery = useMemoFirebase(
    () =>
      usersCollection
        ? query(usersCollection, orderBy("createdAt", "desc"))
        : null,
    [usersCollection]
  );
  const { data: users, isLoading } = useCollection(usersQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>ID do Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Última Interação</TableHead>
              <TableHead>Etapa da Conversa</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading &&
              users?.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    Lead {String(users.length - index).padStart(2, "0")}
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? format(user.createdAt.toDate(), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {user.lastInteractionAt
                      ? formatDistanceToNow(user.lastInteractionAt.toDate(), {
                          addSuffix: true,
                          locale: ptBR,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {user.currentStep ? `${user.currentStep}/15` : "N/A"}
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
                          <Link href={`/admin/conversations/${user.id}`}>
                            Ver Conversa
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
