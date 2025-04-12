"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-tables/reusable-datatable";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customMarkerIcon, setCustomMarkerIcon] = useState(null);

  // Lazy load Leaflet and set the custom marker icon
  useEffect(() => {
    async function loadLeaflet() {
      const L = (await import("leaflet")).default;
      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png", // Default Leaflet marker icon
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Anchor point of the icon
        popupAnchor: [1, -34], // Popup anchor point
        shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png", // Shadow image
        shadowSize: [41, 41], // Size of the shadow
      });
      setCustomMarkerIcon(icon);
    }
    loadLeaflet();
  }, []);

  const data = [
    {
      id: 1,
      survey_id: "SURV001",
      state: "West Bengal",
      district: "Darjeeling",
      sub_division: "Kurseong",
      block: "Mirik",
      gp: "Gopal Dhura",
      village: "Tea Garden Village",
      house_number: "001",
      latitude: 26.88812345,
      longitude: 88.26789012,
      family_income: 15000.50,
    },
    {
      id: 2,
      survey_id: "SURV002",
      state: "West Bengal",
      district: "Kalimpong",
      sub_division: "Kalimpong I",
      block: "Kalimpong Block",
      gp: "Kalimpong GP",
      village: "Hill Top Village",
      house_number: "002",
      latitude: 27.05712345,
      longitude: 88.47567890,
      family_income: 20000.75,
    },
    {
      id: 3,
      survey_id: "SURV003",
      state: "West Bengal",
      district: "Jalpaiguri",
      sub_division: "Mal",
      block: "Matiali",
      gp: "Matiali GP",
      village: "Tea Workers Colony",
      house_number: "003",
      latitude: 26.84567890,
      longitude: 88.12345678,
      family_income: 18000.00,
    },
    {
      id: 4,
      survey_id: "SURV004",
      state: "West Bengal",
      district: "Alipurduar",
      sub_division: "Falakata",
      block: "Falakata",
      gp: "Falakata GP",
      village: "Border Village",
      house_number: "004",
      latitude: 26.51234567,
      longitude: 89.34567890,
      family_income: 17000.30,
    },
    {
      id: 5,
      survey_id: "SURV005",
      state: "West Bengal",
      district: "Cooch Behar",
      sub_division: "Tufanganj",
      block: "Tufanganj",
      gp: "Tufanganj GP",
      village: "Riverside Colony",
      house_number: "005",
      latitude: 26.35467890,
      longitude: 89.56712345,
      family_income: 16000.20,
    },
    {
      id: 6,
      survey_id: "SURV006",
      state: "West Bengal",
      district: "Malda",
      sub_division: "Old Malda",
      block: "Old Malda",
      gp: "Malda GP",
      village: "Historic Town",
      house_number: "006",
      latitude: 25.01234567,
      longitude: 88.25467890,
      family_income: 14000.80,
    },
    {
      id: 7,
      survey_id: "SURV007",
      state: "West Bengal",
      district: "Murshidabad",
      sub_division: "Berhampore",
      block: "Berhampore",
      gp: "Berhampore GP",
      village: "Heritage Colony",
      house_number: "007",
      latitude: 24.12345678,
      longitude: 88.87654321,
      family_income: 19000.90,
    },
    {
      id: 8,
      survey_id: "SURV008",
      state: "West Bengal",
      district: "Nadia",
      sub_division: "Krishnanagar",
      block: "Krishnanagar",
      gp: "Krishnanagar GP",
      village: "Artisan Village",
      house_number: "008",
      latitude: 23.98765432,
      longitude: 88.43210987,
      family_income: 14500.40,
    },
    {
      id: 9,
      survey_id: "SURV009",
      state: "West Bengal",
      district: "Bardhaman",
      sub_division: "Durgapur",
      block: "Durgapur",
      gp: "Durgapur GP",
      village: "Industrial Town",
      house_number: "009",
      latitude: 23.45432109,
      longitude: 87.65498765,
      family_income: 21000.00,
    },
    {
      id: 10,
      survey_id: "SURV010",
      state: "West Bengal",
      district: "Hooghly",
      sub_division: "Chinsurah",
      block: "Chinsurah",
      gp: "Chinsurah GP",
      village: "Historic Hamlet",
      house_number: "010",
      latitude: 22.34567890,
      longitude: 87.98765432,
      family_income: 18000.50,
    },
    {
      id: 11,
      survey_id: "SURV011",
      state: "West Bengal",
      district: "Howrah",
      sub_division: "Uluberia",
      block: "Uluberia",
      gp: "Uluberia GP",
      village: "Trade Hub",
      house_number: "011",
      latitude: 22.13456789,
      longitude: 88.87654321,
      family_income: 22500.75,
    },
    {
      id: 12,
      survey_id: "SURV012",
      state: "West Bengal",
      district: "Kolkata",
      sub_division: "Central Kolkata",
      block: "Kolkata Municipal Corporation",
      gp: "Kolkata GP",
      village: "Metro City",
      house_number: "012",
      latitude: 22.572646,
      longitude: 88.363895,
      family_income: 30000.90,
    },
    {
      id: 13,
      survey_id: "SURV013",
      state: "West Bengal",
      district: "South 24 Parganas",
      sub_division: "Diamond Harbour",
      block: "Diamond Harbour",
      gp: "Diamond Harbour GP",
      village: "Coastal Town",
      house_number: "013",
      latitude: 21.98765432,
      longitude: 88.76543210,
      family_income: 16000.60,
    },
    {
      id: 14,
      survey_id: "SURV014",
      state: "West Bengal",
      district: "North 24 Parganas",
      sub_division: "Barrackpore",
      block: "Barrackpore",
      gp: "Barrackpore GP",
      village: "Military Cantonment",
      house_number: "014",
      latitude: 22.34567890,
      longitude: 88.76543210,
      family_income: 19000.80,
    },
    {
      id: 15,
      survey_id: "SURV015",
      state: "West Bengal",
      district: "Bankura",
      sub_division: "Bankura",
      block: "Bankura",
      gp: "Bankura GP",
      village: "Handicraft Town",
      house_number: "015",
      latitude: 23.42109876,
      longitude: 87.21098765,
      family_income: 15500.90,
    },
    {
      id: 16,
      survey_id: "SURV016",
      state: "West Bengal",
      district: "Purulia",
      sub_division: "Purulia Sadar",
      block: "Purulia Block",
      gp: "Purulia GP",
      village: "Tribal Hamlet",
      house_number: "016",
      latitude: 23.45678909,
      longitude: 86.87654321,
      family_income: 14000.30,
    },
    {
      id: 17,
      survey_id: "SURV017",
      state: "West Bengal",
      district: "Birbhum",
      sub_division: "Bolpur",
      block: "Bolpur",
      gp: "Bolpur GP",
      village: "Santiniketan",
      house_number: "017",
      latitude: 23.66678909,
      longitude: 87.45678909,
      family_income: 17000.10,
    }
  ];

  const columns = [
    {
      accessorKey: "survey_id",
      header: "Survey ID",
    },
    {
      accessorKey: "district",
      header: "District",
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
    },
    {
      accessorKey: "village",
      header: "Village",
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
            setSelectedRow(row?.original); // Set the selected row data
            setIsDialogOpen(true); // Open the dialog
          }}
        >
          <Eye className="text-cyan-600" />View
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

              <DataTable data={data} columns={columns} />

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[80%] min-w-[80%] h-auto p-0">
                  <DialogHeader className="flex items-center bg-cyan-600 text-white p-4 rounded-t-lg">
                    <DialogTitle className="text-4xl font-semibold">Survey Details</DialogTitle>
                  </DialogHeader>

                  {/* Main Content with Two Columns */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 w-full ">
                    {/* Left Side: Survey Details (Scrollable) */}
                    <div className="overflow-y-auto px-8 py-6">
                      <div className="grid grid-cols-2 gap-2 text-lg">
                        <div className="font-semibold">Survey ID:</div>
                        <div>{selectedRow?.survey_id}</div>

                        <div className="font-semibold">State:</div>
                        <div>{selectedRow?.state}</div>

                        <div className="font-semibold">District:</div>
                        <div>{selectedRow?.district}</div>

                        <div className="font-semibold">Sub Division:</div>
                        <div>{selectedRow?.sub_division}</div>

                        <div className="font-semibold">Block:</div>
                        <div>{selectedRow?.block}</div>

                        <div className="font-semibold">Gram Panchayat:</div>
                        <div>{selectedRow?.gp}</div>

                        <div className="font-semibold">Village:</div>
                        <div>{selectedRow?.village}</div>

                        <div className="font-semibold">House Number:</div>
                        <div>{selectedRow?.house_number}</div>

                        <div className="font-semibold">Family Income:</div>
                        <div>₹{selectedRow?.family_income.toLocaleString()}</div>

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

                    {/* Right Side: Map (Fixed) */}
                    {selectedRow?.latitude && selectedRow?.longitude && customMarkerIcon && (
                      <div className="flex items-center justify-center p-6">
                        <MapContainer
                          center={[selectedRow?.latitude, selectedRow?.longitude]}
                          zoom={13}
                          style={{ height: "90%", width: "100%", borderRadius: "8px" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker
                            position={[selectedRow?.latitude, selectedRow?.longitude]}
                            icon={customMarkerIcon} // Use the custom marker icon
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
  );
}
