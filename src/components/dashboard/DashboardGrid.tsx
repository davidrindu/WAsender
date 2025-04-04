import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, BarChart2, Users, Clock, User } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import { fetchTeamMembers, fetchProjectsWithTeam, Project } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectCardProps {
  id: string;
  title: string;
  progress: number;
  team: Array<{ id: string; name: string; avatar: string }>;
  dueDate: string;
}

interface DashboardGridProps {
  projects?: ProjectCardProps[];
  isLoading?: boolean;
}

interface TeamMemberWithProjects {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
  projects: number;
  projectsList: Array<{ id: string; title: string; progress: number }>;
}

const defaultProjects: ProjectCardProps[] = [
  {
    id: "1",
    title: "Website Redesign",
    progress: 75,
    team: [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      {
        id: "2",
        name: "Sarah Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
      {
        id: "3",
        name: "Michael Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      },
    ],
    dueDate: "2024-04-15",
  },
  {
    id: "2",
    title: "Mobile App Development",
    progress: 45,
    team: [
      {
        id: "5",
        name: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      {
        id: "2",
        name: "Sarah Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      },
    ],
    dueDate: "2024-05-01",
  },
  {
    id: "3",
    title: "Marketing Campaign",
    progress: 90,
    team: [
      {
        id: "1",
        name: "Alex Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      },
      {
        id: "5",
        name: "David Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      },
      {
        id: "6",
        name: "Jessica Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
      },
    ],
    dueDate: "2024-03-30",
  },
];

// Default team members data (same as in team.tsx)
const defaultTeamMembers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    status: "active",
    projects: 0,
    projectsList: [],
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active",
    projects: 0,
    projectsList: [],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "active",
    projects: 0,
    projectsList: [],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    status: "inactive",
    projects: 0,
    projectsList: [],
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    role: "Manager",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "active",
    projects: 0,
    projectsList: [],
  },
  {
    id: "6",
    name: "Jessica Taylor",
    email: "jessica@example.com",
    role: "User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    status: "active",
    projects: 0,
    projectsList: [],
  },
];

const ProjectCard = ({ title, progress, team, dueDate }: ProjectCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
          <BarChart2 className="h-4 w-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-gray-500">Progress</span>
              <span className="text-gray-900">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-gray-100 rounded-full"
              style={
                {
                  backgroundColor: "rgb(243, 244, 246)",
                } as React.CSSProperties
              }
            />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Due {dueDate}</span>
            </div>
            <div className="flex -space-x-2">
              {team.map((member, i) => (
                <Avatar
                  key={i}
                  className="h-7 w-7 border-2 border-white shadow-sm"
                >
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display team member projects
const TeamMemberProjectsDialog = ({
  member,
  open,
  onOpenChange,
}: {
  member: TeamMemberWithProjects | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <span>{member.name}'s Projects</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {member.projectsList.length > 0 ? (
            member.projectsList.map((project) => (
              <div
                key={project.id}
                className="p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <span className="text-sm text-gray-500">
                    {project.progress}% complete
                  </span>
                </div>
                <Progress
                  value={project.progress}
                  className="h-2 bg-gray-200 rounded-full"
                  style={
                    {
                      backgroundColor: "rgb(229, 231, 235)",
                      "--tw-bg-opacity": 1,
                    } as React.CSSProperties
                  }
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p>Project ID: {project.id}</p>
                  <p className="mt-1">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No Projects Assigned
              </h3>
              <p className="text-sm text-gray-500">
                This team member is not currently assigned to any projects.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DashboardGrid = ({
  projects: initialProjects = defaultProjects,
  isLoading = false,
}: DashboardGridProps) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(initialProjects);
  const [totalProjects, setTotalProjects] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithProjects[]>([]);
  const [activeTeamMembersCount, setActiveTeamMembersCount] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0);
  const [selectedMember, setSelectedMember] =
    useState<TeamMemberWithProjects | null>(null);
  const [isProjectsDialogOpen, setIsProjectsDialogOpen] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch projects with team members using our new API function
        const projectsWithTeam = await fetchProjectsWithTeam();

        // Fetch team members from the same source as the team page
        const apiTeamMembers = await fetchTeamMembers();

        // Calculate upcoming deadlines (projects due within 7 days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // Transform project data to match our ProjectCardProps format
        const formattedProjects = projectsWithTeam.map((project) => {
          // Calculate a progress value based on message_count and scheduled_count
          // In a real app, you would have a progress field in your database
          const totalMessages = project.message_count + project.scheduled_count;
          const progress =
            totalMessages > 0
              ? Math.floor((project.message_count / totalMessages) * 100)
              : Math.floor(Math.random() * 100); // Fallback for projects with no messages

          // Format team members for display
          const teamMembers =
            project.team?.map((member) => ({
              id: member.id,
              name: member.name,
              avatar: member.avatar,
            })) || [];

          return {
            id: project.id,
            title: project.title,
            progress,
            team: teamMembers,
            dueDate: project.updated_at
              ? new Date(project.updated_at).toISOString().split("T")[0]
              : "2024-05-30",
          };
        });

        // Count upcoming deadlines (projects due within 7 days)
        const upcomingDeadlinesCount = formattedProjects.filter((project) => {
          const dueDate = new Date(project.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        }).length;

        // Create a map to count projects per team member
        const projectCountMap: Record<string, number> = {};
        const projectsListMap: Record<string, any[]> = {};

        // Count projects for each team member
        projectsWithTeam.forEach((project) => {
          project.team?.forEach((member) => {
            if (!projectCountMap[member.id]) {
              projectCountMap[member.id] = 0;
              projectsListMap[member.id] = [];
            }
            projectCountMap[member.id]++;
            projectsListMap[member.id].push({
              id: project.id,
              title: project.title,
              progress: Math.floor(Math.random() * 100), // Placeholder progress
            });
          });
        });

        // Update team members with project counts and lists
        const teamMembersWithProjects = apiTeamMembers.map((member) => {
          return {
            ...member,
            projects: projectCountMap[member.id] || 0,
            projectsList: projectsListMap[member.id] || [],
          };
        });

        // Update state with fetched data
        setProjects(
          formattedProjects.length > 0 ? formattedProjects : initialProjects,
        );
        setTotalProjects(projectsWithTeam.length);
        setTeamMembers(teamMembersWithProjects);
        setActiveTeamMembersCount(
          apiTeamMembers.filter((member) => member.status === "active").length,
        );
        setUpcomingDeadlines(upcomingDeadlinesCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        // Try to fetch just the team members even if other data failed
        try {
          const apiTeamMembers = await fetchTeamMembers();

          setProjects(initialProjects);
          setTotalProjects(initialProjects.length);
          setTeamMembers(
            apiTeamMembers.map((member) => ({
              ...member,
              projects: 0,
              projectsList: [],
            })),
          );
          setActiveTeamMembersCount(
            apiTeamMembers.filter((member) => member.status === "active")
              .length,
          );
          setUpcomingDeadlines(0);
          setLoading(false);
        } catch (teamError) {
          console.error("Error fetching team data:", teamError);
          // Ultimate fallback to default data if even team fetch fails
          setTeamMembers(defaultTeamMembers);
          setActiveTeamMembersCount(
            defaultTeamMembers.filter((member) => member.status === "active")
              .length,
          );
          setUpcomingDeadlines(0);
          setLoading(false);
        }
      }
    };

    fetchData();

    // Also handle the isLoading prop for manual refresh
    if (isLoading) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetchData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, initialProjects]);

  const handleViewMemberProjects = (member: TeamMemberWithProjects) => {
    setSelectedMember(member);
    setIsProjectsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 h-full">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm h-[220px] flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center p-6">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">
                  Loading project data...
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              Total Projects
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              {totalProjects}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Active projects this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              Team Members
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              {activeTeamMembersCount}
            </div>
            <p className="text-sm text-gray-500 mt-1">Active contributors</p>

            {/* Team member project counts */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Project Assignments
              </h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {teamMembers
                  .filter((member) => member.status === "active")
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700 truncate max-w-[100px]">
                          {member.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => handleViewMemberProjects(member)}
                      >
                        {member.projects} projects
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-gray-900">
              Upcoming Deadlines
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">
              {upcomingDeadlines}
            </div>
            <p className="text-sm text-gray-500 mt-1">Due this week</p>
          </CardContent>
        </Card>

        {/* Project Cards */}
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {/* Team Member Projects Dialog */}
      <TeamMemberProjectsDialog
        member={selectedMember}
        open={isProjectsDialogOpen}
        onOpenChange={setIsProjectsDialogOpen}
      />
    </div>
  );
};

export default DashboardGrid;
