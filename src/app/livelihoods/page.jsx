"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { DataTable } from "@/components/data-tables/reusable-datatable"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
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
  ]

  const data = [
    {
      id: 1,
      household_id: "WBH001",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Tailoring",
    },
    {
      id: 2,
      household_id: "WBH002",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Handicrafts",
    },
    {
      id: 3,
      household_id: "WBH003",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 0,
      training_option: "None",
    },
    {
      id: 4,
      household_id: "WBH004",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Weaving",
    },
    {
      id: 5,
      household_id: "WBH005",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Organic Farming",
    },
    {
      id: 6,
      household_id: "WBH006",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Mushroom Cultivation",
    },
    {
      id: 7,
      household_id: "WBH007",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 0,
      training_option: "None",
    },
    {
      id: 8,
      household_id: "WBH008",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Animal Husbandry",
    },
    {
      id: 9,
      household_id: "WBH009",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Spice Processing",
    },
    {
      id: 10,
      household_id: "WBH010",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 0,
      training_option: "None",
    },
    {
      id: 11,
      household_id: "WBH011",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Bee Keeping",
    },
    {
      id: 12,
      household_id: "WBH012",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Poultry Farming",
    },
    {
      id: 13,
      household_id: "WBH013",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Dairy Farming",
    },
    {
      id: 14,
      household_id: "WBH014",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 0,
      training_option: "None",
    },
    {
      id: 15,
      household_id: "WBH015",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Carpentry",
    },
    {
      id: 16,
      household_id: "WBH016",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Candle Making",
    },
    {
      id: 17,
      household_id: "WBH017",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Jute Bag Making",
    },
    {
      id: 18,
      household_id: "WBH018",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 0,
      training_option: "None",
    },
    {
      id: 19,
      household_id: "WBH019",
      shg_member: 0,
      wants_to_join_shg: 1,
      training_required: 1,
      training_option: "Papad Making",
    },
    {
      id: 20,
      household_id: "WBH020",
      shg_member: 1,
      wants_to_join_shg: 0,
      training_required: 1,
      training_option: "Pickle Making",
    }
  ];


  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-10">
              <DataTable data={data} columns={columns} />

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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
