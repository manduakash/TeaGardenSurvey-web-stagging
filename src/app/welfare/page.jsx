"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-tables/reusable-datatable"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Search, Eye, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/reusables/date-picker"
import { getUserData } from "@/utils/cookies"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"

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

export default function WelfareDashboard() {
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
  const [villageId, setVillageId] = useState(1) // Default value

  // Data states
  const [districts, setDistricts] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [blocks, setBlocks] = useState([])
  const [gps, setGps] = useState([])
  const [welfareData, setWelfareData] = useState([])

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null)

  const [tgId, setTgId] = useState("")
  const [tgs, setTgs] = useState([])

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

  const handleGpChange = (value) => {
    setGpId(value)
    setTgId("")

    if (value) {
      fetchTgs(value)
    } else {
      setTgs([])
    }
  }

  useEffect(() => {
    const fixUsersJurisdiction = async () => {
      const userDistrictId = getUserData().DistrictID ?? 0
      const userSubDivisionId = getUserData().SubDivisionID ?? 0
      const userBlockId = getUserData().BlockID ?? 0
      const userGPId = getUserData().GPID ?? 0

      await fetchDistricts()
      setDistrictId(userDistrictId.toString())

      await fetchSubdivisions(userDistrictId)
      setSubdivisionId(userSubDivisionId.toString())

      await fetchBlocks(userSubDivisionId)
      setBlockId(userBlockId.toString())

      await fetchGps(userBlockId)
      setGpId(userGPId.toString())

      await fetchWelfareData()
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

  const fetchWelfareData = async () => {
    try {
      setIsLoading(true)

      // Format dates for API
      const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : ""
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : ""

      const response = await fetch(
        `${BASE_URL}dropdownList/getTotalWelfareDetails`,
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
            gp_id: gpId ? Number.parseInt(gpId) : 0,
            village_id: tgId ? Number.parseInt(tgId) : 0,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          }),
        },
      )

      const data = await response.json()
      if (data.success) {
        setWelfareData(data.data)
        console.log("welfare data", data.data)
      } else {
        setWelfareData([])
      }
    } catch (error) {
      console.error("Error fetching welfare data:", error)
      setWelfareData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Call the API to fetch districts when the page loads
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

  const handleSearch = () => {
    fetchWelfareData()
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

  // Table columns configuration for welfare data
  const columns = [
    {
      accessorKey: "survey_id",
      header: "Household ID",
    },
    {
      accessorKey: "state",
      header: "State",
    },
    {
      accessorKey: "district",
      header: "District",
    },
    {
      accessorKey: "sub_division",
      header: "Sub Division",
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
      header: "Teagarden",
      cell: ({ row }) => row.original.village || "N/A",
    },
    {
      accessorKey: "family_head_contact_number",
      header: "Contact",
      cell: ({ row }) => row.original.family_head_contact_number || "N/A",
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

                  {/* TG Dropdown */}
                  <div className="">
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
                <DataTable data={welfareData} columns={columns} loading={isLoading} />
              </div>

              {/* Detail Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[50%] min-w-[50%] h-auto p-0">
                  <DialogHeader className="flex items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle className="text-4xl font-semibold">Welfare Survey Details</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 xl:grid-cols-2 w-[100%] min-w-[100%]">
                    {/* Left Side: Survey Details */}
                    <div className="overflow-y-auto px-8 py-6 min-w-[50vw] w-[50vw]">
                      <div className="grid grid-cols-2 gap-2 text-lg">
                        <div className="font-semibold">Family Head's Name :</div>
                        <div>{selectedRow?.family_head_name || "N/A"}</div>

                        <div className="font-semibold">Family Head's Contact No. :</div>
                        <div>{selectedRow?.family_head_contact_number || "N/A"}</div>

                        <div className="font-semibold">Is TeaGarden ID Card Available ?</div>
                        <div>{selectedRow?.labour_id ? "Yes" : "No"}</div>
                        {selectedRow?.labour_id ? (
                          <><div className="font-semibold">TeaGarden ID Card No. :</div>
                            <div>{selectedRow?.labour_card_no || "N/A"}</div>
                          </>) : null}
                        <div className="font-semibold">Enrolled Under Lakhmir Bhandar Scheme?</div>
                        <div>{selectedRow?.lakshmir_bhandar ? "Yes" : "No"}</div>

                        {selectedRow?.lakshmir_bhandar ? (<><div className="font-semibold">Lakshmir Bhandar No:</div>
                          <div>{selectedRow?.lakshmir_bhandar_card_no || "N/A"}</div>
                        </>) : null}
                        <div className="font-semibold">Enrolled Under Swasthya Sathi Scheme?</div>
                        <div>{selectedRow?.swasthya_sathi ? "Yes" : "No"}</div>

                        {selectedRow?.swasthya_sathi ? (<><div className="font-semibold">Swasthya Sathi Card No :</div>
                          <div>{selectedRow?.swasthya_sathi_card_no || "N/A"}</div>
                        </>) : null}
                        <div className="font-semibold">Receiving Old Age Pension?</div>
                        <div>{selectedRow?.old_age_pension ? "Yes" : "No"}</div>

                        {selectedRow?.old_age_pension ? (<><div className="font-semibold">Old Age Pension No. :</div>
                          <div>{selectedRow?.old_age_pension_id_no || "N/A"}</div>
                        </>) : null}
                        <div className="font-semibold">Survey Date:</div>
                        <div>
                          {selectedRow?.created_at
                            ? format(new Date(selectedRow.created_at), "dd/MM/yyyy hh:mm a")
                            : "N/A"}
                        </div>
                      </div>
                    </div>
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
