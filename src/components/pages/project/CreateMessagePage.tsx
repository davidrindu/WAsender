import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopNavigation from "../../dashboard/layout/TopNavigation";
import Sidebar from "../../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Send, Smile } from "lucide-react";
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

const messageSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
  recipient: z
    .string()
    .min(3, { message: "Recipient must be at least 3 characters" }),
});

type MessageFormValues = z.infer<typeof messageSchema>;

const CreateMessagePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      title: "",
      content: "",
      recipient: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    if (!user || !id) return;

    setIsSubmitting(true);
    try {
      // Create the message in the database
      const { data: messageData, error } = await supabase
        .from("messages")
        .insert([
          {
            project_id: id,
            user_id: user.id,
            title: data.title,
            content: data.content,
            recipient: data.recipient,
            status: "draft",
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Message created",
        description: "Your message has been created successfully.",
      });

      // Navigate back to the project page
      navigate(`/project/${id}`);
    } catch (error: any) {
      console.error("Error creating message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create message",
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
                Create New Message
              </h1>
              <p className="text-gray-500 mt-2">
                Compose a new WhatsApp message for your project.
              </p>
            </div>

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
                              className="min-h-[200px]"
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

                    <div className="flex justify-between items-center pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                          // Add emoji picker functionality here
                          toast({
                            title: "Emoji Picker",
                            description:
                              "Emoji picker will be implemented in a future update.",
                          });
                        }}
                      >
                        <Smile className="h-4 w-4" /> Add Emoji
                      </Button>

                      <div className="flex gap-4">
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
                          <Send className="h-4 w-4" />
                          {isSubmitting ? "Creating..." : "Create Message"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Message Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#e5f7d3] p-4 rounded-lg max-w-md mx-auto border border-[#c5e1a5]">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {form.watch("content") ||
                        "Your message preview will appear here..."}
                    </p>
                    <p className="text-xs text-gray-500 text-right mt-2">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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

export default CreateMessagePage;
