import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import NewProjectDialog from "../projects/NewProjectDialog";
import ProjectCard from "../projects/ProjectCard";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "draft";
  message_count: number;
  scheduled_count: number;
  created_at: string;
  updated_at: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      setProjects(data as Project[]);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      setError(error.message || "Failed to load projects");
      toast({
        title: "Error",
        description: error.message || "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Set up real-time subscription
    const subscription = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => fetchProjects(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredProjects = filter
    ? projects.filter((project) => project.status === filter)
    : projects;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Projects" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500">
                Manage your message campaigns and schedules
              </p>
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
                onClick={() => setFilter("draft")}
                className={`${filter === "draft" ? "bg-gray-100" : ""}`}
              >
                Drafts
              </Button>
              <Button
                variant="outline"
                onClick={() => setFilter("completed")}
                className={`${filter === "completed" ? "bg-blue-100" : ""}`}
              >
                Completed
              </Button>
              <NewProjectDialog onProjectCreated={fetchProjects} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" text="Loading projects..." />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchProjects}>Try Again</Button>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <p className="text-gray-500 mb-4">
                {filter
                  ? `No ${filter} projects found`
                  : "No projects found. Create your first project to get started!"}
              </p>
              {filter && (
                <Button variant="outline" onClick={() => setFilter(null)}>
                  View All Projects
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectUpdated={fetchProjects}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
