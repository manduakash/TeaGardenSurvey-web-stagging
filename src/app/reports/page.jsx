"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
} from "chart.js";
import { DataTable } from "@/components/data-tables/reusable-datatable";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

export default function Page() {
  // Dummy Data for Charts and Tables
  const districtData = {
    labels: ["District A", "District B", "District C", "District D"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [120, 150, 180, 200],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const districtTableData = [
    {
      district: "District A",
      surveyedHouseholds: 120,
      healthCamps: 5,
      membersCount: 450,
      welfareSchemes: 8,
      selfHelpGroups: 12,
    },
    {
      district: "District B",
      surveyedHouseholds: 150,
      healthCamps: 7,
      membersCount: 600,
      welfareSchemes: 10,
      selfHelpGroups: 15,
    },
    {
      district: "District C",
      surveyedHouseholds: 180,
      healthCamps: 6,
      membersCount: 550,
      welfareSchemes: 9,
      selfHelpGroups: 14,
    },
    {
      district: "District D",
      surveyedHouseholds: 200,
      healthCamps: 10,
      membersCount: 700,
      welfareSchemes: 12,
      selfHelpGroups: 18,
    },
  ];

  const subDivisionData = {
    labels: ["Sub-Division 1", "Sub-Division 2", "Sub-Division 3"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [80, 100, 90],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const subDivisionTableData = [
    {
      subDivision: "Sub-Division 1",
      surveyedHouseholds: 80,
      healthCamps: 3,
      membersCount: 300,
      welfareSchemes: 5,
      selfHelpGroups: 6,
    },
    {
      subDivision: "Sub-Division 2",
      surveyedHouseholds: 100,
      healthCamps: 4,
      membersCount: 400,
      welfareSchemes: 6,
      selfHelpGroups: 8,
    },
    {
      subDivision: "Sub-Division 3",
      surveyedHouseholds: 90,
      healthCamps: 5,
      membersCount: 350,
      welfareSchemes: 7,
      selfHelpGroups: 9,
    },
  ];

  const blockData = {
    labels: ["Block 1", "Block 2", "Block 3", "Block 4"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [50, 70, 60, 80],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const blockTableData = [
    {
      block: "Block 1",
      surveyedHouseholds: 50,
      healthCamps: 2,
      membersCount: 200,
      welfareSchemes: 3,
      selfHelpGroups: 4,
    },
    {
      block: "Block 2",
      surveyedHouseholds: 70,
      healthCamps: 3,
      membersCount: 300,
      welfareSchemes: 4,
      selfHelpGroups: 5,
    },
    {
      block: "Block 3",
      surveyedHouseholds: 60,
      healthCamps: 2,
      membersCount: 250,
      welfareSchemes: 3,
      selfHelpGroups: 6,
    },
    {
      block: "Block 4",
      surveyedHouseholds: 80,
      healthCamps: 4,
      membersCount: 400,
      welfareSchemes: 5,
      selfHelpGroups: 7,
    },
  ];

  const municipalityData = {
    labels: ["Municipality A", "Municipality B", "Municipality C"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [100, 120, 110],
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const municipalityTableData = [
    {
      municipality: "Municipality A",
      surveyedHouseholds: 100,
      healthCamps: 3,
      membersCount: 350,
      welfareSchemes: 4,
      selfHelpGroups: 5,
    },
    {
      municipality: "Municipality B",
      surveyedHouseholds: 120,
      healthCamps: 4,
      membersCount: 400,
      welfareSchemes: 5,
      selfHelpGroups: 6,
    },
    {
      municipality: "Municipality C",
      surveyedHouseholds: 110,
      healthCamps: 3,
      membersCount: 370,
      welfareSchemes: 4,
      selfHelpGroups: 5,
    },
  ];

  const wardData = {
    labels: ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [30, 40, 35, 50, 45],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const wardTableData = [
    {
      ward: "Ward 1",
      surveyedHouseholds: 30,
      healthCamps: 1,
      membersCount: 150,
      welfareSchemes: 2,
      selfHelpGroups: 3,
    },
    {
      ward: "Ward 2",
      surveyedHouseholds: 40,
      healthCamps: 2,
      membersCount: 200,
      welfareSchemes: 3,
      selfHelpGroups: 4,
    },
    {
      ward: "Ward 3",
      surveyedHouseholds: 35,
      healthCamps: 1,
      membersCount: 180,
      welfareSchemes: 2,
      selfHelpGroups: 3,
    },
    {
      ward: "Ward 4",
      surveyedHouseholds: 50,
      healthCamps: 3,
      membersCount: 250,
      welfareSchemes: 4,
      selfHelpGroups: 5,
    },
    {
      ward: "Ward 5",
      surveyedHouseholds: 45,
      healthCamps: 2,
      membersCount: 220,
      welfareSchemes: 3,
      selfHelpGroups: 4,
    },
  ];

  const villageData = {
    labels: ["Village A", "Village B", "Village C", "Village D"],
    datasets: [
      {
        label: "Surveyed Households",
        data: [20, 25, 30, 35],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const villageTableData = [
    {
      village: "Village A",
      surveyedHouseholds: 20,
      healthCamps: 1,
      membersCount: 100,
      welfareSchemes: 2,
      selfHelpGroups: 3,
    },
    {
      village: "Village B",
      surveyedHouseholds: 25,
      healthCamps: 2,
      membersCount: 120,
      welfareSchemes: 3,
      selfHelpGroups: 4,
    },
    {
      village: "Village C",
      surveyedHouseholds: 30,
      healthCamps: 2,
      membersCount: 150,
      welfareSchemes: 4,
      selfHelpGroups: 5,
    },
    {
      village: "Village D",
      surveyedHouseholds: 35,
      healthCamps: 3,
      membersCount: 180,
      welfareSchemes: 5,
      selfHelpGroups: 6,
    },
  ];

  // Define columns for tables
  const districtColumns = [
    { header: "District", accessorKey: "district" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
  ];

  const subDivisionColumns = [
    { header: "Sub-Division", accessorKey: "subDivision" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
  ];

  const blockColumns = [
    { header: "Block", accessorKey: "block" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
  ];

  const municipalityColumns = [
    { header: "Municipality", accessorKey: "municipality" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
  ];

  const wardColumns = [
    { header: "Ward", accessorKey: "ward" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
  ];

  const villageColumns = [
    { header: "Village", accessorKey: "village" },
    { header: "Surveyed Households", accessorKey: "surveyedHouseholds" },
    { header: "Health Camps", accessorKey: "healthCamps" },
    { header: "Members Count", accessorKey: "membersCount" },
    { header: "Welfare Schemes", accessorKey: "welfareSchemes" },
    { header: "Self-Help Groups", accessorKey: "selfHelpGroups" },
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
        <div className="flex flex-1 flex-col p-4 sm:p-6">
          {/* Tabs Navigation */}
          <Tabs defaultValue="district">
            <TabsList className="flex flex-wrap justify-center gap-1 sm:gap-1 bg-slate-100 rounded-lg">
              <TabsTrigger value="district" className="text-xs cursor-pointer sm:text-base">
                District Wise
              </TabsTrigger>
              <TabsTrigger value="sub-division" className="text-xs cursor-pointer sm:text-base">
                Sub-Division Wise
              </TabsTrigger>
              <TabsTrigger value="block" className="text-xs cursor-pointer sm:text-base">
                Block Wise
              </TabsTrigger>
              <TabsTrigger value="municipality" className="text-xs cursor-pointer sm:text-base">
                Municipality Wise
              </TabsTrigger>
              <TabsTrigger value="ward" className="text-xs cursor-pointer sm:text-base">
                Ward Wise
              </TabsTrigger>
              <TabsTrigger value="village" className="text-xs cursor-pointer sm:text-base">
                Village Wise
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
              {/* District Wise Data */}
              <TabsContent value="district" className="px-0">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  District Wise Data
                </h2>
                <div className="overflow-x-auto px-0">
                  <DataTable data={districtTableData} columns={districtColumns} />
                </div>
                <div className="mt-4">
                  <Bar data={districtData} className="w-full" />
                </div>
              </TabsContent>

              {/* Sub-Division Wise Data */}
              <TabsContent value="sub-division">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  Sub-Division Wise Data
                </h2>
                <div className="overflow-x-auto">
                  <DataTable data={subDivisionTableData} columns={subDivisionColumns} />
                </div>
                <div className="mt-4">
                  <Bar data={subDivisionData} className="w-full" />
                </div>
              </TabsContent>

              {/* Block Wise Data */}
              <TabsContent value="block">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  Block Wise Data
                </h2>
                <div className="overflow-x-auto">
                  <DataTable data={blockTableData} columns={blockColumns} />
                </div>
                <div className="mt-4">
                  <Bar data={blockData} className="w-full" />
                </div>
              </TabsContent>

              {/* Municipality Wise Data */}
              <TabsContent value="municipality">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  Municipality Wise Data
                </h2>
                <div className="overflow-x-auto">
                  <DataTable
                    data={municipalityTableData}
                    columns={municipalityColumns}
                  />
                </div>
                <div className="mt-4">
                  <Bar data={municipalityData} className="w-full" />
                </div>
              </TabsContent>

              {/* Ward Wise Data */}
              <TabsContent value="ward">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  Ward Wise Data
                </h2>
                <div className="overflow-x-auto">
                  <DataTable data={wardTableData} columns={wardColumns} />
                </div>
                <div className="mt-4">
                  <Bar data={wardData} className="w-full" />
                </div>
              </TabsContent>

              {/* Village Wise Data */}
              <TabsContent value="village">
                <h2 className="text-lg sm:text-2xl font-bold mb-4">
                  Village Wise Data
                </h2>
                <div className="overflow-x-auto">
                  <DataTable data={villageTableData} columns={villageColumns} />
                </div>
                <div className="mt-4">
                  <Bar data={villageData} className="w-full" />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}