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

export default function Page() {
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
              <SectionCards />
              <div className="px-4 lg:px-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
                {/* <ChartAreaInteractive /> */}


                <SamMamChart
                  title="Women Nutrition Report"
                  description="SAM vs MAM - Female"
                  data={[
                    { label: "SAM", value: 48, fill: "hsl(var(--chart-1))" },
                    { label: "MAM", value: 82, fill: "hsl(var(--chart-2))" },
                    { label: "Normal", value: 320, fill: "hsl(var(--chart-3))" },
                  ]}
                />

                <SamMamChart
                  title="Children Nutrition Report"
                  description="SAM vs MAM - Children"
                  data={[
                    { label: "SAM", value: 66, fill: "hsl(var(--chart-1))" },
                    { label: "MAM", value: 120, fill: "hsl(var(--chart-2))" },
                    { label: "Normal", value: 410, fill: "hsl(var(--chart-3))" },
                  ]}
                />

                <BpReportChart
                  data={[
                    { label: "Female", low: 34, high: 66 },
                    { label: "Male", low: 28, high: 72 },
                  ]}
                />

                <SugarReportChart data={[
                  { label: "Female", low: 80, high: 145 },
                  { label: "Male", low: 90, high: 160 },
                ]} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
