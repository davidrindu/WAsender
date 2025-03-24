import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Mail, Phone, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
  projects: number;
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "active",
    projects: 8,
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active",
    projects: 5,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "active",
    projects: 3,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 (555) 456-7890",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "inactive",
    projects: 0,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 (555) 567-8901",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "active",
    projects: 6,
  },
  {
    id: "6",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    phone: "+1 (555) 678-9012",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    status: "active",
    projects: 2,
  },
];

const TeamPage = () => {
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(defaultTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  // Filter team members based on search query and status filter
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? member.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Team" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Team Members
              </h1>
              <p className="text-sm text-gray-500">
                Manage your team and their access
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email"
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFilter(null)}
                className={`${!filter ? "bg-gray-100" : ""}`}
              >
                All
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilter("active")}
                className={`${filter === "active" ? "bg-green-100" : ""}`}
              >
                Active
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilter("inactive")}
                className={`${filter === "inactive" ? "bg-gray-100" : ""}`}
              >
                Inactive
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{member.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{member.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <Badge
                      className={
                        member.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {member.projects} projects
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No team members found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilter(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeamPage;
