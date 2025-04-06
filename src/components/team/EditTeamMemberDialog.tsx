import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMember } from "@/lib/api";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  status: z.enum(["active", "inactive"]),
});

interface EditTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onSave: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const EditTeamMemberDialog = ({
  open,
  onOpenChange,
  member,
  onSave,
  onDelete,
}: EditTeamMemberDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      email: member?.email || "",
      phone: member?.phone || "",
      role: member?.role || "",
      status: member?.status || "active",
    },
  });

  React.useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        status: member.status,
      });
    }
  }, [member, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!member) {
      toast({
        title: "Error",
        description: "No team member data found to update",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // We'll store these values only in the local state since the metadata column doesn't exist

      // Update the member in the database
      const { error } = await supabase
        .from("users")
        .update({
          name: values.name,
          email: values.email,
          avatar_url: member.avatar, // Preserve avatar
          updated_at: new Date().toISOString(),
          role: values.role,
          status: values.status,
          phone: values.phone,
        })
        .eq("id", member.id);

      if (error) {
        console.error("Supabase update error:", error);
        throw new Error(error.message || "Failed to update user record");
      }

      // Also update any related records in the projects table if needed
      const { error: projectsError } = await supabase
        .from("projects")
        .update({ user_name: values.name })
        .eq("user_id", member.id);

      if (projectsError) {
        console.warn("Error updating related projects:", projectsError);
        // Continue execution - this is not a critical error
      }

      const updatedMember: TeamMember = {
        ...member,
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status,
      };

      toast({
        title: "Success",
        description: "Team member updated successfully",
      });

      onSave(updatedMember);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description:
          "Failed to update team member: " +
          (error instanceof Error
            ? error.message
            : "Database connection issue. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!member) {
      toast({
        title: "Error",
        description: "No team member data found to delete",
        variant: "destructive",
      });
      return;
    }

    // Confirm deletion
    if (
      !confirm(
        "Are you sure you want to delete this team member? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      // First check if this member is assigned to any projects
      const { data: projectAssignments, error: checkError } = await supabase
        .from("projects")
        .select("id, title")
        .eq("user_id", member.id);

      if (checkError) {
        throw new Error(
          checkError.message || "Failed to check project assignments",
        );
      }

      // If member has project assignments, show warning
      if (projectAssignments && projectAssignments.length > 0) {
        const projectNames = projectAssignments.map((p) => p.title).join(", ");
        if (
          !confirm(
            `This team member is assigned to ${projectAssignments.length} project(s): ${projectNames}. Deleting this member will remove them from these projects. Continue?`,
          )
        ) {
          setIsDeleting(false);
          return;
        }

        // Update projects to remove this user's assignment
        const { error: projectUpdateError } = await supabase
          .from("projects")
          .update({ user_id: null, user_name: null })
          .eq("user_id", member.id);

        if (projectUpdateError) {
          console.warn(
            "Error updating projects during member deletion:",
            projectUpdateError,
          );
          // Continue with deletion anyway
        }
      }

      // Check for scheduled messages assigned to this user
      const { data: scheduledMessages, error: messagesError } = await supabase
        .from("scheduled_messages")
        .select("id")
        .eq("team_member_id", member.id); // Changed from user_id to team_member_id to match the API

      if (messagesError) {
        console.warn("Error checking scheduled messages:", messagesError);
      } else if (scheduledMessages && scheduledMessages.length > 0) {
        // Update scheduled messages to remove this user's assignment
        const { error: messageUpdateError } = await supabase
          .from("scheduled_messages")
          .update({ team_member_id: null }) // Changed from user_id to team_member_id
          .eq("team_member_id", member.id); // Changed from user_id to team_member_id

        if (messageUpdateError) {
          console.warn(
            "Error updating scheduled messages:",
            messageUpdateError,
          );
        }
      }

      // Delete the member from the database
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", member.id);

      if (error) {
        throw new Error(error.message || "Failed to delete user record");
      }

      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });

      onDelete(member.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description:
          "Failed to delete team member: " +
          (error instanceof Error
            ? error.message
            : "Database connection issue. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update the team member's information or change their role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? "Deleting..." : "Delete Member"}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isDeleting || isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isDeleting || isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamMemberDialog;
