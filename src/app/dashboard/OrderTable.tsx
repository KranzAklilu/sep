"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnFiltersState,
  ExpandedState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { RouterOutputs } from "~/trpc/shared";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { DocumentDetailedSheet } from "~/components/DocumentDetailedSheet";
import { DataTableFacetedFilter } from "~/components/data-table-faceted-filter";
import { OrderItem } from "@prisma/client";
import { OrderType } from "~/types/order";

const columnHelper =
  createColumnHelper<RouterOutputs["order"]["getAllOrders"][0]>();
export const columns = [
  columnHelper.accessor("id", {
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          onClick={() => {
            row.toggleExpanded();
          }}
          variant="ghost"
        >
          {row.getIsExpanded() ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronUp size={16} />
          )}
        </Button>
      );
    },
  }),
  columnHelper.accessor("purchaseOrderId", {
    header: "PO. Number",
  }),
  // columnHelper.accessor("status", {
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("status")}</div>
  //   ),
  // }),
  columnHelper.accessor("purchaseOrder.billTo.name", {
    id: "client",
    header: "Client",
    filterFn: ({ original }, _, values) => {
      console.log(values, original);
      return values.includes(original.purchaseOrder.billTo.id);
    },
  }),
  columnHelper.accessor("commercialInvoice.destinationCountry", {
    header: "Destination",
  }),
  columnHelper.accessor("orderDate", {
    header: "PO Date",
    cell: ({ getValue }) => <>{format(getValue(), "dd.mm.yyyy")}</>,
  }),
  columnHelper.accessor("totalAmount", {
    header: "Total Quantity",
  }),
];

export default function OrderTable({
  data,
  clients,
}: {
  data: RouterOutputs["order"]["getAllOrders"];
  clients: RouterOutputs["clientRouter"]["getAll"];
}) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: data ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
  });

  console.log(expanded);

  const subRow = ({
    createdAt,
    type,
    document,
  }: {
    type: OrderType;
    createdAt: Date;
    OrderItem?: Partial<OrderItem>[] | undefined | null;
    document: { id: string; name: string; url: string };
  }) => {
    return (
      <TableRow>
        <TableCell>{type}</TableCell>

        <TableCell>{format(new Date(createdAt), "dd.mm.yyyy")}</TableCell>
        <TableCell>{document.name}</TableCell>
        <TableCell>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">Show details</Button>
            </SheetTrigger>
            <SheetContent className="min-w-[80%]">
              <SheetHeader>
                <SheetTitle>Document Analysis</SheetTitle>
                <SheetDescription>
                  file id: {document.id} <br /> name: {document.name}{" "}
                </SheetDescription>
              </SheetHeader>
              <DocumentDetailedSheet id={document.id} />
            </SheetContent>
          </Sheet>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {table.getColumn("client") && clients && (
          <DataTableFacetedFilter
            column={table.getColumn("client")}
            title="Client"
            options={clients.map((c) => ({ label: c.name, value: c.id }))}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column, idx) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={idx}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
              table.getRowModel().rows.map((row) => {
                if (!data) return <></>;
                const d = data[row.index];
                const purchaseOrder = d?.purchaseOrder;
                const salesOrder = d?.salesOrder;
                const commercialInvoice = d?.commercialInvoice;
                const orderQuantities = d?.OrderQuantities;
                const orderConfirmation = d?.orderConfirmation;
                const deliveryNotes = d?.deliveryNote;
                const alcholDocument = d?.AlcoholDocument;
                const eur1 = d?.Eur1Document;
                const shipments = d?.shipments;
                const shipmentPreAlerts = d?.ShipmentPreAlerts;
                const customClearance = d?.CustomClearance;
                const trc2Document = d?.Trc2Document;
                const finalCommercialInvoice = d?.FinalCommercialInvoice;

                return (
                  <React.Fragment key={row.id}>
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
                    {row.getIsExpanded() && d && (
                      <TableRow key={row.id}>
                        <TableCell colSpan={1}></TableCell>
                        <TableCell colSpan={10}>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">
                                  Stage
                                </TableHead>
                                <TableHead>Date</TableHead>
                                {/* <TableHead>Total Quantity</TableHead> */}
                                <TableHead>Documents</TableHead>
                                <TableHead>Details</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {purchaseOrder &&
                                subRow({
                                  ...purchaseOrder,
                                  OrderItem: purchaseOrder.orderItems,
                                  type: OrderType.PO,
                                })}
                              {salesOrder?.map((so) =>
                                subRow({
                                  ...so,
                                  OrderItem: so.orderItems,
                                  type: OrderType.SO,
                                }),
                              )}

                              {commercialInvoice?.map((ci) =>
                                subRow({ ...ci, type: OrderType.CI }),
                              )}
                              {orderQuantities?.map((oq) =>
                                subRow({
                                  ...oq,
                                  OrderItem: oq.OrderItems,
                                  document: oq.InventoryStatus!.document,
                                  type: OrderType.IS,
                                }),
                              )}
                              {orderConfirmation?.map((ab) =>
                                subRow({
                                  ...ab,
                                  type: OrderType.AB,
                                }),
                              )}

                              {commercialInvoice?.map((ci) =>
                                subRow({ ...ci, type: OrderType.CI }),
                              )}
                              {deliveryNotes?.map((dn) =>
                                subRow({ ...dn, type: OrderType.AB_DN }),
                              )}
                              {alcholDocument?.map((ad) =>
                                subRow({ ...ad, type: OrderType.e_VD }),
                              )}
                              {eur1?.map((eur) =>
                                subRow({ ...eur, type: OrderType.EUR1 }),
                              )}

                              {shipments?.map((sp) =>
                                subRow({ ...sp, type: OrderType.SH }),
                              )}
                              {shipmentPreAlerts?.map((pa) =>
                                subRow({ ...pa, type: OrderType.DMS }),
                              )}
                              {customClearance?.map((cl) =>
                                subRow({ ...cl, type: OrderType.CDS_import }),
                              )}
                              {trc2Document?.map((tr) =>
                                subRow({ ...tr, type: OrderType.TRC2 }),
                              )}
                              {finalCommercialInvoice?.map((fci) =>
                                subRow({ ...fci, type: OrderType.CI }),
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}{" "}
                  </React.Fragment>
                );
              })
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
