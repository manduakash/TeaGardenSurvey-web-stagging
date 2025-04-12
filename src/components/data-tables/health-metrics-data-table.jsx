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
import { Eye, FileSpreadsheet, IconChevronsLeft, IconChevronLeft, IconChevronRight, IconChevronsRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Card } from "../ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function HealthMetricsDataTable({ data: initialData }) {
  const [data, setData] = React.useState(() => initialData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
      { accessorKey: "id", header: "Sl. No." },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "gender", header: "Gender" },
      { accessorKey: "age", header: "Age" },
      { accessorKey: "height", header: "Height (cm)" },
      { accessorKey: "weight", header: "Weight (kg)" },
      { accessorKey: "bmi", header: "BMI" },
      {
        accessorKey: "nutrition_status",
        header: "Nutrition Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={
              row?.original?.nutrition_status === "SAM"
                ? "text-red-500"
                : row?.original?.nutrition_status === "MAM"
                  ? "text-yellow-500"
                  : "text-green-500"
            }
          >
            {row?.original?.nutrition_status}
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
            onClick={() => {
              setSelectedRow(row?.original);
              setIsDialogOpen(true);
            }}
          >
            <Eye className="text-cyan-600" /> View
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Health Metrics Data");
    XLSX.writeFile(workbook, "health_metrics_data.xlsx");
  };

  return (
    <div className="overflow-hidden mx-10">
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Search by name, gender, age, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3"
        />
        <Button variant="outline" onClick={handleExportToExcel}>
          <FileSpreadsheet className="text-green-700" /> Export to Excel
        </Button>
      </div>
      <Card className="border py-0 rounded-xl">
        <Table className="rounded-xl overflow-hidden">
          <TableHeader className="rounded-t-xl bg-gray-200">
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup?.id}>
                {headerGroup?.headers?.map((header) => (
                  <TableHead key={header?.id}>{flexRender(header?.column?.columnDef?.header, header?.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Label>Rows per page</Label>
            <Select value={`${pagination.pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>Page {pagination.pageIndex + 1} of {table.getPageCount()}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft /></Button>
            <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft /></Button>
            <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight /></Button>
            <Button variant="outline" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight /></Button>
          </div>
        </div>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="flex flex-col items-center bg-cyan-600 text-white p-4 rounded-t-lg">
            <DialogTitle>Health Info.</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="font-medium">Household No:</div>
            <div>{"WB-H2Y-"+selectedRow?.household_id}</div>

            <div className="font-medium">Name:</div>
            <div>{selectedRow?.name}</div>

            <div className="font-medium">Gender:</div>
            <div>{selectedRow?.gender}</div>

            <div className="font-medium">Date of Birth:</div>
            <div>{selectedRow?.dob}</div>

            <div className="font-medium">Age:</div>
            <div>{selectedRow?.age}</div>

            <div className="font-medium">Height (cm):</div>
            <div>{selectedRow?.height}</div>

            <div className="font-medium">Weight (kg):</div>
            <div>{selectedRow?.weight}</div>

            <div className="font-medium">BMI:</div>
            <div>{selectedRow?.bmi}</div>

            <div className="font-medium">Nutrition Status:</div>
            <div>{selectedRow?.nutrition_status}</div>

            <div className="font-medium">Blood Pressure:</div>
            <div>{selectedRow?.bp}</div>

            <div className="font-medium">Sugar Level:</div>
            <div>{selectedRow?.sugar_level}</div>

            <div className="font-medium">Remarks:</div>
            <div>{selectedRow?.remarks}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
