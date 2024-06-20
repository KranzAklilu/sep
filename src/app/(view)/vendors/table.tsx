"use client";

import { useRouter } from "next/navigation";
import { useToast } from "~/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { User } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

export default function AdminDashboardTable({ users: usr }: { users: User[] }) {
  const { toast } = useToast();

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Requested at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!usr.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No result
              </TableCell>
            </TableRow>
          )}
          {usr.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Link target="_blank" href={user.licenceDocument || ""}>
                  Document
                </Link>
              </TableCell>
              <TableCell>{format(user.createdAt, "yyyy-MM-dd")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
