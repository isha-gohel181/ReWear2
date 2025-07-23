import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, MailOpen, Eye } from "lucide-react";
import { messageService } from "@/lib/apiServices";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";

const MessagesPage = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getMessages({ type: activeTab });
      setMessages(response.data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await messageService.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleMarkAsRead = async (messageId, currentlyRead) => {
    if (currentlyRead) return;

    try {
      await messageService.markAsRead(messageId);
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Message marked as read");
    } catch (error) {
      toast.error("Failed to mark message as read");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Inbox
            {unreadCount > 0 && activeTab !== "received" && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                <p className="text-muted-foreground text-center">
                  You haven't received any messages about your items yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  !message.isRead ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.from.profileImageUrl} />
                        <AvatarFallback>
                          {message.from.firstName?.[0]}
                          {message.from.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {message.from.firstName} {message.from.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{message.from.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleMarkAsRead(message._id, message.isRead)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{message.subject}</h4>
                    {!message.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {message.message}
                  </p>
                  {message.item && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <img
                        src={message.item.images?.[0]}
                        alt={message.item.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {message.item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {message.item.category}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No sent messages</h3>
                <p className="text-muted-foreground text-center">
                  You haven't sent any messages yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.to.profileImageUrl} />
                        <AvatarFallback>
                          {message.to.firstName?.[0]}
                          {message.to.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          To: {message.to.firstName} {message.to.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{message.to.username}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <h4 className="font-medium">{message.subject}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {message.message}
                  </p>
                  {message.item && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <img
                        src={message.item.images?.[0]}
                        alt={message.item.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {message.item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {message.item.category}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesPage;
