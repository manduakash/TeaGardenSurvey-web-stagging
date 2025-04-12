"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { BpReportChart } from "@/components/charts/bp-report-chart"
import { SamMamChart } from "@/components/charts/sam-mam-chart"
import { SugarReportChart } from "@/components/charts/sugar-report-chart"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getDashboardCount } from "./api"

export default function Page() {
  const [dashboardCount, setDashboardCount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchDashboardCount = async () => {
      setIsLoading(true)
      try {
        const response = await getDashboardCount();
        console.log(response);

        if (response.success) {
          setDashboardCount(response.data[0]);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error('Error fetching dashboard count:', error);
      }
      finally {
        setIsLoading(false)
      }
    };

    fetchDashboardCount();
  }, []); // Add dependencies if needed


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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards dashboardCount={dashboardCount} isLoading={isLoading} />
              <div className="px-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                {/* <ChartAreaInteractive /> */}


                <SamMamChart
                  title="Women Nutrition Report"
                  description="SAM vs MAM - Female"
                  data={[
                    { label: "SAM", value: dashboardCount?.sam_women, fill: "hsl(var(--chart-1))" },
                    { label: "MAM", value: dashboardCount?.mam_women, fill: "hsl(var(--chart-2))" },
                    { label: "Normal", value: dashboardCount?.normal_women, fill: "hsl(var(--chart-3))" },
                  ]}
                  isLoading={isLoading}
                />

                <SamMamChart
                  title="Children Nutrition Report"
                  description="SAM vs MAM - Children"
                  data={[
                    { label: "SAM", value: dashboardCount?.sam_children, fill: "hsl(var(--chart-1))" },
                    { label: "MAM", value: dashboardCount?.mam_children, fill: "hsl(var(--chart-2))" },
                    { label: "Normal", value: dashboardCount?.normal_children, fill: "hsl(var(--chart-3))" },
                  ]}
                  isLoading={isLoading}
                />

                <BpReportChart
                  data={[
                    { label: "Female", low: dashboardCount?.low_bp_women, high: dashboardCount?.high_bp_women },
                    { label: "Male", low: dashboardCount?.low_bp_all, high: dashboardCount?.high_bp_all },
                  ]}
                  isLoading={isLoading}
                />

                <SugarReportChart data={[
                  { label: "Female", low: dashboardCount?.low_sugar_women, high: dashboardCount?.high_sugar_women },
                  { label: "Male", low: dashboardCount?.low_sugar_all, high: dashboardCount?.high_sugar_all },
                ]}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
