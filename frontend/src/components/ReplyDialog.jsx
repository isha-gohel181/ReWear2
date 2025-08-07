//frontend/src/components/ReplyDialog.jsx

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
import { Reply } from "lucide-react";
import { messageService } from "@/lib/apiServices";
import { toast } from "sonner";

const ReplyDialog = ({
  originalMessage,
  onReplySent,
  triggerClassName = "",
}) => {
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
        toUserId: originalMessage.from.clerkId,
        itemId: originalMessage.item._id,
        subject: subject.trim(),
        message: message.trim(),
      });

      toast.success("Reply sent successfully!");
      setOpen(false);
      setSubject("");
      setMessage("");

      // Call the callback to refresh messages
      if (onReplySent) {
        onReplySent();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to send reply";
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
      // Pre-fill subject with "Re: " prefix
      const replySubject = originalMessage.subject.startsWith("Re: ")
        ? originalMessage.subject
        : `Re: ${originalMessage.subject}`;
      setSubject(replySubject);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          <Reply className="h-4 w-4 mr-1" />
          Reply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Message</DialogTitle>
          <DialogDescription>
            Send a reply to {originalMessage.from.firstName}{" "}
            {originalMessage.from.lastName} about "{originalMessage.item.title}"
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
              placeholder="Write your reply here..."
              rows={4}
              maxLength={1000}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {message.length}/1000 characters
            </div>
          </div>

          {/* Show original message context */}
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">
              Original message:
            </p>
            <p className="text-sm font-medium mb-1">
              {originalMessage.subject}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {originalMessage.message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={submitting || !subject.trim() || !message.trim()}
              className="flex-1"
            >
              {submitting ? "Sending..." : "Send Reply"}
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

export default ReplyDialog;
