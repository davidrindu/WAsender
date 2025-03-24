import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Video,
  FileText,
} from "lucide-react";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // FAQ data
  const faqs = [
    {
      question: "How do I connect my WhatsApp account?",
      answer:
        "To connect your WhatsApp account, go to Settings > WhatsApp Connection and click on 'Connect WhatsApp'. Then scan the QR code with your WhatsApp mobile app by going to Settings > WhatsApp Web/Desktop.",
    },
    {
      question: "Can I schedule recurring messages?",
      answer:
        "Yes, you can schedule recurring messages. When creating a new message, select the 'Recurring' option and choose your preferred frequency (daily, weekly, monthly).",
    },
    {
      question: "How many messages can I schedule per day?",
      answer:
        "The number of messages you can schedule depends on your subscription plan. Free accounts can schedule up to 10 messages per day, while premium accounts have higher or unlimited limits.",
    },
    {
      question:
        "What happens if my phone is offline when a message is scheduled?",
      answer:
        "For a message to be sent, your WhatsApp account must be connected and your phone must be online. If your phone is offline, the message will be queued and sent once your phone reconnects.",
    },
    {
      question: "Can I send messages to multiple recipients at once?",
      answer:
        "Yes, you can create a broadcast list to send the same message to multiple recipients. Each recipient will receive the message individually as if it was sent directly to them.",
    },
    {
      question: "How do I edit or cancel a scheduled message?",
      answer:
        "You can edit or cancel scheduled messages from the Calendar view. Select the date with the scheduled message, find the message you want to modify, and use the options menu to edit or cancel it.",
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Video tutorials data
  const tutorials = [
    {
      id: "1",
      title: "Getting Started with WhatsApp Scheduler",
      duration: "5:32",
      thumbnail:
        "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&q=80",
    },
    {
      id: "2",
      title: "How to Schedule Your First Message",
      duration: "3:45",
      thumbnail:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&q=80",
    },
    {
      id: "3",
      title: "Creating Message Templates",
      duration: "4:20",
      thumbnail:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&q=80",
    },
    {
      id: "4",
      title: "Advanced Scheduling Features",
      duration: "7:15",
      thumbnail:
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar activeItem="Help" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Help Center
            </h1>
            <p className="text-sm text-gray-500">
              Find answers, tutorials, and support for WhatsApp Scheduler
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, tutorials, and FAQs..."
              className="pl-10 py-6 text-lg bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="faq" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger
                value="tutorials"
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger
                value="documentation"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Common questions and answers about using WhatsApp Scheduler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredFaqs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No results found
                      </h3>
                      <p className="text-sm text-gray-500">
                        Try a different search term or browse our categories
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Tutorials</CardTitle>
                  <CardDescription>
                    Learn how to use WhatsApp Scheduler with step-by-step video
                    guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tutorials.map((tutorial) => (
                      <div key={tutorial.id} className="group cursor-pointer">
                        <div className="relative rounded-lg overflow-hidden mb-2">
                          <img
                            src={tutorial.thumbnail}
                            alt={tutorial.title}
                            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                              <Video className="h-6 w-6 text-gray-900" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {tutorial.duration}
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                          {tutorial.title}
                        </h3>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Comprehensive guides and reference materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <FileText className="h-8 w-8 text-green-600 mb-3" />
                        <h3 className="font-medium mb-1">
                          Getting Started Guide
                        </h3>
                        <p className="text-sm text-gray-500">
                          Learn the basics of WhatsApp Scheduler
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <FileText className="h-8 w-8 text-green-600 mb-3" />
                        <h3 className="font-medium mb-1">API Documentation</h3>
                        <p className="text-sm text-gray-500">
                          Technical reference for developers
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <FileText className="h-8 w-8 text-green-600 mb-3" />
                        <h3 className="font-medium mb-1">User Manual</h3>
                        <p className="text-sm text-gray-500">
                          Complete user guide with all features
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-6" />

                  <h3 className="font-medium text-lg mb-4">Popular Articles</h3>
                  <ul className="space-y-3">
                    <li className="p-3 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            How to create message templates
                          </h4>
                          <p className="text-sm text-gray-500">
                            Save time by creating reusable message templates
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Setting up recurring messages
                          </h4>
                          <p className="text-sm text-gray-500">
                            Learn how to schedule messages that repeat
                            automatically
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 bg-white rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Managing team access and permissions
                          </h4>
                          <p className="text-sm text-gray-500">
                            Control who can create and send messages in your
                            team
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get help from our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Send us a message</h3>
                      <p className="text-gray-500">
                        Fill out the form and we'll get back to you as soon as
                        possible
                      </p>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subject</label>
                          <Input placeholder="What do you need help with?" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <textarea
                            className="w-full min-h-[150px] rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Describe your issue in detail"
                          ></textarea>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Send Message
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-3">
                          Other ways to get help
                        </h3>
                        <ul className="space-y-4">
                          <li className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Live Chat</h4>
                              <p className="text-sm text-gray-500 mb-1">
                                Chat with our support team in real-time
                              </p>
                              <Button
                                variant="link"
                                className="text-green-600 p-0 h-auto"
                              >
                                Start Chat
                              </Button>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                              <HelpCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Community Forum</h4>
                              <p className="text-sm text-gray-500 mb-1">
                                Get help from other users and our team
                              </p>
                              <Button
                                variant="link"
                                className="text-green-600 p-0 h-auto"
                              >
                                Visit Forum
                              </Button>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                              <Video className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Schedule a Demo</h4>
                              <p className="text-sm text-gray-500 mb-1">
                                Get a personalized walkthrough
                              </p>
                              <Button
                                variant="link"
                                className="text-green-600 p-0 h-auto"
                              >
                                Book Demo
                              </Button>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium mb-2">Support Hours</h4>
                        <p className="text-sm text-gray-500 mb-3">
                          Our team is available during the following hours:
                        </p>
                        <ul className="text-sm space-y-1">
                          <li className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span className="font-medium">
                              9:00 AM - 8:00 PM EST
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Saturday:</span>
                            <span className="font-medium">
                              10:00 AM - 6:00 PM EST
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sunday:</span>
                            <span className="font-medium">Closed</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default HelpPage;
