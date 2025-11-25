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
import { collection } from "firebase/firestore";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const firestore = useFirestore();
  const usersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, "users") : null),
    [firestore]
  );
  const { data: users, isLoading } = useCollection(usersCollection);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID do Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Última Interação</TableHead>
              <TableHead>Etapa Atual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            )}
            {!isLoading && users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/conversations/${user.id}`} className="text-primary hover:underline">
                    {user.id}
                  </Link>
                </TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>
                  {user.createdAt ? format(user.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'N/A'}
                </TableCell>
                <TableCell>
                  {user.lastInteractionAt ? formatDistanceToNow(user.lastInteractionAt.toDate(), {
                    addSuffix: true,
                    locale: ptBR,
                  }) : 'N/A'}
                </TableCell>
                <TableCell>{user.currentStep || "N/A"}</TableCell>
              </TableRow>
            ))}
            {!isLoading && users?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Nenhum lead encontrado.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
