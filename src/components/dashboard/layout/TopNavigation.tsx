import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../supabase/auth";

interface Notification {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  read?: boolean;
  type?: "info" | "warning" | "success" | "error";
  link?: string;
}

interface TopNavigationProps {
  onSearch?: (query: string) => void;
  notifications?: Notification[];
}

const TopNavigation = ({
  onSearch = () => {},
  notifications = [
    {
      id: "1",
      title: "New project assigned",
      description: "You've been assigned to Website Redesign project",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      type: "info",
      link: "/projects",
    },
    {
      id: "2",
      title: "Meeting reminder",
      description: "Team standup in 15 minutes",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      read: false,
      type: "warning",
      link: "/calendar",
    },
    {
      id: "3",
      title: "Message sent successfully",
      description: "Your scheduled message was delivered",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      read: true,
      type: "success",
      link: "/calendar",
    },
  ],
}: TopNavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  // Count unread notifications
  const unreadCount = localNotifications.filter((n) => !n.read).length;

  if (!user) return null;

  return (
    <div className="w-full h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Link
          to="/"
          className="text-gray-900 hover:text-gray-700 transition-colors"
        >
          <Home className="h-5 w-5" />
        </Link>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9 h-10 rounded-full bg-gray-100 border-0 text-sm focus:ring-2 focus:ring-gray-200 focus-visible:ring-gray-200 focus-visible:ring-offset-0"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full h-9 w-9 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Bell className="h-4 w-4 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium border border-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl overflow-hidden p-2 border border-gray-200 shadow-lg w-72"
                >
                  <DropdownMenuLabel className="text-sm font-medium text-gray-900 px-2">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-gray-100" />
                  {localNotifications.length > 0 ? (
                    localNotifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`rounded-lg text-sm py-2 focus:bg-gray-100 cursor-pointer ${notification.read ? "opacity-70" : ""}`}
                        onClick={() => {
                          // Mark notification as read
                          setLocalNotifications((prev) =>
                            prev.map((n) =>
                              n.id === notification.id
                                ? { ...n, read: true }
                                : n,
                            ),
                          );

                          // Navigate to the linked page if available
                          if (notification.link) {
                            navigate(notification.link);
                          }
                        }}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <div className="font-medium flex items-center gap-2">
                              {notification.type === "warning" && (
                                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                              )}
                              {notification.type === "error" && (
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                              )}
                              {notification.type === "success" && (
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                              )}
                              {notification.type === "info" && (
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                              {notification.title}
                            </div>
                            {notification.timestamp && (
                              <div className="text-xs text-gray-400">
                                {new Date(
                                  notification.timestamp,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {notification.description || "New notification"}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-4 px-2 text-center text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                  {localNotifications.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs w-full text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // Mark all as read
                          setLocalNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true })),
                          );
                        }}
                      >
                        Mark all as read
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent className="rounded-lg bg-gray-900 text-white text-xs px-3 py-1.5">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 hover:cursor-pointer">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={user.email || ""}
              />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl border-none shadow-lg"
          >
            <DropdownMenuLabel className="text-xs text-gray-500">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => signOut()}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
