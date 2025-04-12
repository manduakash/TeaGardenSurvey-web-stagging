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

export function WelfareDataTable({ data: initialData }) {
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
        header: "Household ID",
      },
      {
        accessorKey: "caste_certificate",
        header: "Caste Certificate",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={row.original.caste_certificate ? "text-green-500" : "text-red-500"}
          >
            {row.original.caste_certificate ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "lakshmir_bhandar",
        header: "Lakshmir Bhandar",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={row.original.lakshmir_bhandar ? "text-green-500" : "text-red-500"}
          >
            {row.original.lakshmir_bhandar ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "swasthya_sathi",
        header: "Swasthya Sathi",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={row.original.swasthya_sathi ? "text-green-500" : "text-red-500"}
          >
            {row.original.swasthya_sathi ? "Yes" : "No"}
          </Badge>
        ),
      },
      {
        accessorKey: "old_age_pension",
        header: "Old Age Pension",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={row.original.old_age_pension ? "text-green-500" : "text-red-500"}
          >
            {row.original.old_age_pension ? "Yes" : "No"}
          </Badge>
        ),
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Welfare Data");
    XLSX.writeFile(workbook, "welfare_data.xlsx");
  };

  return (
    <div className="overflow-hidden mx-10">
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Search by household ID, caste certificate, etc."
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
            <span className="font-bold">Page {table.getState().pagination.pageIndex + 1} of {table?.getPageCount()}</span> | Total Records: {filteredData?.length}
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
          {selectedRow && (
            <div className="grid grid-cols-2 gap-4 p-6">
              <div className="font-medium">Household ID:</div>
              <div>{selectedRow.household_id}</div>

              <div className="font-medium">Caste Certificate:</div>
              <Badge className={selectedRow.caste_certificate ? "bg-green-500" : "bg-red-500"}>
                {selectedRow.caste_certificate ? "Yes" : "No"}
              </Badge>

              <div className="font-medium">Lakshmir Bhandar:</div>
              <Badge className={selectedRow.lakshmir_bhandar ? "bg-green-500" : "bg-red-500"}>
                {selectedRow.lakshmir_bhandar ? "Yes" : "No"}
              </Badge>

              <div className="font-medium">Swasthya Sathi:</div>
              <Badge className={selectedRow.swasthya_sathi ? "bg-green-500" : "bg-red-500"}>
                {selectedRow.swasthya_sathi ? "Yes" : "No"}
              </Badge>

              <div className="font-medium">Old Age Pension:</div>
              <Badge className={selectedRow.old_age_pension ? "bg-green-500" : "bg-red-500"}>
                {selectedRow.old_age_pension ? "Yes" : "No"}
              </Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
