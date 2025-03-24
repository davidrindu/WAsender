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
import {
  Calendar,
  ChevronRight,
  Clock,
  MessageSquare,
  QrCode,
  Settings,
  Smartphone,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl">
              WhatsApp Scheduler
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
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
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-green-600 text-white hover:bg-green-700 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            Schedule WhatsApp Messages
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-6">
            Compose, schedule, and send WhatsApp messages with ease
          </h3>
          <div className="flex justify-center space-x-6 text-xl text-green-600">
            <Link to="/signup" className="flex items-center hover:underline">
              Get started <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/" className="flex items-center hover:underline">
              How it works <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-12 bg-gray-100 flex items-center px-4 space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="pt-12 p-6">
                <img
                  src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80"
                  alt="WhatsApp Scheduler Dashboard"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-[#f5f5f7] text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            Powerful Features
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-4">
            Everything you need to manage your WhatsApp messages
          </h3>
          <div className="mt-8 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Message Composer</h4>
              <p className="text-gray-500">
                Rich text editor with emoji support and message preview to craft
                perfect messages.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Scheduling Interface</h4>
              <p className="text-gray-500">
                Calendar and time picker for setting future message delivery
                times with precision.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Message Dashboard</h4>
              <p className="text-gray-500">
                Table view of scheduled and sent messages with status indicators
                and filtering options.
              </p>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-semibold tracking-tight mb-1">
            How It Works
          </h2>
          <h3 className="text-2xl font-medium text-gray-500 mb-8">
            Simple steps to schedule your WhatsApp messages
          </h3>

          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">1. Connect WhatsApp</h4>
              <p className="text-gray-500">
                Scan a QR code with your phone to connect your WhatsApp account
                securely.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">2. Compose Message</h4>
              <p className="text-gray-500">
                Create your message with our rich text editor, add emojis, and
                preview how it will look.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">3. Schedule & Send</h4>
              <p className="text-gray-500">
                Set the date and time for delivery or send immediately with just
                a click.
              </p>
            </div>
          </div>
        </section>

        {/* Grid section for other features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              WhatsApp Connection
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Simple and secure integration
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-600">
              <Link to="/" className="flex items-center hover:underline">
                Learn more <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4">
                <QrCode className="h-32 w-32 text-gray-800" />
                <p className="text-sm text-gray-500">
                  Scan with your WhatsApp to connect
                </p>
                <Button className="w-full h-10 rounded-md bg-green-600 text-white hover:bg-green-700">
                  Connect WhatsApp
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              Message Dashboard
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Track all your scheduled messages
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-600">
              <Link to="/" className="flex items-center hover:underline">
                View demo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Meeting reminder</span>
                  </div>
                  <span className="text-xs text-gray-500">Today, 3:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Birthday wish</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Tomorrow, 9:00 AM
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Weekly update</span>
                  </div>
                  <span className="text-xs text-gray-500">Friday, 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-green-50 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">
              Ready to schedule your WhatsApp messages?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who save time by scheduling their messages
              in advance.
            </p>
            <Link to="/signup">
              <Button className="rounded-full bg-green-600 text-white hover:bg-green-700 text-lg px-8 py-6 h-auto">
                Get Started for Free
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Free plan available.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 text-xs text-gray-500">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-300 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                WhatsApp Scheduler
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>Copyright © 2025 WhatsApp Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
