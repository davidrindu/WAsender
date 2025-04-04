import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { supabase } from "../../../supabase/supabase";
import { TaskDialog } from "@/components/tasks/TaskDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignee?: {
    name: string;
    avatar: string;
  };
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
  isLoading?: boolean;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Design System Updates",
    description: "Update component library with new design tokens",
    status: "todo",
    assignee: {
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  },
  {
    id: "2",
    title: "API Integration",
    description: "Integrate new backend endpoints",
    status: "in-progress",
    assignee: {
      name: "Bob Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
  },
  {
    id: "3",
    title: "User Testing",
    description: "Conduct user testing sessions",
    status: "done",
    assignee: {
      name: "Carol Williams",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  },
];

const TaskBoard = ({
  tasks: initialTasks = defaultTasks,
  onTaskMove = () => {},
  onTaskClick = () => {},
  isLoading = false,
}: TaskBoardProps) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Function to fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true);

      // In a real app, you would have a 'tasks' table in Supabase
      // For now, we'll use the 'messages' table as a proxy for tasks
      const { data, error } = await supabase.from("messages").select("*");

      if (error) {
        console.error("Error fetching tasks:", error);
        setTasks(initialTasks);
        setLoading(false);
        return;
      }

      // If we have messages data, transform it into tasks format
      if (data && data.length > 0) {
        const formattedTasks = data.map((message, index) => {
          // Determine status based on message status or randomly for demo
          let status: "todo" | "in-progress" | "done";
          if (message.status === "scheduled") {
            status = "todo";
          } else if (message.status === "sending") {
            status = "in-progress";
          } else if (message.status === "sent") {
            status = "done";
          } else {
            // Random status for demo purposes
            const statuses: Array<"todo" | "in-progress" | "done"> = [
              "todo",
              "in-progress",
              "done",
            ];
            status = statuses[Math.floor(Math.random() * statuses.length)];
          }

          // Generate random assignee for demo purposes
          // In a real app, you would fetch the actual assignee from the database
          const names = [
            "Alice Smith",
            "Bob Johnson",
            "Carol Williams",
            "David Brown",
          ];
          const randomName = names[Math.floor(Math.random() * names.length)];

          return {
            id: message.id || String(index + 1),
            title: message.title || `Task ${index + 1}`,
            description:
              message.content ||
              `This is a task description for task ${index + 1}`,
            status,
            assignee: {
              name: randomName,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomName.split(" ")[0]}`,
            },
          };
        });

        setTasks(formattedTasks);
      } else {
        // If no data, fall back to default tasks
        setTasks(initialTasks);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error in fetchTasks:", error);
      setTasks(initialTasks);
      setLoading(false);
    }
  };

  // Fetch tasks on component mount and when isLoading changes
  useEffect(() => {
    fetchTasks();

    // Also handle the isLoading prop for manual refresh
    if (isLoading) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetchTasks();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, initialTasks]);

  // Handle task added event
  const handleTaskAdded = () => {
    fetchTasks();
  };

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-50",
      borderColor: "border-green-100",
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    // Update local state first for immediate UI feedback
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );

    // Call the provided callback
    onTaskMove(taskId, status);

    // In a real app, you would update the task status in Supabase
    // This is commented out since we don't have a real tasks table yet
    /*
    try {
      // Map our status to the appropriate database status
      let dbStatus;
      if (status === 'todo') dbStatus = 'scheduled';
      else if (status === 'in-progress') dbStatus = 'sending';
      else if (status === 'done') dbStatus = 'sent';
      
      const { error } = await supabase
        .from('tasks') // or 'messages' if that's what we're using
        .update({ status: dbStatus })
        .eq('id', taskId);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert the UI change if the database update fails
      // You would need to fetch the current state again
    }
    */
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors opacity-50 cursor-not-allowed"
            disabled={true}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onTaskAdded={handleTaskAdded}
        />

        <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            >
              <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                <span
                  className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
                ></span>
                {column.title}
              </h3>
              <div className="space-y-3 flex flex-col items-center justify-center min-h-[200px]">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-4 border-gray-100 border-t-blue-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mt-3">
                  Loading tasks...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Task Board</h2>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onTaskAdded={handleTaskAdded}
      />

      <div className="grid grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-xl p-4 border ${column.borderColor}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Task["status"])}
          >
            <h3 className="font-medium text-gray-900 mb-4 flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${column.id === "todo" ? "bg-gray-400" : column.id === "in-progress" ? "bg-blue-400" : "bg-green-400"}`}
              ></span>
              {column.title}
            </h3>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, task.id)}
                    onClick={() => onTaskClick(task)}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 rounded-xl border-0 bg-white shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      {task.assignee && (
                        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-7 h-7 rounded-full mr-2 border border-white shadow-sm"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
