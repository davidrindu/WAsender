import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import EditTeamMemberDialog from "../team/EditTeamMemberDialog";
import { supabase } from "../../../supabase/supabase";
import {
  fetchTeamMembers,
  countProjectsPerTeamMember,
  seedInitialMessages,
  TeamMember,
} from "@/lib/api";

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(
    null,
  );
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check for highlighted member from URL params
  useEffect(() => {
    const highlightId = searchParams.get("highlight");
    if (highlightId) {
      setHighlightedMemberId(highlightId);

      // Find the member to highlight
      const memberToHighlight = teamMembers.find(
        (member) => member.id === highlightId,
      );
      if (memberToHighlight) {
        // Set search query to find this member
        setSearchQuery(memberToHighlight.name);

        // Set filter to match this member's status
        setFilter(memberToHighlight.status);

        toast({
          title: "Team Member Highlighted",
          description: `Showing details for ${memberToHighlight.name}`,
        });
      }
    }
  }, [searchParams, teamMembers]);

  // Fetch team members and project counts
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);

        // Fetch team members from Supabase
        const members = await fetchTeamMembers();

        if (members.length === 0) {
          // If no team members found, use default data for development
          console.log("No team members found in database, using default data");
          setTeamMembers([]);
          setLoading(false);
          return;
        }

        // Fetch project counts for each team member
        const projectCounts = await countProjectsPerTeamMember();

        // Update team members with project counts
        const updatedMembers = members.map((member) => ({
          ...member,
          projects: projectCounts[member.id] || 0,
        }));

        setTeamMembers(updatedMembers);

        // Seed initial messages if needed
        await seedInitialMessages(updatedMembers);

        setLoading(false);
      } catch (error) {
        console.error("Error loading team data:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load team data",
          variant: "destructive",
        });
      }
    };

    loadTeamData();
  }, []);

  // Filter team members based on search query and status filter
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter ? member.status === filter : true;
    return matchesSearch && matchesFilter;
  });

  const handleEditMember = (member: TeamMember) => {
    setEditMember(member);
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = (updatedMember: TeamMember) => {
    // Update the team member in the local state
    const updatedMembers = teamMembers.map((member) =>
      member.id === updatedMember.id ? updatedMember : member,
    );
    setTeamMembers(updatedMembers);

    toast({
      title: "Success",
      description: "Team member updated successfully",
    });
  };

  const handleDeleteMember = (id: string) => {
    // Remove the team member from the local state
    const updatedMembers = teamMembers.filter((member) => member.id !== id);
    setTeamMembers(updatedMembers);

    toast({
      title: "Success",
      description: "Team member deleted successfully",
    });
  };

  const handleAddMember = () => {
    // Create a new empty member for the add dialog
    const newMember: TeamMember = {
      id: crypto.randomUUID(), // Generate a UUID for compatibility with Supabase
      name: "",
      email: "",
      phone: "",
      role: "User",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      status: "active",
      projects: 0,
    };
    setEditMember(newMember);
    setIsAddDialogOpen(true);
  };

  const handleSaveNewMember = async (newMember: TeamMember) => {
    try {
      // Add the new team member to Supabase
      const { error } = await supabase.from("users").insert({
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        avatar_url: newMember.avatar,
        token_identifier: crypto.randomUUID(), // Required field
      });

      if (error) throw error;

      // Add the new team member to the local state
      setTeamMembers([...teamMembers, newMember]);

      toast({
        title: "Success",
        description: "New team member added successfully",
      });
    } catch (error) {
      console.error("Error adding team member:", error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

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
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddMember}
            >
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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card
                  key={index}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow animate-pulse"
                >
                  <CardContent className="p-6 h-[200px]"></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card
                  key={member.id}
                  className={`bg-white shadow-sm hover:shadow-md transition-shadow ${highlightedMemberId === member.id ? "ring-2 ring-green-500 shadow-lg" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
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
                          <DropdownMenuItem
                            onClick={() => handleEditMember(member)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditMember(member)}
                          >
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteMember(member.id)}
                          >
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
                      <div className="flex items-center text-sm">
                        <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">
                          {member.projects} projects
                        </span>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleEditMember(member)}
                      >
                        Edit Member
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
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

          {/* Edit Team Member Dialog */}
          <EditTeamMemberDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            member={editMember}
            onSave={handleSaveMember}
            onDelete={handleDeleteMember}
          />

          {/* Add Team Member Dialog (reusing the same component) */}
          <EditTeamMemberDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            member={editMember}
            onSave={handleSaveNewMember}
            onDelete={() => setIsAddDialogOpen(false)}
          />
        </main>
      </div>
    </div>
  );
};

export default TeamPage;
