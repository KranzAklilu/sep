"use client";

import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { Badge } from "~/components/ui/badge";
import { CreateUserDialog } from "./create-user-dialog";
import { XIcon } from "lucide-react";
import { toast } from "~/components/ui/use-toast";

const columnHelper = createColumnHelper<RouterOutputs["user"]["getUsers"][0]>();
export const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ getValue }) => <p>{!getValue() ? "-" : getValue()}</p>,
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ getValue }) => (
      <Badge variant={getValue() === "Admin" ? "default" : "secondary"}>
        {getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("id", {
    header: "Delete",
    cell: ({ getValue }) => <DeleteUserButton id={getValue()} />,
  }),
];

export default function UserTable() {
  const { data } = api.user.getUsers.useQuery();

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex-grow" />
        <CreateUserDialog />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-full border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const DeleteUserButton = ({ id }: { id: string }) => {
  const util = api.useContext();
  const { mutateAsync } = api.user.delete.useMutation({
    onSuccess: async () => {
      await util.user.getUsers.invalidate();
      toast({ title: "User deleted" });
    },
  });
  return (
    <Button
      size="sm"
      onClick={async () => await mutateAsync(id)}
      variant={"destructive"}
    >
      <XIcon />
    </Button>
  );
};
