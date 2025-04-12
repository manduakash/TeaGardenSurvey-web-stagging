"use client";

import * as React from "react";
import dynamic from "next/dynamic"; // Import dynamic for client-side rendering
import L from "leaflet"; // Import Leaflet for custom marker
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { Eye, FileSpreadsheet } from "lucide-react";
import { Card } from "../ui/card";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Define a custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png", // Default Leaflet marker icon
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup anchor point
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png", // Shadow image
  shadowSize: [41, 41], // Size of the shadow
});

export function HouseHoldsDataTable({ data: initialData }) {
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
        accessorKey: "survey_id",
        header: "Survey ID",
      },
      {
        accessorKey: "district",
        header: "District",
      },
      {
        accessorKey: "sub_division",
        header: "Subdivision",
      },
      {
        accessorKey: "block",
        header: "Block",
      },
      {
        accessorKey: "gp",
        header: "Gram Panchayat",
      },
      {
        accessorKey: "village",
        header: "Village",
      },
      {
        accessorKey: "house_number",
        header: "House Number",
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Households Data");
    XLSX.writeFile(workbook, "households_data.xlsx");
  };

  return (
    <div className="overflow-hidden mx-10">
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Search by survey ID, state, district, etc."
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
        <DialogContent className="w-[80%] min-w-[80%] h-auto p-0">
          <DialogHeader className="flex items-center bg-cyan-600 text-white p-4 rounded-t-lg">
            <DialogTitle className="text-4xl font-semibold">Survey Details</DialogTitle>
          </DialogHeader>

          {/* Main Content with Two Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-2 w-full ">
            {/* Left Side: Survey Details (Scrollable) */}
            <div className="overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-2 gap-2 text-lg">
                <div className="font-semibold">Survey ID:</div>
                <div>{selectedRow?.survey_id}</div>

                <div className="font-semibold">State:</div>
                <div>{selectedRow?.state}</div>

                <div className="font-semibold">District:</div>
                <div>{selectedRow?.district}</div>

                <div className="font-semibold">Sub Division:</div>
                <div>{selectedRow?.sub_division}</div>

                <div className="font-semibold">Block:</div>
                <div>{selectedRow?.block}</div>

                <div className="font-semibold">Gram Panchayat:</div>
                <div>{selectedRow?.gp}</div>

                <div className="font-semibold">Village:</div>
                <div>{selectedRow?.village}</div>

                <div className="font-semibold">House Number:</div>
                <div>{selectedRow?.house_number}</div>

                <div className="font-semibold">Family Income:</div>
                <div>₹{selectedRow?.family_income.toLocaleString()}</div>

                {selectedRow?.latitude && selectedRow?.longitude && (
                  <>
                    <div className="font-semibold">Latitude:</div>
                    <div>{selectedRow?.latitude}</div>

                    <div className="font-semibold">Longitude:</div>
                    <div>{selectedRow?.longitude}</div>
                  </>
                )}
              </div>
            </div>

            {/* Right Side: Map (Fixed) */}
            {selectedRow?.latitude && selectedRow?.longitude && (
              <div className="flex items-center justify-center p-6">
                <MapContainer
                  center={[selectedRow?.latitude, selectedRow?.longitude]}
                  zoom={13}
                  style={{ height: "90%", width: "100%", borderRadius: "8px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[selectedRow?.latitude, selectedRow?.longitude]}
                    icon={customMarkerIcon} // Use the custom marker icon
                  >
                    <Popup>
                      <strong>Household Location</strong>
                      <br />
                      Latitude: {selectedRow?.latitude}
                      <br />
                      Longitude: {selectedRow?.longitude}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
