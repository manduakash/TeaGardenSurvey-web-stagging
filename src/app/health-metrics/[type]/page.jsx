"use client";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/data-tables/reusable-datatable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DatePicker } from "@/components/reusables/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import moment from "moment";
import { RiArrowUpDoubleLine } from "react-icons/ri";
import { RiArrowDownDoubleLine } from "react-icons/ri";
import { AiFillCheckCircle } from "react-icons/ai";
import { useParams } from 'next/navigation';
import { getUserData } from "@/utils/cookies";

export default function Page() {
  const params = useParams();
  const type_of_search = params.type;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const [isLoading, setIsLoading] = useState(true)

  const [nutritionStatus, setNutritionStatus] = useState("ALL")
  const [bpStatus, setBpStatus] = useState("ALL")
  const [bloodSugar, setBloodSugar] = useState("ALL")
  const [gender, setGender] = useState("ALL")
  const [ageGroup, setAgeGroup] = useState("ALL")


  useEffect(() => {

  }, [type_of_search])

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
        const dist_id = getUserData().DistrictID ?? 0;
        setDistrictId(dist_id.toString())
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

      if (type_of_search) {
        if (type_of_search == "sam") {
          setNutritionStatus("SAM")
          fetchHealthSurveyData("sam");
        } else if (type_of_search == "mam") {
          setNutritionStatus("MAM")
          fetchHealthSurveyData("mam");
        } else {
          fetchHealthSurveyData();
        }

      }
    }
    fixUsersJurisdiction();
  }, [type_of_search])

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

  const fetchHealthSurveyData = async (type) => {
    try {
      setIsLoading(true);

      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 30);

      setStartDate(start);
      setEndDate(today);

      // Format dates for API
      const formattedStartDate = startDate ? startDate : start;
      const formattedEndDate = endDate ? endDate : today;

      const response = await fetch(
        "https://tea-garden-survey-api-stagging.vercel.app/api/dropdownList/getHealthDetailsWithFilters",
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
            village_id: 0,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            nutrition_status: type == "sam" ? "SAM" : type == "mam" ? "MAM" : nutritionStatus,
            bp_status: bpStatus,
            blood_sugar: bloodSugar,
            gender: gender,
            household_id: 0,
            age_group: ageGroup
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSurveyData(data.data);
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

  const handleGpChange = (value) => {
    setGpId(value)
  }

  const handleSearch = () => {
    fetchHealthSurveyData()
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

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "house_number", header: "House No." },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "bmi", header: "BMI" },
    {
      accessorKey: "blood_pressure", // expects a string like "120/80"
      header: "Blood Pressure",
      cell: ({ row }) => {
        const bp = row?.original?.blood_pressure;
        const [systolicStr, diastolicStr] = bp?.split("/") || [];
        const systolic = parseInt(systolicStr);
        const diastolic = parseInt(diastolicStr);

        let status = "Normal";
        if (systolic >= 140 || diastolic >= 90) {
          status = "High"; // high
        } else if (systolic < 90 || diastolic < 60) {
          status = "Low"; // low
        }

        return (
          <Badge
            variant="outline"
            className="text-slate-400"
          >
            {status == "High" ? <RiArrowUpDoubleLine className="text-red-500" /> : status == "Low" ? <RiArrowDownDoubleLine className="text-yellow-500" /> : <AiFillCheckCircle className="text-green-500" />} {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "blood_sugar", // expects a number like 110
      header: "Sugar Level",
      cell: ({ row }) => {
        const sugar = parseInt(row?.original?.blood_sugar);
        let status = "Normal";
        if (sugar > 140) {
          status = "High"; // high
        } else if (sugar < 70) {
          status = "Low"; // low
        }

        return (
          <Badge
            variant="outline"
            className="text-slate-400"
          >
            {status == "High" ? <RiArrowUpDoubleLine className="text-red-500" /> : status == "Low" ? <RiArrowDownDoubleLine className="text-yellow-500" /> : <AiFillCheckCircle className="text-green-500" />} {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "nutrition_status",
      header: "Nutrition Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row?.original?.nutrition_status === "SAM"
              ? "text-red-500"
              : row?.original?.nutrition_status === "MAM"
                ? "text-yellow-500"
                : "text-green-500"
          }
        >
          {row?.original?.nutrition_status}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRow(row?.original);
            setIsDialogOpen(true);
          }}
        >
          <Eye className="text-cyan-600" /> View
        </Button>
      ),
    },
  ];


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

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Gender</label>
                    <Select value={gender} onValueChange={(value) => setGender(value)}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Gender</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Age Group</label>
                    <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value)}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Age Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Age Group</SelectItem>
                        <SelectItem value="1-5">1-5</SelectItem>
                        <SelectItem value="5-10'">5-10'</SelectItem>
                        <SelectItem value="10-15">10-15</SelectItem>
                        <SelectItem value="15-20">15-20</SelectItem>
                        <SelectItem value="20-30">20-30</SelectItem>
                        <SelectItem value="30-40">30-40</SelectItem>
                        <SelectItem value="40-50">40-50</SelectItem>
                        <SelectItem value="50-60">50-60</SelectItem>
                        <SelectItem value="60+">60+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nutrition Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Nutrition Status</label>
                    <Select value={nutritionStatus} onValueChange={(value) => setNutritionStatus(value)}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Nutrition Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Type</SelectItem>
                        <SelectItem value="SAM">SAM</SelectItem>
                        <SelectItem value="MAM">MAM</SelectItem>
                        <SelectItem value="Normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blood Pressure */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select BP Type </label>
                    <Select value={bpStatus} onValueChange={(value) => setBpStatus(value)}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Blood Pressure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Type</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blood Sugar Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Sugar-Level</label>
                    <Select value={bloodSugar} onValueChange={(value) => setBloodSugar(value)}>
                      <SelectTrigger className="w-full hover:bg-slate-100">
                        <SelectValue placeholder="Select Sugar Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Type</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
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
                    {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</> : <><Search className="h-4 w-4 mr-2" /> Search</>}
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

              {/* Dialog after click on view button in table */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-0">
                  <DialogHeader className="flex flex-col items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle>Health Survey Details</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 p-6">
                    <div className="font-medium">Household No:</div>
                    <div>{selectedRow?.house_number}</div>

                    <div className="font-medium">Block:</div>
                    <div>{selectedRow?.block_name}</div>

                    <div className="font-medium">Village:</div>
                    <div>{selectedRow?.village_name}</div>

                    <div className="font-medium">Name:</div>
                    <div>{selectedRow?.name}</div>

                    <div className="font-medium">Gender:</div>
                    <div>{selectedRow?.gender}</div>

                    <div className="font-medium">Date of Birth:</div>
                    <div>{moment(selectedRow?.dob).format("DD/MM/YYYY")}</div>

                    <div className="font-medium">Age:</div>
                    <div>{selectedRow?.age}</div>

                    <div className="font-medium">Height (cm):</div>
                    <div>{selectedRow?.height}</div>

                    <div className="font-medium">Weight (kg):</div>
                    <div>{selectedRow?.weight}</div>

                    <div className="font-medium">BMI:</div>
                    <div>{selectedRow?.bmi}</div>

                    <div className="font-medium">Nutrition Status:</div>
                    <div>{selectedRow?.nutrition_status}</div>

                    <div className="font-medium">Blood Pressure:</div>
                    <div>{selectedRow?.blood_pressure}</div>

                    <div className="font-medium">Sugar Level:</div>
                    <div>{selectedRow?.blood_sugar} mg/dL</div>

                    <div className="font-medium">Remarks:</div>
                    <div>{selectedRow?.remarks}</div>

                    <div className="font-medium">Survey Date:</div>
                    <div>
                      {selectedRow?.created_at
                        ? format(new Date(selectedRow?.created_at), "dd/MM/yyyy hh:mm a")
                        : "N/A"}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>)
  );
}
