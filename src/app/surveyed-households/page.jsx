"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-tables/reusable-datatable"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Search, Eye, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/reusables/date-picker"
import { getUserData } from "@/utils/cookies"
import house from "../../assets/house.jpg"
import signature from "../../assets/signature.jpg"


const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

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

  // Fetch districts on initial load
  useEffect(() => {
    const fixUsersJurisdiction = async () => {
      const userDistrictId = getUserData().DistrictID ?? 0
      const userSubDivisionId = getUserData().SubDivisionID ?? 0
      const userBlockId = getUserData().BlockID ?? 0
      const userGPId = getUserData().GPID ?? 0

      if (userDistrictId) {
        await fetchDistricts()
        setDistrictId(userDistrictId.toString())
      }

      if (userSubDivisionId) {
        await fetchSubdivisions(userDistrictId)
        setSubdivisionId(userSubDivisionId.toString())
      }

      if (userBlockId) {
        await fetchBlocks(userSubDivisionId)
        setBlockId(userBlockId.toString())
      }

      if (userGPId) {
        await fetchGps(userBlockId)
        setGpId(userGPId.toString())
      }

      await fetchSurveyData()
    }

    fixUsersJurisdiction()
  }, [])

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

  const fetchSurveyData = async () => {
    try {
      setIsLoading(true)

      const today = new Date()
      const start = new Date()
      start.setDate(today.getDate() - 30)

      setStartDate(start)
      setEndDate(today)

      // Format dates for API
      const formattedStartDate = startDate ? startDate : start
      const formattedEndDate = endDate ? endDate : today

      const response = await fetch(
        `${BASE_URL}dropdownList/getTotalHouseholdsSurveyedDetails`,
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
        setSurveyData(data.data)
        console.log("survay", data.data)
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
            setSelectedRow(row.original)
            setIsDialogOpen(true)
          }}
        >
          <Eye className="text-cyan-600 mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ]

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
              {/* First Row */}
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

              {/* Detail Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90%] min-w-[90%] max-w-[90%] h-auto p-0">
                  <DialogHeader className="flex items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle className="text-4xl font-semibold">Survey Details</DialogTitle>
                  </DialogHeader>

                  {/* Main Content with Two Columns */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 w-full">
                    {/* Left Side: Survey Details */}
                    <div className="overflow-y-auto px-8 py-6">
                      <div className="grid grid-cols-2 gap-2 text-lg">
                        <div className="font-semibold">Household ID:</div>
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

                        {selectedRow?.family_head_name && (
                          <>
                            <div className="font-semibold">Family Head Name:</div>
                            <div>{selectedRow?.family_head_name}</div>
                          </>
                        )}

                        {selectedRow?.family_head_contact_number && (
                          <>
                            <div className="font-semibold">Contact Number:</div>
                            <div>{selectedRow?.family_head_contact_number}</div>
                          </>
                        )}

                        {selectedRow?.latitude && selectedRow?.longitude && (
                          <>
                            <div className="font-semibold">Latitude:</div>
                            <div>{selectedRow?.latitude}</div>

                            <div className="font-semibold">Longitude:</div>
                            <div>{selectedRow?.longitude}</div>
                          </>
                        )}
                      </div>

                      {/* Images Section */}
                      <div className="mt-6">
                        <h3 className="text-xl font-extrabold mb-4">Images :</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Family Head Image */}
                          <div className="flex flex-col items-center">
                            <div className="font-medium mb-2">Family Head</div>
                            <div className="border rounded-lg overflow-hidden w-full h-48 flex items-center justify-center bg-gray-100">
                              {selectedRow?.family_head_img ? (
                                <img
                                  src={selectedRow.family_head_img || "/family_head.png"}
                                  alt="Family Head"
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <img
                                  src="/family_head"
                                  alt="No Family Head Image"
                                  className="object-cover w-32 h-32 opacity-50"
                                />
                              )}
                            </div>
                          </div>

                          {/* Household Image */}
                          <div className="flex flex-col items-center">
                            <div className="font-medium mb-2">Household</div>
                            <div className="border rounded-lg overflow-hidden w-full h-48 flex items-center justify-center bg-gray-100">
                              <img
                                src={selectedRow?.household_img || house}
                                alt="Household"
                                className={selectedRow?.household_img ? "object-cover w-full h-full" : "object-cover w-32 h-32 opacity-50"}
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.src = house; // Fallback to default image
                                }}
                              />
                            </div>
                          </div>

                          {/* Signature Image */}
                          <div className="flex flex-col items-center">
                            <div className="font-medium mb-2">Signature</div>
                            <div className="border rounded-lg overflow-hidden w-full h-48 flex items-center justify-center bg-gray-100">
                              <img
                                src={selectedRow?.family_head_signature_img || signature}
                                alt="Signature"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.src = house; // Fallback to default image
                                }}
                              />
                            </div>
                          </div>
                        </div>
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
