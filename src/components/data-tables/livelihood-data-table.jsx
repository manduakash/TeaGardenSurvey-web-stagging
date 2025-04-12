"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { Eye, FileSpreadsheet } from "lucide-react";
import { Card } from "../ui/card";

export function LivelihoodDataTable({ data: initialData }) {
  const [data, setData] = React.useState(() => initialData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null); // State to store the selected row
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Sl. No.",
      },
      {
        accessorKey: "household_id",
        header: "Household",
      },
      {
        accessorKey: "shg_member",
        header: "SHG Member",
        cell: ({ row }) => (
          <Badge variant="outline" className={row.original.shg_member ? "text-green-500" : "text-red-500"}>
            {row.original.shg_member ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "wants_to_join_shg",
        header: "Wants to Join SHG",
        cell: ({ row }) => (
          <Badge variant="outline" className={row.original.wants_to_join_shg ? "text-green-500" : "text-red-500"}>
            {row.original.wants_to_join_shg ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "training_required",
        header: "Training Required",
        cell: ({ row }) => (
          <Badge variant="outline" className={row.original.training_required ? "text-green-500" : "text-red-500"}>
            {row.original.training_required ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "training_option",
        header: "Training Option",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              setSelectedRow(row?.original); // Set the selected row data
              setIsDialogOpen(true); // Open the dialog
            }}
          >
            <Eye className="text-cyan-600" />View
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle Excel file export
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Livelihood Data");
    XLSX.writeFile(workbook, "livelihood_data.xlsx");
  };

  return (
    <div className="overflow-hidden mx-10">
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Search by household ID, SHG member, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hover:bg-green-100 bg-green-50 border-green-700/40"
            onClick={handleExportToExcel}
          >
            <FileSpreadsheet className="text-green-700" /> Export to Excel
          </Button>
        </div>
      </div>
      <Card className="overflow-hidden rounded-lg border shadow-md dark:border-slate-700 dark:bg-slate-800 py-0">
        <Table>
          <TableHeader className="bg-slate-100 dark:bg-slate-700 my-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
          <span className="font-bold">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span> | Total Records: {filteredData.length}
          </div>
          <div className="flex items-center gap-2">
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
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="flex flex-col items-center bg-cyan-600 text-white p-4 rounded-t-lg">
            <DialogTitle>Household Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="font-medium">Household ID:</div>
            <div>{selectedRow?.household_id}</div>

            <div className="font-medium">SHG Member:</div>
            <Badge className={selectedRow?.shg_member ? "bg-green-500" : "bg-red-500"}>
              {selectedRow?.shg_member ? "Yes" : "No"}
            </Badge>

            <div className="font-medium">Wants to Join SHG:</div>
            <Badge className={selectedRow?.wants_to_join_shg ? "bg-green-500" : "bg-red-500"}>
              {selectedRow?.wants_to_join_shg ? "Yes" : "No"}
            </Badge>

            <div className="font-medium">Training Required:</div>
            <Badge className={selectedRow?.training_required ? "bg-green-500" : "bg-red-500"}>
              {selectedRow?.training_required ? "Yes" : "No"}
            </Badge>

            <div className="font-medium">Training Option:</div>
            <div>{selectedRow?.training_option || "N/A"}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
