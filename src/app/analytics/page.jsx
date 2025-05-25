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
  const serviceurl = process.env.NEXT_PUBLIC_SERVICE_URL

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
  const [isLoading, setIsLoading] = useState(true)
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null)
  const [healthCount, setHealthCount] = useState(0)
  const [enrollmentCount, setEnrollmentCount] = useState(0)
  const [welfareProgramsCount, setWelfareProgramsCount] = useState(0)
  const [lowBirthWeightCount, setLowBirthWeightCount] = useState(0)
  const [HouseHoldCount, setHouseHoldCount] = useState([])

    const BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;
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

  // Fetch districts on initial load
  useEffect(() => {


    const fixUsersJurisdiction = async () => {
      const userDistrictId = getUserData().DistrictID ?? 0;
      const userSubDivisionId = getUserData().SubDivisionID ?? 0;
      const userBlockId = getUserData().BlockID ?? 0;
      const userGPId = getUserData().GPID ?? 0

      await fetchDistricts();
      setDistrictId(userDistrictId.toString());

      await fetchSubdivisions(userDistrictId);
      setSubdivisionId(userSubDivisionId.toString())

      await fetchBlocks(userSubDivisionId);
      setBlockId(userBlockId.toString())

      await fetchGps(userBlockId);
      setGpId(userGPId.toString())

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
        `${serviceurl}dropdownList/getDistrictsByState`,
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
        `${serviceurl}dropdownList/getSubDivisionsByDistrict`,
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
        `${serviceurl}dropdownList/getBlocksBySubDivision`,
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
      const response = await fetch(`${serviceurl}dropdownList/getGPsByBlock`, {
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
    fetchAnalyticsData()
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 30);

      const formattedStartDate = startDate || start;
      const formattedEndDate = endDate || today;

      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      const user_details = getUserData()
      console.log("hi", user_details);

      const payload = {
        state_id: stateId ?? user_details.StateID,
        district_id: districtId ?? user_details.DistrictID,
        subdivision_id: subdivisionId ?? user_details.SubDivisionID,
        block_id: blockId ?? user_details.BlockID,
        // gp_id: gpId ?? user_details.GPID,
        village_id: tgId ?? 0,
        from_date: formattedStartDate,
        to_date: formattedEndDate,
      };

      const [houseHoldRes, healthRes, enrollmentRes, welfareProgramsRes, lowBithWeigthRes] = await Promise.all([
        fetch(`${serviceurl}dropdownList/getHouseholdSurveyCountAnalytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${serviceurl}dropdownList/getHealthDetailsCountAnalytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${serviceurl}dropdownList/getSchemeEnrollmentCountAnalytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${serviceurl}dropdownList/getWelfareProgramCountAnalytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch(`${serviceurl}dropdownList/getLowBirthWeigthCountAnalytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ]);

      const [houseHoldData, healthData, enrollmentData, welfareProgramsData, lowBirthWeightData] = await Promise.all([
        houseHoldRes.json(),
        healthRes.json(),
        enrollmentRes.json(),
        welfareProgramsRes.json(),
        lowBithWeigthRes.json()
      ]);

      if (houseHoldData.success && healthData.success && enrollmentData.success && welfareProgramsData.success && lowBirthWeightData.success) {
        setHouseHoldCount(houseHoldData?.data)
        setHealthCount(healthData.data[0]);
        setEnrollmentCount(enrollmentData.data[0]);
        setWelfareProgramsCount(welfareProgramsData.data[0]);
        setLowBirthWeightCount(lowBirthWeightData.data[0]);
        console.log("survey", healthData.data[0]);
        console.log("enrollment", enrollmentData.data[0]);
        console.log("low", lowBirthWeightData.data[0]);
        console.log("data", houseHoldData?.data);


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
    labels: HouseHoldCount.map(item => item.jurisdiction_name),
    datasets: [
      {
        label: "Number of Surveys",
        data: HouseHoldCount.map(item => item.survey_count),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const healthMetricsData = {
    labels: [
      "High BP Cases",
      "Low BP Cases",
      "High Sugar Cases",
      "Low Sugar Cases",
      "SAM Cases",
      "MAM Cases"
    ],
    datasets: [
      {
        label: "Health Metrics",
        data: [
          healthCount?.total_high_bp_cases,
          healthCount?.total_low_bp_cases,
          healthCount?.total_high_sugar_cases,
          healthCount?.total_low_sugar_cases,
          healthCount?.total_sam_cases,
          healthCount?.total_mam_cases
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",   // Red
          "rgba(54, 162, 235, 0.5)",   // Blue
          "rgba(255, 206, 86, 0.5)",   // Yellow
          "rgba(75, 192, 192, 0.5)",   // Teal
          "rgba(153, 102, 255, 0.5)",  // Purple
          "rgba(255, 159, 64, 0.5)"    // Orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
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
        data: [enrollmentCount?.total_swasthya_sathi_enrollment, enrollmentCount?.total_sc_st_cases, enrollmentCount?.total_shg_memberships],
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
        data: [lowBirthWeightCount?.total_normal_birthweigth, lowBirthWeightCount?.total_low_birthweigth],
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
    labels: ["Sc St Caste", "Swasthya Sathi Welfare", "Old Pension Scheme Welfare", "Laksmhir Bhandar"],
    datasets: [
      {
        label: "Welfare Programs",
        data: [welfareProgramsCount?.total_sc_st_caste_count, welfareProgramsCount?.total_swasthya_sathi_welfare, welfareProgramsCount?.total_old_pension_scheme_welfare, welfareProgramsCount?.total_laksmhir_bhandar_count],
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

  const BarChartSkeleton = () => {
    return (
      <div className="w-full h-64 p-4 flex flex-col justify-between">
        <div className="animate-pulse h-full flex items-end gap-48">
          {/* Simulated bars */}
          <div className="bg-gray-200 rounded-md w-72 h-2/4"></div>
          <div className="bg-gray-200 rounded-md w-72 h-3/4"></div>
          <div className="bg-gray-200 rounded-md w-72 h-1/2"></div>
          <div className="bg-gray-200 rounded-md w-72 h-2/3"></div>
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-400">
          {/* <span>Household 1</span>
          <span>Household 2</span>
          <span>Household 3</span>
          <span>Household 4</span> */}
        </div>
      </div>
    );
  };

  const HealthMetricsSkeleton = () => {
    return (
      <div className="w-full h-72 flex flex-col items-center justify-between animate-pulse">
        {/* Legend blocks */}
        <div className="grid grid-cols-2 gap-2 mb-4 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-sm" />
              <div className="h-3 w-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        {/* Circular Pie placeholder */}
        <div className="w-60 h-60 bg-gray-200 rounded-full" />
      </div>
    );
  };
  const SchemeEnrollmentSkeleton = () => (
    <div className="h-64 w-full flex flex-col justify-between animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
      <div className="h-full w-full bg-gray-100 rounded-lg relative overflow-hidden">
        {/* Simulated line */}
        <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-gray-300" />
        {/* Points */}
        <div className="absolute bottom-16 left-[15%] w-3 h-3 bg-gray-300 rounded-full" />
        <div className="absolute bottom-24 left-[45%] w-3 h-3 bg-gray-300 rounded-full" />
        <div className="absolute bottom-8 left-[75%] w-3 h-3 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
  const ShgCreditLinkageSkeleton = () => (
    <div className="h-64 w-full flex flex-col items-center justify-center animate-pulse">
      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          <div className="h-3 w-20 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          <div className="h-3 w-24 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Donut */}
      <div className="w-40 h-40 border-[14px] border-gray-300 rounded-full border-t-gray-200" />
      <div className="absolute w-20 h-20 bg-white rounded-full" />
    </div>
  );
  const LowBirthweightCasesSkeleton = () => (
    <div className="h-64 w-full flex flex-col items-center justify-center animate-pulse">
      {/* Legend */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          <div className="h-3 w-24 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm" />
          <div className="h-3 w-20 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Circular radar-style rings */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-3 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-6 rounded-full border-4 border-gray-200" />
      </div>
    </div>
  );

  const WelfareProgramsSkeleton = () => (
    <div className="h-96 w-full flex flex-col animate-pulse">
      {/* Title Placeholder */}
      <div className="h-5 w-48 bg-gray-200 rounded mb-4" />

      {/* Chart Area */}
      <div className="flex items-end justify-around h-full bg-gray-100 rounded-lg p-4">
        {/* Simulated bars */}
        <div className="w-72 h-40 bg-gray-300 rounded" />
        <div className="w-72 h-28 bg-gray-300 rounded" />
        <div className="w-72 h-20 bg-gray-300 rounded" />
        <div className="w-72 h-32 bg-gray-300 rounded" />
      </div>
    </div>
  );


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

              {/* Search & Clear Buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  className="bg-green-100 hover:bg-green-300 border-[1px] border-green-600 text-slate-800 px-8 cursor-pointer"
                  onClick={fetchAnalyticsData}
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
            {/*    Chart: Household Survey */}
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Household Survey Data</h2>
              {isLoading ? <BarChartSkeleton height="h-84" /> : <Bar data={householdSurveyData} />}
            </div>

            {/* Pie Chart: Health Metrics */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Health Metrics</h2>
              {/* <Pie data={healthMetricsData} /> */}
              {isLoading ? <HealthMetricsSkeleton height="h-84" /> : <Pie data={healthMetricsData} />}
            </div>

            {/* Line Chart: Scheme Enrollment */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Scheme Enrollment</h2>
              <div className="my-auto py-auto flex flex-col justify-between">
                <h2 className="text-xl font-bold mb-4 text-transparent py-4">s</h2>
                {/* <Line data={schemeEnrollmentData} /> */}
                {isLoading ? <SchemeEnrollmentSkeleton /> : <Line data={schemeEnrollmentData} />}
              </div>
            </div>

            {/* Doughnut Chart: SHG & Credit Linkage */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">SHG & Credit Linkage</h2>
              {isLoading ? <ShgCreditLinkageSkeleton /> : <Doughnut data={shgCreditLinkageData} />}
            </div>

            {/* Polar Area Chart: Low Birthweight Cases */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Low Birthweight Cases</h2>
              {/* <PolarArea data={lowBirthWeightData} /> */}
              {isLoading ? <LowBirthweightCasesSkeleton /> : <PolarArea data={lowBirthWeightData} />}
            </div>

            {/* Bar Chart: Welfare Programs */}
            <div className="col-span-3 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Welfare Programs</h2>
              {/* <Bar data={welfareProgramsData} /> */}
              {isLoading ? <WelfareProgramsSkeleton /> : <Bar data={welfareProgramsData} />}

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}