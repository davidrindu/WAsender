import { supabase } from "../../supabase/supabase";
import { Tables } from "@/types/supabase";

export interface ScheduledMessage {
  id: string;
  title: string;
  content: string;
  scheduledDate: Date;
  recipient: string;
  status: "pending" | "sent" | "failed";
  teamMemberId?: string;
  teamMemberName?: string;
  teamMemberAvatar?: string;
  projectInfo?: {
    id: string;
    title: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  status: "active" | "inactive";
  projects: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "draft";
  message_count: number;
  scheduled_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  team?: TeamMember[];
}

// Fetch team members from Supabase
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw error;

    // Transform the data to match our TeamMember interface
    return users.map((user) => ({
      id: user.id,
      name: user.name || user.full_name || "Unknown",
      email: user.email || "",
      phone: user.phone || "+1 (555) 123-4567", // Use stored phone if available
      role: user.role || "User", // Use stored role if available
      avatar:
        user.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      status: user.status || "active", // Use stored status if available
      projects: 0, // Will be updated with project count
    }));
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
};

// Fetch scheduled messages from Supabase
export const fetchScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  try {
    const { data: messages, error } = await supabase
      .from("scheduled_messages")
      .select("*, users!team_member_id(name, avatar_url)");

    if (error) throw error;

    // Transform the data to match our ScheduledMessage interface
    return messages.map((message) => ({
      id: message.id,
      title: message.title,
      content: message.content,
      scheduledDate: new Date(message.scheduled_date),
      recipient: message.recipient,
      status: message.status as "pending" | "sent" | "failed",
      teamMemberId: message.team_member_id,
      teamMemberName: message.users?.name || "Unknown",
      teamMemberAvatar:
        message.users?.avatar_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.team_member_id}`,
    }));
  } catch (error) {
    console.error("Error fetching scheduled messages:", error);
    return [];
  }
};

// Count projects per team member
export const countProjectsPerTeamMember = async (): Promise<
  Record<string, number>
> => {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("user_id");

    if (error) throw error;

    // Count projects per user_id
    const projectCounts: Record<string, number> = {};
    projects.forEach((project) => {
      if (project.user_id) {
        projectCounts[project.user_id] =
          (projectCounts[project.user_id] || 0) + 1;
      }
    });

    return projectCounts;
  } catch (error) {
    console.error("Error counting projects:", error);
    return {};
  }
};

// Fetch projects from Supabase
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return projectsData as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Fetch projects with team members
export const fetchProjectsWithTeam = async (): Promise<Project[]> => {
  try {
    // First fetch all projects
    const projects = await fetchProjects();

    // Then fetch all team members
    const teamMembers = await fetchTeamMembers();

    // Check if we have project_team_members table
    const { data: projectTeamData, error: projectTeamError } = await supabase
      .from("project_team_members")
      .select("*");

    // If we have a project_team_members table and data, use it
    if (!projectTeamError && projectTeamData && projectTeamData.length > 0) {
      return projects.map((project) => {
        // Find all team members for this project
        const projectTeamIds = projectTeamData
          .filter((ptm) => ptm.project_id === project.id)
          .map((ptm) => ptm.user_id);

        // Get the team members by their IDs
        const projectTeam = teamMembers.filter((member) =>
          projectTeamIds.includes(member.id),
        );

        // Ensure the project owner is included if not already
        const ownerMember = teamMembers.find(
          (member) =>
            member.id === project.user_id &&
            !projectTeamIds.includes(member.id),
        );
        if (ownerMember) {
          projectTeam.push(ownerMember);
        }

        return {
          ...project,
          team: projectTeam.length > 0 ? projectTeam : [],
        };
      });
    } else {
      // Fallback to the previous implementation if no junction table exists
      return projects.map((project) => {
        // Assign 1-3 random team members to each project
        const teamSize = Math.floor(Math.random() * 3) + 1;
        const projectTeam = [];

        // Ensure the project owner (user_id) is always included
        const ownerMember = teamMembers.find(
          (member) => member.id === project.user_id,
        );
        if (ownerMember) {
          projectTeam.push(ownerMember);
        }

        // Add additional random team members
        while (projectTeam.length < teamSize) {
          const randomIndex = Math.floor(Math.random() * teamMembers.length);
          const randomMember = teamMembers[randomIndex];

          // Avoid duplicates
          if (!projectTeam.some((member) => member.id === randomMember.id)) {
            projectTeam.push(randomMember);
          }
        }

        return {
          ...project,
          team: projectTeam,
        };
      });
    }
  } catch (error) {
    console.error("Error fetching projects with team:", error);
    return [];
  }
};

// Seed initial scheduled messages if none exist
export const seedInitialMessages = async (
  teamMembers: TeamMember[],
): Promise<void> => {
  try {
    // Check if we already have messages
    const { count, error: countError } = await supabase
      .from("scheduled_messages")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    // If we already have messages, don't seed
    if (count && count > 0) return;

    // Sample message titles and content
    const messageSamples = [
      {
        title: "Meeting Reminder",
        content:
          "Don't forget our meeting today at 3 PM! We'll be discussing the quarterly results and planning for the next quarter.",
      },
      {
        title: "Follow-up",
        content:
          "Just following up on our conversation yesterday about the new product launch. Let me know if you need any additional information.",
      },
      {
        title: "Birthday Wish",
        content:
          "Happy birthday! Hope you have a great day! Wishing you all the best on your special day and throughout the coming year.",
      },
      {
        title: "Appointment Confirmation",
        content:
          "This is a confirmation for your appointment on Friday at 2:30 PM with Dr. Smith. Please arrive 15 minutes early to complete paperwork.",
      },
      {
        title: "Weekly Update",
        content:
          "Here's your weekly project update as requested. The development team has completed 85% of the planned tasks, and we're on track to meet the deadline.",
      },
      {
        title: "Order Confirmation",
        content:
          "Your order #12345 has been processed and will be shipped within 2 business days. Thank you for your purchase!",
      },
      {
        title: "Payment Reminder",
        content:
          "This is a friendly reminder that your invoice #INV-2023-456 is due in 3 days. Please make the payment to avoid late fees.",
      },
      {
        title: "Event Invitation",
        content:
          "You're invited to our annual company picnic on Saturday, June 15th at Central Park. Please RSVP by June 10th.",
      },
      {
        title: "Delivery Notification",
        content:
          "Your package has been delivered to your doorstep. If you haven't received it, please contact our customer service.",
      },
      {
        title: "Appointment Reschedule",
        content:
          "Due to unforeseen circumstances, we need to reschedule your appointment from Friday to Monday at the same time. Please confirm if this works for you.",
      },
    ];

    // Statuses to distribute
    const statuses: ("pending" | "sent" | "failed")[] = [
      "pending",
      "pending",
      "pending",
      "sent",
      "sent",
      "failed",
    ];

    // Create messages for each team member
    const messages = [];

    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      // Each team member gets 1-3 messages
      const messageCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < messageCount; j++) {
        const messageIndex = (i + j) % messageSamples.length;
        const statusIndex = (i + j) % statuses.length;
        const daysOffset = Math.floor(Math.random() * 5);

        messages.push({
          title: messageSamples[messageIndex].title,
          content: messageSamples[messageIndex].content,
          scheduled_date: new Date(
            Date.now() + daysOffset * 24 * 60 * 60 * 1000,
          ).toISOString(),
          recipient: `+1${Math.floor(Math.random() * 10000000000)}`,
          status: statuses[statusIndex],
          team_member_id: member.id,
        });
      }
    }

    // Insert the messages
    const { error: insertError } = await supabase
      .from("scheduled_messages")
      .insert(messages);

    if (insertError) throw insertError;

    console.log(`Seeded ${messages.length} initial messages`);
  } catch (error) {
    console.error("Error seeding initial messages:", error);
  }
};
