"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { BpReportChart } from "@/components/charts/bp-report-chart"
import { SamMamChart } from "@/components/charts/sam-mam-chart"
import { SugarReportChart } from "@/components/charts/sugar-report-chart"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getDashboardCount } from "./api"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserData } from "@/utils/cookies"

export default function Page() {
  const [dashboardCount, setDashboardCount] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  // Date filter states
  const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

  // Location filter states
  const [stateId, setStateId] = useState(1) // Default to West Bengal (ID: 1)
  const [districtId, setDistrictId] = useState("")
  const [subdivisionId, setSubdivisionId] = useState("")
  const [blockId, setBlockId] = useState("")
  const [gpId, setGpId] = useState("")
  
  // Data states
  const [districts, setDistricts] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [blocks, setBlocks] = useState([])
  const [gps, setGps] = useState([])
  const [tgId, setTgId] = useState("")
  const [tgs, setTgs] = useState([])


  // Event handlers
  const handleDistrictChange = (value) => {
    setDistrictId(value)
    setSubdivisionId("")
    setBlockId("")
    setGpId("")
    setTgId("")

    if (value) {
      fetchSubdivisions(value)
    } else {
      setSubdivisions([])
    }
  }

  const handleSubdivisionChange = (value) => {
    setSubdivisionId(value)
    setBlockId("")
    setGpId("")
    setTgId("")

    if (value) {
      fetchBlocks(value)
    } else {
      setBlocks([])
    }
  }

  const handleBlockChange = (value) => {
    setBlockId(value)
    setGpId("")
    setTgId("")

    if (value) {
      fetchGps(value)
    } else {
      setGps([])
    }
  }

  const handleGpChange = (value) => {
    setGpId(value)
    setTgId("")

    if (value) {
      fetchTgs(value)
    } else {
      setTgs([])
    }
  }

  const clearFilters = () => {
    setDistrictId("")
    setSubdivisionId("")
    setBlockId("")
    setGpId("")
    setTgId("")
    setSubdivisions([])
    setBlocks([])
    setGps([])
    setTgs([])
  }

  const fetchDashboardCount = async () => {
    setIsLoading(true)
    try {
      const district_id = districtId ? Number.parseInt(districtId) : 0;
      const subdivision_id = subdivisionId ? Number.parseInt(subdivisionId) : 0;
      const block_id = blockId ? Number.parseInt(blockId) : 0;
      const gp_id = gpId ? Number.parseInt(gpId) : 0;
      const teagarden_id = 0; // Not used in the filter UI
      const response = await getDashboardCount(district_id, subdivision_id, block_id, gp_id, teagarden_id);

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

  const handleSearch = () => {
    fetchDashboardCount()
  }

  // Fetch districts on initial load
  useEffect(() => {
    const fixUsersJurisdiction = async () => {
      const userDistrictId = getUserData().DistrictID ?? 0
      const userSubDivisionId = getUserData().SubDivisionID ?? 0
      const userBlockId = getUserData().BlockID ?? 0
      const userGPId = getUserData().GPID ?? 0

      setDistrictId(userDistrictId);
      setSubdivisionId(userSubDivisionId);
      setBlockId(userBlockId);
      setGpId(userGPId);


      await fetchDistricts()
      setDistrictId(userDistrictId.toString())

      await fetchSubdivisions(userDistrictId)
      setSubdivisionId(userSubDivisionId.toString())

      await fetchBlocks(userSubDivisionId)
      setBlockId(userBlockId.toString())

      await fetchGps(userBlockId)
      setGpId(userGPId.toString())

      await fetchDashboardCount();

    }

    fixUsersJurisdiction()
  }, [])

  // API calls
  const fetchDistricts = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}dropdownList/getDistrictsByState`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state_id: stateId,
          }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setDistricts(data.data)
      }
    } catch (error) {
      console.error("Error fetching districts:", error)
    }
  }

  const fetchSubdivisions = async (distId) => {
    try {
      const response = await fetch(
        `${BASE_URL}dropdownList/getSubDivisionsByDistrict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dist_id: Number.parseInt(distId),
          }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setSubdivisions(data.data)
      }
    } catch (error) {
      console.error("Error fetching subdivisions:", error)
    }
  }

  const fetchBlocks = async (subDivId) => {
    try {
      const response = await fetch(
        `${BASE_URL}dropdownList/getBlocksBySubDivision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sub_div_id: Number.parseInt(subDivId),
          }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setBlocks(data.data)
      }
    } catch (error) {
      console.error("Error fetching blocks:", error)
    }
  }

  const fetchGps = async (blkId) => {
    try {
      const response = await fetch(`${BASE_URL}dropdownList/getGPsByBlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blk_id: Number.parseInt(blkId),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setGps(data.data)
      }
    } catch (error) {
      console.error("Error fetching GPs:", error)
    }
  }

  const fetchTgs = async (gpId) => {
    try {
      const response = await fetch(`${BASE_URL}dropdownList/getTeagardensByGP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gp_id: Number.parseInt(gpId),
        }),
      })

      const data = await response.json()
      console.log("tgs", data);

      if (data.success) {
        setTgs(data.data)
      }
    } catch (error) {
      console.error("Error fetching GPs:", error)
    }
  }

  const handleTgChange = (value) => {
    setTgId(value)
  }

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

              <div className="border rounded-lg p-4 mx-6">
                <div className="flex flex-wrap gap-6 mb-6">

                  {/* District Dropdown */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm font-medium text-gray-700">Select District</label>
                    <Select value={districtId} onValueChange={handleDistrictChange}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Districts</SelectItem>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id.toString()}>
                            {district.district_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subdivision Dropdown */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm font-medium text-gray-700">Select Sub-Division</label>
                    <Select value={subdivisionId} onValueChange={handleSubdivisionChange} disabled={!districtId}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Sub-Division" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Subdivisions</SelectItem>
                        {subdivisions.map((subdivision) => (
                          <SelectItem key={subdivision.id} value={subdivision.id.toString()}>
                            {subdivision.sub_division_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Block Dropdown */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm font-medium text-gray-700">Select Block</label>
                    <Select value={blockId} onValueChange={handleBlockChange} disabled={!subdivisionId}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Block" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Blocks</SelectItem>
                        {blocks.map((block) => (
                          <SelectItem key={block.id} value={block.id.toString()}>
                            {block.block_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* GP Dropdown */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm font-medium text-gray-700">Select Gram-Panchayat</label>
                    <Select value={gpId} onValueChange={handleGpChange} disabled={!blockId}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select GP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All GPs</SelectItem>
                        {gps.map((gp) => (
                          <SelectItem key={gp.id} value={gp.id.toString()}>
                            {gp.gp_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TG Dropdown */}
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm font-medium text-gray-700">Select Tea-Garden</label>
                    <Select value={tgId} onValueChange={handleTgChange} disabled={!gpId}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select TG" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Teagardens</SelectItem>
                        {tgs.map((tg) => (
                          <SelectItem key={tg.id} value={tg.id.toString()}>
                            {tg.teagarden_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      className="bg-green-100 hover:bg-green-300 border-[1px] border-green-600 text-slate-800 cursor-pointer"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                </div>
              </div>

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
