"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-tables/reusable-datatable"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Search, Eye, Loader2 } from 'lucide-react'
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/reusables/date-picker"

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
})
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
})
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
})
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})

export default function SurveyDashboard() {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

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
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null)

  // Lazy load Leaflet and set the custom marker icon
  useEffect(() => {
    async function loadLeaflet() {
      const L = (await import("leaflet")).default
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
        shadowSize: [41, 41],
      })
      setCustomMarkerIcon(icon)
    }
    loadLeaflet()
  }, [])

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
      setIsLoading(true);

      // Get the current date
      const currentDate = format(new Date(), "yyyy-MM-dd");

      // Format dates for API
      const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : currentDate;
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : currentDate;

      const response = await fetch(
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getTotalHouseholdsSurveyedDetails",
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
        }
      );

      const data = await response.json();
      if (data.success) {
        setSurveyData(data.data);
        console.log("survay", data.data);
      } else {
        setSurveyData([]);
      }
    } catch (error) {
      console.error("Error fetching survey data:", error);
      setSurveyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Call the API to fetch survey data when the page loads
    fetchSurveyData();
  }, []);

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
      cell: ({ row }) => row.original.gp || "N/A",
    },
    {
      accessorKey: "village",
      header: "Village",
      cell: ({ row }) => row.original.village || "N/A",
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
            setSelectedRow(row.original);
            setIsDialogOpen(true);
          }}
        >
          <Eye className="text-cyan-600 mr-2 h-4 w-4" />
          View
        </Button>
      ),
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
              <div className="border rounded-lg p-4 flex flex-col gap-4">
                {/* First Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
                  {/* Start Date Selector */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="h-6 w-6 text-gray-500" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-[150px]">
                          {startDate ? format(startDate, "dd/MM/yyyy") : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date Selector */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Calendar className="h-6 w-6 text-gray-500" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="min-w-[150px]">
                          {endDate ? format(endDate, "dd/MM/yyyy") : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* District Dropdown */}
                  <Select value={districtId} onValueChange={handleDistrictChange}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id.toString()}>
                          {district.district_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Subdivision Dropdown */}
                  <Select value={subdivisionId} onValueChange={handleSubdivisionChange} disabled={!districtId}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select Sub-Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subdivisions</SelectItem>
                      {subdivisions.map((subdivision) => (
                        <SelectItem key={subdivision.id} value={subdivision.id.toString()}>
                          {subdivision.sub_division_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Second Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
                  {/* Block Dropdown */}
                  <Select value={blockId} onValueChange={handleBlockChange} disabled={!subdivisionId}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Blocks</SelectItem>
                      {blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()}>
                          {block.block_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* GP Dropdown */}
                  <Select value={gpId} onValueChange={handleGpChange} disabled={!blockId}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select GP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All GPs</SelectItem>
                      {gps.map((gp) => (
                        <SelectItem key={gp.id} value={gp.id.toString()}>
                          {gp.gp_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Search Button */}
                  <Button
                    className="bg-green-100 hover:bg-green-300 border-[1px] border-green-600 text-slate-800 mx-auto px-8 w-full sm:w-auto"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>

                  {/* Clear Filters Button */}
                  <Button variant="outline" className="mx-auto px-8 w-full sm:w-auto" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-t-4xl">
                <DataTable data={surveyData} columns={columns} loading={isLoading} />
              </div>

              {/* Detail Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[80%] min-w-[80%] h-auto p-0">
                  <DialogHeader className="flex items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle className="text-4xl font-semibold">Survey Details</DialogTitle>
                  </DialogHeader>

                  {/* Main Content with Two Columns */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 w-full">
                    {/* Left Side: Survey Details */}
                    <div className="overflow-y-auto px-8 py-6">
                      <div className="grid grid-cols-2 gap-2 text-lg">
                        <div className="font-semibold">Survey ID:</div>
                        <div>{selectedRow?.survey_id}</div>

                        <div className="font-semibold">District:</div>
                        <div>{selectedRow?.district}</div>

                        <div className="font-semibold">Sub Division:</div>
                        <div>{selectedRow?.sub_division}</div>

                        <div className="font-semibold">Block:</div>
                        <div>{selectedRow?.block}</div>

                        <div className="font-semibold">Gram Panchayat:</div>
                        <div>{selectedRow?.gp || "N/A"}</div>

                        <div className="font-semibold">Village:</div>
                        <div>{selectedRow?.village || "N/A"}</div>

                        <div className="font-semibold">House Number:</div>
                        <div>{selectedRow?.house_number}</div>

                        <div className="font-semibold">Family Income:</div>
                        <div>₹{Number(selectedRow?.family_income).toLocaleString()}</div>

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

                    {/* Right Side: Map */}
                    {selectedRow?.latitude && selectedRow?.longitude && customMarkerIcon && (
                      <div className="flex items-center justify-center p-6">
                        <MapContainer
                          center={[Number(selectedRow?.latitude), Number(selectedRow?.longitude)]}
                          zoom={13}
                          style={{ height: "90%", width: "100%", borderRadius: "8px" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker
                            position={[Number(selectedRow?.latitude), Number(selectedRow?.longitude)]}
                            icon={customMarkerIcon}
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
