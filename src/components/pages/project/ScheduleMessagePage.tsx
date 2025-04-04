import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavigation from "../../dashboard/layout/TopNavigation";
import Sidebar from "../../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Calendar, Clock, Send } from "lucide-react";
import { useAuth } from "../../../../supabase/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addHours, setHours, setMinutes } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const scheduleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
  recipient: z
    .string()
    .min(3, { message: "Recipient must be at least 3 characters" }),
  scheduledDate: z.date({
    required_error: "Please select a date to schedule",
  }),
  hour: z.string(),
  minute: z.string(),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const ScheduleMessagePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: "",
      content: "",
      recipient: "",
      scheduledDate: addHours(new Date(), 1),
      hour: format(addHours(new Date(), 1), "HH"),
      minute: "00",
    },
  });

  // Generate hours and minutes for the select dropdowns
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  // Fetch existing draft messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("project_id", id)
          .eq("user_id", user.id)
          .eq("status", "draft");

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id, user]);

  // Load message data when a message is selected
  useEffect(() => {
    if (selectedMessage) {
      const message = messages.find((m) => m.id === selectedMessage);
      if (message) {
        form.setValue("title", message.title);
        form.setValue("content", message.content);
        form.setValue("recipient", message.recipient);
      }
    }
  }, [selectedMessage, messages, form]);

  const onSubmit = async (data: ScheduleFormValues) => {
    if (!user || !id) return;

    setIsSubmitting(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(data.scheduledDate);
      scheduledDateTime.setHours(parseInt(data.hour));
      scheduledDateTime.setMinutes(parseInt(data.minute));

      // Create or update the message in the database
      let messageId = selectedMessage;
      let operation;

      if (selectedMessage) {
        // Update existing message
        operation = supabase
          .from("messages")
          .update({
            title: data.title,
            content: data.content,
            recipient: data.recipient,
            scheduled_at: scheduledDateTime.toISOString(),
            status: "scheduled",
          })
          .eq("id", selectedMessage);
      } else {
        // Create new message
        operation = supabase
          .from("messages")
          .insert([
            {
              project_id: id,
              user_id: user.id,
              title: data.title,
              content: data.content,
              recipient: data.recipient,
              scheduled_at: scheduledDateTime.toISOString(),
              status: "scheduled",
            },
          ])
          .select();
      }

      const { data: messageData, error } = await operation;

      if (error) throw error;

      // Update project scheduled_count
      await supabase
        .from("projects")
        .update({
          scheduled_count: supabase.rpc("increment", {
            row_id: id,
            table_name: "projects",
            column_name: "scheduled_count",
          }),
        })
        .eq("id", id);

      toast({
        title: "Message scheduled",
        description: `Your message has been scheduled for ${format(scheduledDateTime, "PPP 'at' p")}.`,
      });

      // Navigate back to the project page
      navigate(`/project/${id}`);
    } catch (error: any) {
      console.error("Error scheduling message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Projects" />
        <main className="flex-1 overflow-auto p-6">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2"
            onClick={() => navigate(`/project/${id}`)}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Project
          </Button>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Schedule Message
              </h1>
              <p className="text-gray-500 mt-2">
                Schedule a WhatsApp message to be sent at a specific time.
              </p>
            </div>

            {messages.length > 0 && (
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Use Existing Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    onValueChange={(value) => setSelectedMessage(value)}
                    value={selectedMessage || undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an existing draft message" />
                    </SelectTrigger>
                    <SelectContent>
                      {messages.map((message) => (
                        <SelectItem key={message.id} value={message.id}>
                          {message.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Message Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a title for your message"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is for your reference only and won't be sent to
                            the recipient.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter recipient name or group"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the name of the person or group you want to
                            message.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Write the content of your WhatsApp message.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={
                                      "w-full pl-3 text-left font-normal flex justify-between items-center"
                                    }
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <Calendar className="h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name="hour"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Hour</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Hour" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {hours.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="minute"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Minute</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Minute" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minutes.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/project/${id}`)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex items-center gap-2"
                        disabled={isSubmitting}
                      >
                        <Clock className="h-4 w-4" />
                        {isSubmitting ? "Scheduling..." : "Schedule Message"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Schedule Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#f0f4f8] p-4 rounded-lg border border-[#d0d7de]">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {form.watch("title") || "Untitled Message"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Will be sent to{" "}
                        {form.watch("recipient") || "[Recipient]"} on{" "}
                        {form.watch("scheduledDate")
                          ? format(
                              form.watch("scheduledDate"),
                              "EEEE, MMMM d, yyyy",
                            )
                          : "[Date]"}{" "}
                        at {form.watch("hour") || "00"}:
                        {form.watch("minute") || "00"}
                      </p>
                      <p className="text-sm mt-3 text-gray-700">
                        {form.watch("content") ||
                          "[Message content will appear here]"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ScheduleMessagePage;
