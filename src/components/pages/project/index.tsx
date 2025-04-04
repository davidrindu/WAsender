import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavigation from "../../dashboard/layout/TopNavigation";
import Sidebar from "../../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MessageSquare, Calendar, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "draft";
  message_count: number;
  scheduled_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchProject = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to view this project");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Project not found");

      setProject(data as Project);
    } catch (error: any) {
      console.error("Error fetching project:", error);
      setError(error.message || "Failed to load project");
      toast({
        title: "Error",
        description: error.message || "Failed to load project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`project-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `id=eq.${id}`,
        },
        () => fetchProject(),
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Projects" />
        <main className="flex-1 overflow-auto p-6">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" text="Loading project..." />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchProject}>Try Again</Button>
              </div>
            </div>
          ) : project ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Updated{" "}
                      {formatDistanceToNow(new Date(project.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">{project.description}</p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{project.message_count} messages</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{project.scheduled_count} scheduled</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Placeholder for future project content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      No messages yet. Create your first message to get started.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/project/${id}/create-message`)}
                    >
                      Create Message
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      Scheduled Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      No scheduled messages. Schedule a message to get started.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() =>
                        navigate(`/project/${id}/schedule-message`)
                      }
                    >
                      Schedule Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Project not found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
