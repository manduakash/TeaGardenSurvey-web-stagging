"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Bar, Pie, Line, Doughnut, Radar, PolarArea } from "react-chartjs-2";
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
  // Example Data for Charts
  const householdSurveyData = {
    labels: ["Household 1", "Household 2", "Household 3", "Household 4"],
    datasets: [
      {
        label: "Number of Members",
        data: [5, 7, 4, 6],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const healthMetricsData = {
    labels: ["BP Cases", "Sugar Cases", "SAM Cases", "MAM Cases"],
    datasets: [
      {
        label: "Health Metrics",
        data: [40, 30, 15, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const schemeEnrollmentData = {
    labels: ["Swasthya Sathi", "SC/ST Card", "SHG Membership"],
    datasets: [
      {
        label: "Scheme Enrollment",
        data: [70, 50, 40],
        backgroundColor: [
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 205, 86, 0.5)",
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const shgCreditLinkageData = {
    labels: ["Training Received", "Credit Linkage"],
    datasets: [
      {
        label: "SHG & Credit Linkage",
        data: [60, 40],
        backgroundColor: ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const lowBirthWeightData = {
    labels: ["Normal Birthweight", "Low Birthweight"],
    datasets: [
      {
        label: "Birthweight Cases",
        data: [80, 20],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const trainingImpactData = {
    labels: ["Training Impact"],
    datasets: [
      {
        label: "Impact",
        data: [70],
        backgroundColor: ["rgba(54, 162, 235, 0.5)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const welfareProgramsData = {
    labels: ["Welfare Program 1", "Welfare Program 2", "Welfare Program 3", "Welfare Program 4", "Welfare Program 5", "Welfare Program 6"],
    datasets: [
      {
        label: "Welfare Programs",
        data: [50, 30, 20, 10, 5, 20],
        backgroundColor: [
          "rgba(255, 206, 86, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Bar Chart: Household Survey */}
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Household Survey Data</h2>
              <Bar data={householdSurveyData} />
            </div>

            {/* Pie Chart: Health Metrics */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Health Metrics</h2>
              <Pie data={healthMetricsData} />
            </div>

            {/* Line Chart: Scheme Enrollment */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Scheme Enrollment</h2>
              <div className="my-auto py-auto flex flex-col justify-between">

              <h2 className="text-xl font-bold mb-4 text-transparent py-4">s</h2>
              <Line data={schemeEnrollmentData} />
              </div>
            </div>

            {/* Doughnut Chart: SHG & Credit Linkage */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">SHG & Credit Linkage</h2>
              <Doughnut data={shgCreditLinkageData} />
            </div>

            {/* Polar Area Chart: Low Birthweight Cases */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Low Birthweight Cases</h2>
              <PolarArea data={lowBirthWeightData} />
            </div>


            {/* Bar Chart: Welfare Programs */}
            <div className="col-span-3 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Welfare Programs</h2>
              <Bar data={welfareProgramsData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}