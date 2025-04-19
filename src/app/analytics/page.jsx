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
import { DatePicker } from "@/components/reusables/date-picker";
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Search, Eye, Loader2 } from 'lucide-react'
import { getUserData } from "@/utils/cookies"
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
  const [isLoading, setIsLoading] = useState(false)
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null)
  // Fetch districts on initial load
  useEffect(() => {

    const fixUsersJurisdiction = async () => {
      const userDistrictId = getUserData().DistrictID ?? 0;
      const userSubDivisionId = getUserData().SubDivisionID ?? 0;
      const userBlockId = getUserData().BlockID ?? 0;
      const userGPId = getUserData().GPID ?? 0

      if (userDistrictId) {
        await fetchDistricts();
        setDistrictId(userDistrictId.toString());
      }

      if (userSubDivisionId) {
        await fetchSubdivisions(userDistrictId);
        setSubdivisionId(userSubDivisionId.toString())
      }

      if (userBlockId) {
        await fetchBlocks(userSubDivisionId);
        setBlockId(userBlockId.toString())
      }

      if (userGPId) {
        await fetchGps(userBlockId);
        setGpId(userGPId.toString())
      }

    }

    fixUsersJurisdiction();
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

  useEffect(() => {
    // Call the API to fetch survey data when the page loads
    fetchDistricts();
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
    // fetchSurveyData()
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

          {/* Search Filters Section (First Row) */}
          <div className="p-6">
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-4 gap-6 mb-6">
                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select From Date</label>
                  <DatePicker date={startDate} setDate={setStartDate} placeholder="Pick a Date" />
                </div>

                {/* To Date */}
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

              {/* Search & Clear Buttons */}
              <div className="flex gap-2 justify-center">
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
                <Button variant="secondary" className="px-8 border cursor-pointer" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Charts Section (Second Row Onwards) */}
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