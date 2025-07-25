//frontend/src/components/ContactOwerDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { messageService } from "@/lib/apiServices";
import { toast } from "sonner";

const ContactOwnerDialog = ({ item, owner, triggerClassName = "" }) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await messageService.sendMessage({
        toUserId: owner.clerkId,
        itemId: item._id,
        subject: subject.trim(),
        message: message.trim(),
      });

      toast.success("Message sent successfully!");
      setOpen(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSubject("");
      setMessage("");
    } else {
      setSubject(`Interested in: ${item.title}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`w-full ${triggerClassName}`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Owner</DialogTitle>
          <DialogDescription>
            Send a message to {owner.firstName} {owner.lastName} about "
            {item.title}"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              maxLength={200}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={4}
              maxLength={1000}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {message.length}/1000 characters
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={submitting || !subject.trim() || !message.trim()}
              className="flex-1"
            >
              {submitting ? "Sending..." : "Send Message"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactOwnerDialog;
