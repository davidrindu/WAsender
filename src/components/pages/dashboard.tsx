import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "../../../supabase/supabase";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh data from Supabase
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check Supabase connection
      const { data, error } = await supabase.from("projects").select("count");

      if (error) {
        console.error("Error connecting to Supabase:", error);
        setError("Failed to connect to database. Please try again.");
      }

      // The actual data fetching will be handled by the child components
      // We just need to set loading to true to trigger their useEffect hooks

      // Reset loading after a short delay to ensure components have time to fetch
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Error in refresh:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-between items-center">
            <div>
              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}
            </div>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            <DashboardGrid isLoading={loading} />
            <TaskBoard isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
