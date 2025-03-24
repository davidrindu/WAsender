import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  format,
  addDays,
  startOfToday,
  isSameDay,
  isToday,
  isAfter,
  isBefore,
} from "date-fns";

interface ScheduledMessage {
  id: string;
  title: string;
  content: string;
  scheduledDate: Date;
  recipient: string;
  status: "pending" | "sent" | "failed";
}

const defaultMessages: ScheduledMessage[] = [
  {
    id: "1",
    title: "Meeting Reminder",
    content: "Don't forget our meeting today at 3 PM!",
    scheduledDate: addDays(startOfToday(), 0),
    recipient: "+1234567890",
    status: "pending",
  },
  {
    id: "2",
    title: "Follow-up",
    content: "Just following up on our conversation yesterday.",
    scheduledDate: addDays(startOfToday(), 1),
    recipient: "+1987654321",
    status: "pending",
  },
  {
    id: "3",
    title: "Birthday Wish",
    content: "Happy birthday! Hope you have a great day!",
    scheduledDate: addDays(startOfToday(), 2),
    recipient: "+1122334455",
    status: "pending",
  },
  {
    id: "4",
    title: "Appointment Confirmation",
    content: "This is a confirmation for your appointment on Friday.",
    scheduledDate: addDays(startOfToday(), 3),
    recipient: "+1555666777",
    status: "pending",
  },
  {
    id: "5",
    title: "Weekly Update",
    content: "Here's your weekly project update as requested.",
    scheduledDate: addDays(startOfToday(), 4),
    recipient: "+1888999000",
    status: "pending",
  },
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [messages, setMessages] = useState<ScheduledMessage[]>(defaultMessages);

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
  const renderDay = (day: Date) => {
    const isSelected = date ? isSameDay(day, date) : false;
    const hasScheduledMessages = hasMessages(day);

    return (
      <div className="relative">
        <div
          className={`
          w-full h-full rounded-full flex items-center justify-center
          ${isSelected ? "bg-green-600 text-white" : isToday(day) ? "bg-green-100" : ""}
        `}
        >
          {format(day, "d")}
        </div>
        {hasScheduledMessages && !isSelected && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
        )}
      </div>
    );
  };

  const selectedDateMessages = getMessagesForDate(date);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Calendar" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Message Calendar
              </h1>
              <p className="text-sm text-gray-500">
                Schedule and manage your WhatsApp messages
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Message
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm col-span-1">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Calendar</h2>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  components={{
                    Day: ({ day }) => renderDay(day),
                  }}
                />
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm col-span-1 lg:col-span-2">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">
                    {date ? format(date, "MMMM d, yyyy") : "No date selected"}
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {selectedDateMessages.length} Messages
                  </Badge>
                </div>

                {selectedDateMessages.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateMessages.map((message) => (
                      <div
                        key={message.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{message.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {message.content}
                            </p>
                          </div>
                          <Badge
                            className={
                              message.status === "sent"
                                ? "bg-green-100 text-green-800"
                                : message.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {message.status.charAt(0).toUpperCase() +
                              message.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            To: {message.recipient}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(message.scheduledDate, "h:mm a")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No messages scheduled
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      There are no messages scheduled for this date.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Schedule Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;
