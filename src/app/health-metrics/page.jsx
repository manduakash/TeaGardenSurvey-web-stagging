"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-tables/reusable-datatable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
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
  ];
  
  const data = [
    {
      household_id: 101,
      name: "Subhajit Das",
      gender: "Male",
      dob: "1985-05-15",
      age: 38,
      height: 175.5,
      weight: 70.2,
      bmi: 22.8,
      nutrition_status: "Normal",
      bp: "120/80",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 102,
      name: "Mousumi Banerjee",
      gender: "Female",
      dob: "1990-08-20",
      age: 33,
      height: 160.2,
      weight: 55.3,
      bmi: 21.5,
      nutrition_status: "MAM",
      bp: "130/85",
      sugar_level: "High",
      remarks: "Requires follow-up",
    },
    {
      household_id: 103,
      name: "Prasenjit Chatterjee",
      gender: "Male",
      dob: "1978-02-10",
      age: 46,
      height: 180.0,
      weight: 85.6,
      bmi: 26.4,
      nutrition_status: "Overweight",
      bp: "140/90",
      sugar_level: "High",
      remarks: "Monitor diet and exercise",
    },
    {
      household_id: 104,
      name: "Sutapa Ghosh",
      gender: "Female",
      dob: "2002-11-25",
      age: 21,
      height: 155.7,
      weight: 48.2,
      bmi: 19.9,
      nutrition_status: "Normal",
      bp: "110/70",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 105,
      name: "Arindam Mukherjee",
      gender: "Male",
      dob: "1965-06-18",
      age: 59,
      height: 170.2,
      weight: 90.5,
      bmi: 31.3,
      nutrition_status: "Obese",
      bp: "150/95",
      sugar_level: "Very High",
      remarks: "Requires medical attention",
    },
    {
      household_id: 106,
      name: "Ipshita Roy",
      gender: "Female",
      dob: "1998-03-07",
      age: 26,
      height: 167.5,
      weight: 65.4,
      bmi: 23.3,
      nutrition_status: "Normal",
      bp: "115/75",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 107,
      name: "Debojyoti Saha",
      gender: "Male",
      dob: "1983-09-12",
      age: 40,
      height: 175.0,
      weight: 82.0,
      bmi: 26.8,
      nutrition_status: "Overweight",
      bp: "135/88",
      sugar_level: "Borderline High",
      remarks: "Should exercise regularly",
    },
    {
      household_id: 108,
      name: "Rimpa Bhattacharya",
      gender: "Female",
      dob: "2000-01-30",
      age: 24,
      height: 162.3,
      weight: 58.7,
      bmi: 22.3,
      nutrition_status: "Normal",
      bp: "118/78",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 109,
      name: "Anirban Dutta",
      gender: "Male",
      dob: "1958-12-05",
      age: 66,
      height: 168.5,
      weight: 95.2,
      bmi: 33.6,
      nutrition_status: "Obese",
      bp: "160/100",
      sugar_level: "Very High",
      remarks: "Critical - needs urgent care",
    },
    {
      household_id: 110,
      name: "Shreya Sen",
      gender: "Female",
      dob: "1975-07-22",
      age: 49,
      height: 159.8,
      weight: 70.1,
      bmi: 27.4,
      nutrition_status: "Overweight",
      bp: "132/84",
      sugar_level: "Borderline High",
      remarks: "Needs diet monitoring",
    },
    {
      household_id: 101,
      name: "Subhajit Das",
      gender: "Male",
      dob: "1985-05-15",
      age: 38,
      height: 175.5,
      weight: 70.2,
      bmi: 22.8,
      nutrition_status: "Normal",
      bp: "120/80",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 102,
      name: "Mousumi Banerjee",
      gender: "Female",
      dob: "1990-08-20",
      age: 33,
      height: 160.2,
      weight: 55.3,
      bmi: 21.5,
      nutrition_status: "MAM",
      bp: "130/85",
      sugar_level: "High",
      remarks: "Requires follow-up",
    },
    {
      household_id: 103,
      name: "Prasenjit Chatterjee",
      gender: "Male",
      dob: "1978-02-10",
      age: 46,
      height: 180.0,
      weight: 85.6,
      bmi: 26.4,
      nutrition_status: "Overweight",
      bp: "140/90",
      sugar_level: "High",
      remarks: "Monitor diet and exercise",
    },
    {
      household_id: 104,
      name: "Sutapa Ghosh",
      gender: "Female",
      dob: "2002-11-25",
      age: 21,
      height: 155.7,
      weight: 48.2,
      bmi: 19.9,
      nutrition_status: "Normal",
      bp: "110/70",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 105,
      name: "Arindam Mukherjee",
      gender: "Male",
      dob: "1965-06-18",
      age: 59,
      height: 170.2,
      weight: 90.5,
      bmi: 31.3,
      nutrition_status: "Obese",
      bp: "150/95",
      sugar_level: "Very High",
      remarks: "Requires medical attention",
    },
    {
      household_id: 106,
      name: "Ipshita Roy",
      gender: "Female",
      dob: "1998-03-07",
      age: 26,
      height: 167.5,
      weight: 65.4,
      bmi: 23.3,
      nutrition_status: "Normal",
      bp: "115/75",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 107,
      name: "Debojyoti Saha",
      gender: "Male",
      dob: "1983-09-12",
      age: 40,
      height: 175.0,
      weight: 82.0,
      bmi: 26.8,
      nutrition_status: "Overweight",
      bp: "135/88",
      sugar_level: "Borderline High",
      remarks: "Should exercise regularly",
    },
    {
      household_id: 108,
      name: "Rimpa Bhattacharya",
      gender: "Female",
      dob: "2000-01-30",
      age: 24,
      height: 162.3,
      weight: 58.7,
      bmi: 22.3,
      nutrition_status: "Normal",
      bp: "118/78",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 109,
      name: "Anirban Dutta",
      gender: "Male",
      dob: "1958-12-05",
      age: 66,
      height: 168.5,
      weight: 95.2,
      bmi: 33.6,
      nutrition_status: "Obese",
      bp: "160/100",
      sugar_level: "Very High",
      remarks: "Critical - needs urgent care",
    },
    {
      household_id: 110,
      name: "Shreya Sen",
      gender: "Female",
      dob: "1975-07-22",
      age: 49,
      height: 159.8,
      weight: 70.1,
      bmi: 27.4,
      nutrition_status: "Overweight",
      bp: "132/84",
      sugar_level: "Borderline High",
      remarks: "Needs diet monitoring",
    },
    {
      household_id: 101,
      name: "Subhajit Das",
      gender: "Male",
      dob: "1985-05-15",
      age: 38,
      height: 175.5,
      weight: 70.2,
      bmi: 22.8,
      nutrition_status: "Normal",
      bp: "120/80",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 102,
      name: "Mousumi Banerjee",
      gender: "Female",
      dob: "1990-08-20",
      age: 33,
      height: 160.2,
      weight: 55.3,
      bmi: 21.5,
      nutrition_status: "MAM",
      bp: "130/85",
      sugar_level: "High",
      remarks: "Requires follow-up",
    },
    {
      household_id: 103,
      name: "Prasenjit Chatterjee",
      gender: "Male",
      dob: "1978-02-10",
      age: 46,
      height: 180.0,
      weight: 85.6,
      bmi: 26.4,
      nutrition_status: "Overweight",
      bp: "140/90",
      sugar_level: "High",
      remarks: "Monitor diet and exercise",
    },
    {
      household_id: 104,
      name: "Sutapa Ghosh",
      gender: "Female",
      dob: "2002-11-25",
      age: 21,
      height: 155.7,
      weight: 48.2,
      bmi: 19.9,
      nutrition_status: "Normal",
      bp: "110/70",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 105,
      name: "Arindam Mukherjee",
      gender: "Male",
      dob: "1965-06-18",
      age: 59,
      height: 170.2,
      weight: 90.5,
      bmi: 31.3,
      nutrition_status: "Obese",
      bp: "150/95",
      sugar_level: "Very High",
      remarks: "Requires medical attention",
    },
    {
      household_id: 106,
      name: "Ipshita Roy",
      gender: "Female",
      dob: "1998-03-07",
      age: 26,
      height: 167.5,
      weight: 65.4,
      bmi: 23.3,
      nutrition_status: "Normal",
      bp: "115/75",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 107,
      name: "Debojyoti Saha",
      gender: "Male",
      dob: "1983-09-12",
      age: 40,
      height: 175.0,
      weight: 82.0,
      bmi: 26.8,
      nutrition_status: "Overweight",
      bp: "135/88",
      sugar_level: "Borderline High",
      remarks: "Should exercise regularly",
    },
    {
      household_id: 108,
      name: "Rimpa Bhattacharya",
      gender: "Female",
      dob: "2000-01-30",
      age: 24,
      height: 162.3,
      weight: 58.7,
      bmi: 22.3,
      nutrition_status: "Normal",
      bp: "118/78",
      sugar_level: "Normal",
      remarks: "Healthy",
    },
    {
      household_id: 109,
      name: "Anirban Dutta",
      gender: "Male",
      dob: "1958-12-05",
      age: 66,
      height: 168.5,
      weight: 95.2,
      bmi: 33.6,
      nutrition_status: "Obese",
      bp: "160/100",
      sugar_level: "Very High",
      remarks: "Critical - needs urgent care",
    },
    {
      household_id: 110,
      name: "Shreya Sen",
      gender: "Female",
      dob: "1975-07-22",
      age: 49,
      height: 159.8,
      weight: 70.1,
      bmi: 27.4,
      nutrition_status: "Overweight",
      bp: "132/84",
      sugar_level: "Borderline High",
      remarks: "Needs diet monitoring",
    },
  ];


  return (
    (<SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)"
        }
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-10">
              <DataTable data={data} columns={columns} />

              {/* Dialog after click on view button in table */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-0">
                  <DialogHeader className="flex flex-col items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle>Health Info.</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 p-6">
                    <div className="font-medium">Household No:</div>
                    <div>{"WB-H2Y-" + selectedRow?.household_id}</div>

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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
