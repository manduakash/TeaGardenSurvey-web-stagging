"use client"
import React, { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Lock, MapPin, Building, Users, Loader2, Eye, EyeOff } from "lucide-react"
import { useEffect } from "react"
import { createUser, getAllUsers, getBlocksBySubDivision, getDistrictsByState, getGPsByBlock, getSubDivisionsByDistrict } from "./api"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Page() {
  // useState hooks for form fields
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("admin@123")
  const [fullname, setFullname] = useState("")
  const [userType, setUserType] = useState("")
  const [state, setState] = useState("1")
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState("")
  const [subdivisions, setSubdivisions] = useState([])
  const [subdivision, setSubdivision] = useState("")
  const [blocks, setBlocks] = useState([])
  const [block, setBlock] = useState("")
  const [gps, setGps] = useState([])
  const [gramPanchayat, setGramPanchayat] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubdivisionLoading, setIsSubdivisionLoading] = useState(false)
  const [isBlockLoading, setIsBlockLoading] = useState(false)
  const [isGramPanchayatLoading, setIsGramPanchayatLoading] = useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [contactno, setContactno] = useState("")
  const [users, setUsers] = useState([])
  const [showPassword, setShowPassword] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    const fetchDistrict = async () => {
      setIsLoading(true)
      try {
        const response = await getDistrictsByState(state);
        console.log(response?.data);
        if (response.success) {
          setDistricts(response.data);
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
    fetchDistrict()
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const response = await getAllUsers()
    console.log(response?.data);
    // response.data

  //   {
  //     "UserID": 58,
    if (response.success) {
      setUsers(response?.data || []);
    } else {
      console.error(response.error);
    }
  }


  const handleDistrictChange = async (event) => {
    setDistrict(event)
    setIsSubdivisionLoading(true)
    try {
      const response = await getSubDivisionsByDistrict(event)
      console.log(response?.data);
      if (response.success) {
        setSubdivisions(response.data);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard count:', error);
    }
    finally {
      setIsSubdivisionLoading(false)
    }
  }

  const handleSubdivisionChange = async (event) => {
    setSubdivision(event)
    setIsBlockLoading(true)
    try {
      const response = await getBlocksBySubDivision(event)
      console.log(response?.data);
      if (response.success) {
        setBlocks(response.data);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard count:', error);
    }
    finally {
      setIsBlockLoading(false)
    }
  }

  const handleBlockChange = async (event) => {
    setBlock(event)
    setIsGramPanchayatLoading(true)
    try {
      const response = await getGPsByBlock(event)
      console.log(response?.data);
      if (response.success) {
        setGps(response.data);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard count:', error);
    }
    finally {
      setIsGramPanchayatLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitLoading(true)
    if (!userType) {
      toast.warning("Please select a user type.", {
        description: "User type is required to proceed.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }

    if (userType === "1" && !district) {
      toast.warning("Missing District", {
        description: "Please select a district for District User.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }

    if (userType === "2" && (!district || !subdivision)) {
      toast.warning("Incomplete Location", {
        description: "Please select both district and subdivision for Block User.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }

    if (userType === "3" && (!district || !subdivision)) {
      toast.warning("Incomplete Location", {
        description: "Please select both district and subdivision for Sub Division User.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }

    if (userType === "4" && (!district || !subdivision || !block || !gramPanchayat)) {
      toast.warning("Incomplete Location", {
        description: "Please select district, subdivision, block, and Gram Panchayat for GP User.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }
    if (!username) {
      toast.warning("Username is required", {
        description: "Please enter a username.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }
    // if (!password) {
    //   toast.warning("Password is required", {
    //     description: "Please enter a password.",
    //     variant: "destructive"
    //   });
    //   setIsSubmitLoading(false)
    //   return;
    // }
    if (!fullname) {
      toast.warning("Full Name is required", {
        description: "Please enter a full name.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }
    if (!contactno || contactno.length != 10) {
      toast.warning("Contact No. is required", {
        description: "Please enter a contact no.",
        variant: "destructive"
      });
      setIsSubmitLoading(false)
      return;
    }
    try {
      const response = await createUser(username, password, fullname, contactno, userType, state, district, subdivision, block, gramPanchayat)
      console.log(response?.data);
      if (response.success) {
        toast.success("User created successfully", {
          description: response?.message,
          variant: "success"
        });
        setGps(response.data);
      } else if (!response?.success) {
        toast.error("Failed to create user", {
          description: response?.message,
          variant: "error"
        });
      } else {
        toast.error("Failed to create user", {
          description: response?.message,
          variant: "error"
        });

        console.error(response.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard count:', error);
    }
    finally {
      setIsSubmitLoading(false)
    }
  }

  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    return users.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [users, searchQuery]);

  // Paginate users
  const paginatedUsers = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, pagination]);

  const togglePasswordVisibility = (userId) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const decryptPassword = (passwordHash) => {
    try {
      return atob(passwordHash);
    } catch (error) {
      console.error('Error decrypting password:', error);
      return '**********';
    }
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
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <Card className="w-full max-w-2xl mx-auto rounded-xl border border-muted bg-gradient-to-tr from-slate-50 via-white to-slate-100 shadow-md ring-1 ring-muted/10">
            <CardHeader className="space-y-1 pb-2 flex flex-col items-center text-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Users className="h-5 w-5 text-primary" />
                Create New User
              </CardTitle>
              <p className="text-sm text-muted-foreground">Fill in the details to create a new user account</p>
            </CardHeader>

            <Separator />

            <CardContent className="pt-1">
              <div>
                <div className="space-y-5">
                  {/* Section headings styled */}
                  <div className="bg-muted/20 px-3 rounded-md">
                    <h3 className="text-md font-semibold flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      User Account Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-md" htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        className="h-8"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="space-y-1 hidden">
                      <Label className="text-md" htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          className="h-8 pr-8"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                        <Lock className="absolute right-2 top-1.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-md" htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        className="h-8"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-md" htmlFor="contactno">Contact No.</Label>
                      <Input
                        id="contactno"
                        className="h-8"
                        value={contactno}
                        onChange={(e) => setContactno(e.target.value)}
                        placeholder="Enter contact no."
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-md" htmlFor="userType">User Type</Label>
                      <Select className="w-full" value={userType} onValueChange={setUserType}>
                        <SelectTrigger className="h-8 w-full" id="userType">
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">District Level User</SelectItem>
                          <SelectItem value="2">Block Level User</SelectItem>
                          <SelectItem value="3">Suvey User (GP Level User)</SelectItem>
                          <SelectItem value="4">Super Admin User (District Level Admin)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1 w-full">
                      <Label className="text-md">State</Label>
                      <Select value={state} onValueChange={setState} disabled>
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">West Bengal</SelectItem>
                          {/* <SelectItem value="2">Other State</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 w-full">
                      <Label className="text-md">District</Label>
                      <Select
                        value={district}
                        onValueChange={handleDistrictChange}
                      // disabled={isLoading} // Optional: disable while loading
                      >
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder={"Select district"} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoading ? (
                            <SelectItem value="loading" disabled>
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading...
                              </div>
                            </SelectItem>
                          ) : (
                            districts?.map((districtItem) => (
                              <SelectItem key={districtItem.id} value={districtItem.id}>
                                {districtItem.district_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {(userType === "2" || userType === "3") && (
                      <div className="space-y-1 w-full">
                        <Label className="text-md">Sub-division</Label>
                        <Select
                          value={subdivision}
                          onValueChange={handleSubdivisionChange}
                          disabled={isSubdivisionLoading} // Optional: disable while loading
                        >
                          <SelectTrigger className="h-8 w-full">
                            <SelectValue placeholder={isSubdivisionLoading ? "Loading subdivisions..." : "Select subdivision"} />
                          </SelectTrigger>
                          <SelectContent>
                            {isSubdivisionLoading ? (
                              <SelectItem value="loading" disabled>
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Loading...
                                </div>
                              </SelectItem>
                            ) : (
                              subdivisions?.map((subdivisionItem) => (
                                <SelectItem key={subdivisionItem.id} value={subdivisionItem.id}>
                                  {subdivisionItem.sub_division_name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(userType == "2" || userType == "3") && (
                      <div className="space-y-1 w-full">
                        <Label className="text-md">Block</Label>
                        <Select
                          value={block}
                          onValueChange={handleBlockChange}
                          disabled={isBlockLoading} // Optional: disable while loading
                        >
                          <SelectTrigger className="h-8 w-full">
                            <SelectValue placeholder={isBlockLoading ? "Loading blocks..." : "Select block"} />
                          </SelectTrigger>
                          <SelectContent>
                            {isBlockLoading ? (
                              <SelectItem value="loading" disabled>
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Loading...
                                </div>
                              </SelectItem>
                            ) : (
                              blocks?.map((blockItem) => (
                                <SelectItem key={blockItem.id} value={blockItem.id}>
                                  {blockItem.block_name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {(userType == "3") && (
                      <div className="space-y-1 w-full">
                        <Label className="text-md">Gram Panchayat</Label>
                        <Select
                          value={gramPanchayat}
                          onValueChange={setGramPanchayat}
                          disabled={isGramPanchayatLoading} // Optional: disable while loading
                        >
                          <SelectTrigger className="h-8 w-full">
                            <SelectValue placeholder={isGramPanchayatLoading ? "Loading Gram Panchayats..." : "Select Gram Panchayat"} />
                          </SelectTrigger>
                          <SelectContent>
                            {isGramPanchayatLoading ? (
                              <SelectItem value="loading" disabled>
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Loading...
                                </div>
                              </SelectItem>
                            ) : (
                              gps?.map((gpItem) => (
                                <SelectItem key={gpItem.id} value={gpItem.id}>
                                  {gpItem.gp_name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    size="sm"
                    className="h-8 px-4 bg-primary text-white hover:bg-primary/90"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitLoading} // disable while loading
                  >
                    {isSubmitLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating User...
                      </div>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full rounded-xl mt-10 px-10 border border-muted bg-gradient-to-tr from-slate-50 via-white to-slate-100 shadow-md ring-1 ring-muted/10">
            <CardHeader className="space-y-1 pb-2 flex flex-col items-center text-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Users className="h-5 w-5 text-primary" />
                User List
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-1/3"
                />
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-slate-700">Rows per page</Label>
                  <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => setPagination(prev => ({ ...prev, pageSize: Number(value) }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>User Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Sub-Division</TableHead>
                    <TableHead>Block/Municipality</TableHead>
                    <TableHead>GP/Ward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers?.map((user, key) => (
                    <TableRow key={key}>
                      <TableCell>{user.Username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {showPassword[user.UserID] ? (
                            decryptPassword(user.PasswordHash)
                          ) : (
                            '*************'
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePasswordVisibility(user.UserID)}
                          >
                            {showPassword[user.UserID] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{user.FullName}</TableCell>
                      <TableCell>{user.UserType}</TableCell>
                      <TableCell>{user.DistrictName || '-'}</TableCell>
                      <TableCell>{user.SubDivisionName || '-'}</TableCell>
                      <TableCell>{user.BlockName || '-'}</TableCell>
                      <TableCell>{user.GPName || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.pageIndex + 1} of {Math.ceil(filteredUsers.length / pagination.pageSize)} (Total Records: {filteredUsers.length})
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
                    disabled={pagination.pageIndex === 0}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                    disabled={pagination.pageIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                    disabled={pagination.pageIndex >= Math.ceil(filteredUsers.length / pagination.pageSize) - 1}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, pageIndex: Math.ceil(filteredUsers.length / pagination.pageSize) - 1 }))}
                    disabled={pagination.pageIndex >= Math.ceil(filteredUsers.length / pagination.pageSize) - 1}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
