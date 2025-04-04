import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import {
  format,
  addDays,
  startOfToday,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getMonth,
  getYear,
} from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { fetchScheduledMessages, ScheduledMessage } from "@/lib/api";

const defaultMessages: ScheduledMessage[] = [
  {
    id: "1",
    title: "Meeting Reminder",
    content:
      "Don't forget our meeting today at 3 PM! We'll be discussing the quarterly results and planning for the next quarter.",
    scheduledDate: addDays(startOfToday(), 0),
    recipient: "+1234567890",
    status: "pending",
    teamMemberId: "1", // Alex Johnson
  },
  {
    id: "2",
    title: "Follow-up",
    content:
      "Just following up on our conversation yesterday about the new product launch. Let me know if you need any additional information.",
    scheduledDate: addDays(startOfToday(), 1),
    recipient: "+1987654321",
    status: "pending",
    teamMemberId: "2", // Sarah Williams
  },
  {
    id: "3",
    title: "Birthday Wish",
    content:
      "Happy birthday! Hope you have a great day! Wishing you all the best on your special day and throughout the coming year.",
    scheduledDate: addDays(startOfToday(), 2),
    recipient: "+1122334455",
    status: "pending",
    teamMemberId: "3", // Michael Brown
  },
  {
    id: "4",
    title: "Appointment Confirmation",
    content:
      "This is a confirmation for your appointment on Friday at 2:30 PM with Dr. Smith. Please arrive 15 minutes early to complete paperwork.",
    scheduledDate: addDays(startOfToday(), 3),
    recipient: "+1555666777",
    status: "pending",
    teamMemberId: "4", // Emily Davis
  },
  {
    id: "5",
    title: "Weekly Update",
    content:
      "Here's your weekly project update as requested. The development team has completed 85% of the planned tasks, and we're on track to meet the deadline.",
    scheduledDate: addDays(startOfToday(), 4),
    recipient: "+1888999000",
    status: "pending",
    teamMemberId: "5", // David Wilson
  },
  {
    id: "6",
    title: "Order Confirmation",
    content:
      "Your order #12345 has been processed and will be shipped within 2 business days. Thank you for your purchase!",
    scheduledDate: addDays(startOfToday(), 1),
    recipient: "+1555123456",
    status: "sent",
    teamMemberId: "1", // Alex Johnson
  },
  {
    id: "7",
    title: "Payment Reminder",
    content:
      "This is a friendly reminder that your invoice #INV-2023-456 is due in 3 days. Please make the payment to avoid late fees.",
    scheduledDate: addDays(startOfToday(), 2),
    recipient: "+1777888999",
    status: "sent",
    teamMemberId: "2", // Sarah Williams
  },
  {
    id: "8",
    title: "Event Invitation",
    content:
      "You're invited to our annual company picnic on Saturday, June 15th at Central Park. Please RSVP by June 10th.",
    scheduledDate: addDays(startOfToday(), 3),
    recipient: "+1444555666",
    status: "failed",
    teamMemberId: "3", // Michael Brown
  },
  {
    id: "9",
    title: "Delivery Notification",
    content:
      "Your package has been delivered to your doorstep. If you haven't received it, please contact our customer service.",
    scheduledDate: addDays(startOfToday(), 2),
    recipient: "+1333444555",
    status: "failed",
    teamMemberId: "5", // David Wilson
  },
  {
    id: "10",
    title: "Appointment Reschedule",
    content:
      "Due to unforeseen circumstances, we need to reschedule your appointment from Friday to Monday at the same time. Please confirm if this works for you.",
    scheduledDate: addDays(startOfToday(), 1),
    recipient: "+1222333444",
    status: "failed",
    teamMemberId: "6", // Jessica Taylor
  },
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [messages, setMessages] = useState<ScheduledMessage[]>(defaultMessages);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch scheduled messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);

        // Fetch messages from the API
        const messagesData = await fetchScheduledMessages();

        if (messagesData && messagesData.length > 0) {
          setMessages(messagesData);
        } else {
          // If no messages found in database, use default messages for development
          console.log("No messages found in database, using default data");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in fetchMessages:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load scheduled messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();
  }, [toast]);

  // Function to get messages for the selected date
  const getMessagesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return messages.filter(
      (message) =>
        selectedDate && isSameDay(message.scheduledDate, selectedDate),
    );
  };

  // Function to check if a date has messages
  const hasMessages = (day: Date) => {
    return messages.some((message) => isSameDay(message.scheduledDate, day));
  };

  // Custom day renderer for the calendar
  const renderDay = (props: { date: Date; selected: boolean }) => {
    const day = props.date;
    const isSelected = date ? isSameDay(day, date) : false;
    const hasScheduledMessages = hasMessages(day);

    return (
      <div className="relative w-full h-full">
        <div
          className={`
          w-full h-full rounded-full flex items-center justify-center
          ${
            isSelected
              ? "bg-green-600 text-white font-medium"
              : isToday(day)
                ? "bg-green-50 border border-green-200"
                : ""
          }
          ${hasScheduledMessages && !isSelected ? "font-medium" : ""}
        `}
        >
          {format(day, "d")}
        </div>
        {hasScheduledMessages && !isSelected && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
        )}
      </div>
    );
  };

  const selectedDateMessages = getMessagesForDate(date);

  // Navigation functions for the calendar
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Get message counts by status
  const pendingCount = messages.filter(
    (msg) => msg.status === "pending",
  ).length;
  const sentCount = messages.filter((msg) => msg.status === "sent").length;
  const failedCount = messages.filter((msg) => msg.status === "failed").length;

  // Function to navigate to team member page
  const navigateToTeamMember = (teamMemberId: string | undefined) => {
    if (teamMemberId) {
      navigate(`/team?highlight=${teamMemberId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Calendar" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-green-600" />
                Message Calendar
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Schedule and manage your WhatsApp messages
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Message
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className="bg-white shadow-sm border-none cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDate(undefined); // Clear date selection to show all messages
                const tabsElement = document.querySelector(
                  '[data-state="active"][data-orientation="horizontal"][role="tablist"]',
                );
                const pendingTab =
                  tabsElement?.querySelector('[value="pending"]');
                if (pendingTab instanceof HTMLElement) {
                  pendingTab.click();
                }
              }}
            >
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                  <Clock3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white shadow-sm border-none cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDate(undefined); // Clear date selection to show all messages
                const tabsElement = document.querySelector(
                  '[data-state="active"][data-orientation="horizontal"][role="tablist"]',
                );
                const sentTab = tabsElement?.querySelector('[value="sent"]');
                if (sentTab instanceof HTMLElement) {
                  sentTab.click();
                }
              }}
            >
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sent</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {sentCount}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white shadow-sm border-none cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setDate(undefined); // Clear date selection to show all messages
                const tabsElement = document.querySelector(
                  '[data-state="active"][data-orientation="horizontal"][role="tablist"]',
                );
                const failedTab =
                  tabsElement?.querySelector('[value="failed"]');
                if (failedTab instanceof HTMLElement) {
                  failedTab.click();
                }
              }}
            >
              <CardContent className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mr-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Failed</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {failedCount}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm border-none col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                  <span>Calendar</span>
                  <span className="text-sm font-normal text-gray-500">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-end items-center mb-4 space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border-none"
                  components={{
                    Day: renderDay,
                  }}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-none col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex justify-between items-center">
                  <div className="flex items-center">
                    <span>
                      {date
                        ? format(date, "EEEE, MMMM d, yyyy")
                        : "No date selected"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 rounded-full px-3"
                  >
                    {selectedDateMessages.length} Messages
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Tabs defaultValue="all" className="mt-4">
                  <TabsList className="mb-4 bg-gray-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    {selectedDateMessages.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateMessages.map((message) => (
                          <div
                            key={message.id}
                            className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {message.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {message.content}
                                </p>
                              </div>
                              <Badge
                                className={
                                  message.status === "sent"
                                    ? "bg-green-100 text-green-800 rounded-full"
                                    : message.status === "failed"
                                      ? "bg-red-100 text-red-800 rounded-full"
                                      : "bg-yellow-100 text-yellow-800 rounded-full"
                                }
                              >
                                {message.status === "sent" && (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                )}
                                {message.status === "failed" && (
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                )}
                                {message.status === "pending" && (
                                  <Clock className="h-3 w-3 mr-1" />
                                )}
                                {message.status.charAt(0).toUpperCase() +
                                  message.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                              <div
                                className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-green-600 hover:underline"
                                onClick={() =>
                                  navigateToTeamMember(message.teamMemberId)
                                }
                              >
                                <User className="h-4 w-4 mr-1" />
                                {message.teamMemberName ? (
                                  <span>
                                    Assigned to: {message.teamMemberName}
                                  </span>
                                ) : (
                                  <span>To: {message.recipient}</span>
                                )}
                                {message.teamMemberId && " (View Team Member)"}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(message.scheduledDate, "h:mm a")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No messages scheduled
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 max-w-md">
                          There are no messages scheduled for this date. Create
                          a new message to get started.
                        </p>
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Schedule Message
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-0">
                    {messages.filter((msg) => msg.status === "pending").length >
                    0 ? (
                      <div className="space-y-3">
                        {messages
                          .filter((msg) => msg.status === "pending")
                          .map((message) => (
                            <div
                              key={message.id}
                              className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {message.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {message.content}
                                  </p>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800 rounded-full">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pending
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <div
                                  className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-green-600 hover:underline"
                                  onClick={() =>
                                    navigateToTeamMember(message.teamMemberId)
                                  }
                                >
                                  <User className="h-4 w-4 mr-1" />
                                  {message.teamMemberName ? (
                                    <span>
                                      Assigned to: {message.teamMemberName}
                                    </span>
                                  ) : (
                                    <span>To: {message.recipient}</span>
                                  )}
                                  {message.teamMemberId &&
                                    " (View Team Member)"}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(
                                    message.scheduledDate,
                                    "h:mm a, MMM d",
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    Message ID: {message.id}
                                  </span>
                                  <span className="text-xs font-medium text-gray-500">
                                    Will be sent in{" "}
                                    {Math.floor(Math.random() * 24) + 1} hours
                                  </span>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <Clock3 className="h-4 w-4 text-yellow-600 mr-2" />
                                    <span className="text-sm font-medium text-yellow-800">
                                      Pending Delivery
                                    </span>
                                  </div>
                                  <p className="text-xs text-yellow-700">
                                    This message is scheduled and waiting to be
                                    sent. It will be processed automatically at
                                    the scheduled time.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl">
                        <Clock3 className="h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No Pending Messages
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          There are no pending messages at this time.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sent" className="mt-0">
                    {messages.filter((msg) => msg.status === "sent").length >
                    0 ? (
                      <div className="space-y-3">
                        {messages
                          .filter((msg) => msg.status === "sent")
                          .map((message) => (
                            <div
                              key={message.id}
                              className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {message.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {message.content}
                                  </p>
                                </div>
                                <Badge className="bg-green-100 text-green-800 rounded-full">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Sent
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <div
                                  className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-green-600 hover:underline"
                                  onClick={() =>
                                    navigateToTeamMember(message.teamMemberId)
                                  }
                                >
                                  <User className="h-4 w-4 mr-1" />
                                  {message.teamMemberName ? (
                                    <span>
                                      Assigned to: {message.teamMemberName}
                                    </span>
                                  ) : (
                                    <span>To: {message.recipient}</span>
                                  )}
                                  {message.teamMemberId &&
                                    " (View Team Member)"}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(
                                    message.scheduledDate,
                                    "h:mm a, MMM d",
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    Message ID: {message.id}
                                  </span>
                                  <span className="text-xs font-medium text-gray-500">
                                    Sent {Math.floor(Math.random() * 12) + 1}{" "}
                                    hours ago
                                  </span>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                    <span className="text-sm font-medium text-green-800">
                                      Successfully Delivered
                                    </span>
                                  </div>
                                  <p className="text-xs text-green-700">
                                    This message was successfully delivered to
                                    the recipient's WhatsApp. Delivery
                                    confirmation received.
                                  </p>
                                  <div className="flex items-center mt-2 text-xs text-green-700">
                                    <span className="font-medium mr-2">
                                      Read status:
                                    </span>
                                    <span>
                                      {Math.random() > 0.5
                                        ? "Read"
                                        : "Delivered but not read yet"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No Sent Messages
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          There are no sent messages at this time.
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="failed" className="mt-0">
                    {messages.filter((msg) => msg.status === "failed").length >
                    0 ? (
                      <div className="space-y-3">
                        {messages
                          .filter((msg) => msg.status === "failed")
                          .map((message) => (
                            <div
                              key={message.id}
                              className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {message.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {message.content}
                                  </p>
                                </div>
                                <Badge className="bg-red-100 text-red-800 rounded-full">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Failed
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <div
                                  className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-green-600 hover:underline"
                                  onClick={() =>
                                    navigateToTeamMember(message.teamMemberId)
                                  }
                                >
                                  <User className="h-4 w-4 mr-1" />
                                  {message.teamMemberName ? (
                                    <span>
                                      Assigned to: {message.teamMemberName}
                                    </span>
                                  ) : (
                                    <span>To: {message.recipient}</span>
                                  )}
                                  {message.teamMemberId &&
                                    " (View Team Member)"}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(
                                    message.scheduledDate,
                                    "h:mm a, MMM d",
                                  )}
                                </div>
                              </div>
                              <div className="mt-3 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    Message ID: {message.id}
                                  </span>
                                  <span className="text-xs font-medium text-gray-500">
                                    Failed {Math.floor(Math.random() * 8) + 1}{" "}
                                    hours ago
                                  </span>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                                    <span className="text-sm font-medium text-red-800">
                                      Delivery Failed
                                    </span>
                                  </div>
                                  <p className="text-xs text-red-700 mb-2">
                                    This message could not be delivered to the
                                    recipient's WhatsApp. The system attempted
                                    delivery 3 times.
                                  </p>
                                  <div className="bg-red-100 p-2 rounded-md">
                                    <p className="text-xs font-medium text-red-800">
                                      Error details:
                                    </p>
                                    <p className="text-xs text-red-700 mt-1">
                                      {
                                        [
                                          "Recipient's phone is not connected to WhatsApp",
                                          "Network error during delivery attempt",
                                          "Recipient has blocked messages from unknown numbers",
                                          "WhatsApp API rate limit exceeded",
                                        ][Math.floor(Math.random() * 4)]
                                      }
                                    </p>
                                  </div>
                                  <div className="mt-3 flex justify-end">
                                    <button className="text-xs bg-white text-red-700 border border-red-300 rounded-md px-2 py-1 hover:bg-red-50 transition-colors">
                                      Retry Delivery
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No Failed Messages
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          There are no failed messages at this time.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;
