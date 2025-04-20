"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-tables/reusable-datatable"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Search, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/reusables/date-picker"

export default function SurveyDashboard() {
  // Date filter states
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)

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
  const [surveyData, setSurveyData] = useState([])

  // Loading states
  const [isLoading, setIsLoading] = useState(false)

  // API calls
  const fetchDistricts = async () => {
    try {
      const response = await fetch(
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getDistrictsByState",
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
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getSubDivisionsByDistrict",
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
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getBlocksBySubDivision",
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
      const response = await fetch("https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getGPsByBlock", {
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

  const fetchSurveyData = async () => {
    try {
      setIsLoading(true)

      // Format dates for API
      const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : ""
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : ""

      const response = await fetch(
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getWelfareProgramCountAnalytics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state_id: stateId,
            district_id: districtId ? Number.parseInt(districtId) : 0,
            subdivision_id: subdivisionId ? Number.parseInt(subdivisionId) : 0,
            block_id: blockId ? Number.parseInt(blockId) : 0,
            village_id: 0, // Not used in the filter UI
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setSurveyData(data.data);
        console.log("survey data", data.data);
      } else {
        setSurveyData([])
      }
    } catch (error) {
      console.error("Error fetching survey data:", error)
      setSurveyData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Call the API to fetch survey data when the page loads
    fetchDistricts()
    fetchSurveyData()
  }, [])

  // Event handlers
  const handleDistrictChange = (value) => {
    setDistrictId(value)
    setSubdivisionId("")
    setBlockId("")
    setGpId("")

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

    if (value) {
      fetchBlocks(value)
    } else {
      setBlocks([])
    }
  }

  const handleBlockChange = (value) => {
    setBlockId(value)
    setGpId("")

    if (value) {
      fetchGps(value)
    } else {
      setGps([])
    }
  }

  const handleGpChange = (value) => {
    setGpId(value)
  }

  const handleSearch = () => {
    fetchSurveyData()
  }

  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setDistrictId("")
    setSubdivisionId("")
    setBlockId("")
    setGpId("")
    setSubdivisions([])
    setBlocks([])
    setGps([])
  }

  // Table columns configuration
  const columns = [
    {
      accessorKey: "survey_id",
      header: "Survey ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "village_name",
      header: "Village",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "dob",
      header: "Date of Birth",
      cell: ({ row }) => {
        const dobValue = row.original.dob;

        if (!dobValue) {
          return "N/A"; // Return "N/A" if dob is null, undefined, or empty
        }

        try {
          const date = new Date(dobValue);
          if (isNaN(date.getTime())) { // Check if date is a valid Date object
            return "Invalid Date"; // Return "Invalid Date" if parsing fails
          }
          return format(date, "dd/MM/yyyy");
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Error"; // Return "Error" in case of any unexpected error during formatting
        }
      },
    },
    {
      accessorKey: "age",
      header: "Age",
    },
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
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select From Date</label>
                    <DatePicker date={startDate} setDate={setStartDate} placeholder="Pick a Date" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select To Date</label>
                    <DatePicker date={endDate} setDate={setEndDate} placeholder="Pick a Date" />
                  </div>

                  {/* District Dropdown */}
                  <div>
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
                  <div>
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
                  <div>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Gramp-Panchayat</label>
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
                </div>

                <div className="flex gap-2 justify-center">
                  {/* Search Button */}
                  <Button
                    className="bg-green-100 hover:bg-green-300 border-[1px] border-green-600 text-slate-800 px-8 cursor-pointer"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" /> Search
                      </>
                    )}
                  </Button>

                  {/* Clear Filters Button */}
                  <Button variant="secondary" className="px-8 border cursor-pointer" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-t-4xl">
                <DataTable data={surveyData} columns={columns} loading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}