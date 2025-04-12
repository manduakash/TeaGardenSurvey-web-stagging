import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { WelfareDataTable } from "@/components/data-tables/welfare-data-table"

export default function Page() {
  const data = [
  { id: 1, household_id: "WB-HH-001", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 2, household_id: "WB-HH-002", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 3, household_id: "WB-HH-003", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 4, household_id: "WB-HH-004", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 0 },
  { id: 5, household_id: "WB-HH-005", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 6, household_id: "WB-HH-006", caste_certificate: 0, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 7, household_id: "WB-HH-007", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 8, household_id: "WB-HH-008", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 9, household_id: "WB-HH-009", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 10, household_id: "WB-HH-010", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 11, household_id: "WB-HH-011", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 12, household_id: "WB-HH-012", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 13, household_id: "WB-HH-013", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 14, household_id: "WB-HH-014", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 0 },
  { id: 15, household_id: "WB-HH-015", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 16, household_id: "WB-HH-016", caste_certificate: 0, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 17, household_id: "WB-HH-017", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 18, household_id: "WB-HH-018", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 19, household_id: "WB-HH-019", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 20, household_id: "WB-HH-020", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 21, household_id: "WB-HH-021", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 22, household_id: "WB-HH-022", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 23, household_id: "WB-HH-023", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 24, household_id: "WB-HH-024", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 0 },
  { id: 25, household_id: "WB-HH-025", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 26, household_id: "WB-HH-026", caste_certificate: 0, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 27, household_id: "WB-HH-027", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 28, household_id: "WB-HH-028", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 29, household_id: "WB-HH-029", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 30, household_id: "WB-HH-030", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 31, household_id: "WB-HH-031", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 32, household_id: "WB-HH-032", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 33, household_id: "WB-HH-033", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 34, household_id: "WB-HH-034", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 0, old_age_pension: 0 },
  { id: 35, household_id: "WB-HH-035", caste_certificate: 1, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
  { id: 36, household_id: "WB-HH-036", caste_certificate: 0, lakshmir_bhandar: 0, swasthya_sathi: 1, old_age_pension: 0 },
  { id: 37, household_id: "WB-HH-037", caste_certificate: 1, lakshmir_bhandar: 0, swasthya_sathi: 0, old_age_pension: 1 },
  { id: 38, household_id: "WB-HH-038", caste_certificate: 0, lakshmir_bhandar: 1, swasthya_sathi: 1, old_age_pension: 1 },
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <WelfareDataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
