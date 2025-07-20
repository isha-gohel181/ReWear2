import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/shared/Loader";
import {
  RefreshCw,
  MessageSquare,
  Check,
  X,
  Clock,
  Star,
  Package,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { swapService } from "@/lib/apiServices";
import { toast } from "sonner";

const SwapsPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [swaps, setSwaps] = useState([]);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responding, setResponding] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      console.log("Fetching swaps...");

      const response = await swapService.getUserSwaps({
        page: 1,
        limit: 50,
      });

      console.log("API Response:", response);
      const swapsData = response.data || response;
      console.log("Swaps data:", swapsData);

      setSwaps(swapsData.swaps || []);
    } catch (error) {
      console.error("Error fetching swaps:", error);
      toast.error("Failed to load swaps");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapResponse = async (swapId, action) => {
    setResponding(true);
    try {
      await swapService.respondToSwap({
        swapId,
        response: action === "accept" ? "accepted" : "rejected",
      });

      toast.success(`Swap ${action}ed successfully!`);
      setResponseDialogOpen(false);
      setResponseMessage("");
      fetchSwaps(); // Refresh swaps
    } catch (error) {
      console.error(`Error ${action}ing swap:`, error);
      toast.error(`Failed to ${action} swap`);
    } finally {
      setResponding(false);
    }
  };

  const sendMessage = async (swapId, message) => {
    if (!message.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      await swapService.addMessage({
        swapId,
        content: message.trim(),
      });

      toast.success("Message sent!");
      setResponseMessage("");

      // Update the specific swap in state instead of refetching all swaps
      setSwaps((prevSwaps) =>
        prevSwaps.map((swap) => {
          if (swap._id === swapId) {
            const newMessage = {
              content: message.trim(),
              sender: {
                firstName: user.firstName,
                lastName: user.lastName,
                clerkId: user.id,
              },
              timestamp: new Date().toISOString(),
            };
            return {
              ...swap,
              messages: [...(swap.messages || []), newMessage],
            };
          }
          return swap;
        })
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "accepted":
        return <Check className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categorizeSwaps = () => {
    console.log("Categorizing swaps:", swaps);
    console.log("Current user:", user);

    if (!user || !swaps.length) {
      return { incoming: [], outgoing: [], completed: [] };
    }

    const incoming = swaps.filter((swap) => {
      // console.log("Checking swap:", swap);
      // console.log("Provider clerkId:", swap.provider?.clerkId);
      // console.log("User ID:", user.id);
      return swap.provider?.clerkId === user.id && swap.status === "pending";
    });

    const outgoing = swaps.filter(
      (swap) => swap.requester?.clerkId === user.id
    );

    const completed = swaps.filter(
      (swap) =>
        swap.status === "completed" &&
        (swap.requester?.clerkId === user.id ||
          swap.provider?.clerkId === user.id)
    );

    console.log("Categorized swaps:", { incoming, outgoing, completed });
    return { incoming, outgoing, completed };
  };

  const { incoming, outgoing, completed } = categorizeSwaps();

  if (loading) {
    return <Loader/>;
  }

  const ItemDisplay = ({ item, label }) => {
    if (!item) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <div className="flex space-x-3 p-3 border rounded-lg bg-gray-50">
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Item not found</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-16 h-16 relative">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.title || "Item"}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-full h-full bg-gray-200 rounded flex items-center justify-center"
              style={{
                display:
                  item.images && item.images.length > 0 ? "none" : "flex",
              }}
            >
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate text-sm">
              {item.title || "Untitled Item"}
            </h4>
            <div className="space-y-1">
              {item.category && (
                <p className="text-xs text-muted-foreground">
                  Category: {item.category}
                </p>
              )}
              {item.size && (
                <p className="text-xs text-muted-foreground">
                  Size: {item.size}
                </p>
              )}
              {item.brand && (
                <p className="text-xs text-muted-foreground">
                  Brand: {item.brand}
                </p>
              )}
              {item.condition && (
                <p className="text-xs text-muted-foreground">
                  Condition: {item.condition}
                </p>
              )}
              <p className="text-xs font-medium text-blue-600">
                {item.pointValue || 0} points
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SwapCard = ({ swap, type }) => {
    const isIncoming = type === "incoming";
    const otherUser = isIncoming ? swap.requester : swap.provider;
    const myItem = isIncoming ? swap.requestedItem : swap.offeredItem;
    const theirItem = isIncoming ? swap.offeredItem : swap.requestedItem;

    // Individual chat state for each swap card
    const [localChatOpen, setLocalChatOpen] = useState(false);
    const [localMessage, setLocalMessage] = useState("");
    const [localSending, setLocalSending] = useState(false);

    const handleSendMessage = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!localMessage.trim() || localSending) return;

      setLocalSending(true);
      try {
        await swapService.addMessage({
          swapId: swap._id,
          content: localMessage.trim(),
        });

        toast.success("Message sent!");
        setLocalMessage("");

        // Update the specific swap in state
        setSwaps((prevSwaps) =>
          prevSwaps.map((s) => {
            if (s._id === swap._id) {
              const newMessage = {
                content: localMessage.trim(),
                sender: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  clerkId: user.id,
                },
                timestamp: new Date().toISOString(),
              };
              return {
                ...s,
                messages: [...(s.messages || []), newMessage],
              };
            }
            return s;
          })
        );
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      } finally {
        setLocalSending(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    };

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser?.profileImageUrl} />
                <AvatarFallback>
                  {otherUser?.firstName?.[0] || "U"}
                  {otherUser?.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {otherUser?.firstName || "Unknown"}{" "}
                  {otherUser?.lastName || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{otherUser?.username || "unknown"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(swap.status)}>
                {getStatusIcon(swap.status)}
                <span className="ml-1 capitalize">{swap.status}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Swap Items Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ItemDisplay
              item={myItem}
              label={isIncoming ? "Your Item" : "You Offered"}
            />

            {/* Exchange Arrow - Hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex flex-col items-center space-y-1">
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">for</span>
              </div>
            </div>

            <ItemDisplay
              item={theirItem}
              label={isIncoming ? "They Want" : "You Want"}
            />
          </div>

          {/* Mobile Exchange Indicator */}
          <div className="lg:hidden flex items-center justify-center py-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ArrowRight className="h-4 w-4" />
              <span>Exchange</span>
            </div>
          </div>

          {/* Swap Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Type:</span>
              <Badge variant="outline">
                {swap.type === "direct_swap"
                  ? "Direct Swap"
                  : "Point Redemption"}
              </Badge>
            </div>
            {swap.pointsExchanged > 0 && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Points:</span>
                <span className="text-muted-foreground">
                  {swap.pointsExchanged}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          {swap.messages && swap.messages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recent Messages:</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {swap.messages.slice(-3).map((message, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm">
                    <p className="font-medium">
                      {message.sender?.firstName || "Unknown"}:
                    </p>
                    <p className="break-words">{message.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                ))}
                {swap.messages.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{swap.messages.length - 3} more messages
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(swap.createdAt)}</span>
            </div>
            <span>ID: {swap._id?.slice(-6) || "N/A"}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {isIncoming && swap.status === "pending" && (
              <>
                <Dialog
                  open={responseDialogOpen}
                  onOpenChange={setResponseDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSwap(swap)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Accept Swap Request</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to accept this swap? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleSwapResponse(selectedSwap?._id, "accept")
                          }
                          disabled={responding}
                          className="flex-1"
                        >
                          {responding ? "Accepting..." : "Accept Swap"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setResponseDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSwapResponse(swap._id, "reject")}
                  disabled={responding}
                >
                  <X className="h-3 w-3 mr-1" />
                  Decline
                </Button>
              </>
            )}

            <Dialog open={localChatOpen} onOpenChange={setLocalChatOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Chat with {otherUser?.firstName || "User"}
                  </DialogTitle>
                  <DialogDescription>
                    Discuss the details of your swap
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="h-48 border rounded p-3 bg-muted/20 overflow-y-auto">
                    {swap.messages && swap.messages.length > 0 ? (
                      <div className="space-y-2">
                        {swap.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-sm ${
                              message.sender?.clerkId === user.id
                                ? "bg-blue-100 ml-4"
                                : "bg-white mr-4"
                            }`}
                          >
                            <p className="font-medium">
                              {message.sender?.clerkId === user.id
                                ? "You"
                                : message.sender?.firstName || "Unknown"}
                              :
                            </p>
                            <p
                              className="break-words"
                              style={{ direction: "ltr" }}
                            >
                              {message.content}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(message.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center">
                        No messages yet. Start the conversation!
                      </p>
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1"
                      rows={2}
                      value={localMessage}
                      onChange={(e) => setLocalMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{ direction: "ltr" }}
                      dir="ltr"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={localSending || !localMessage.trim()}
                    >
                      {localSending ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/items/${myItem?._id}`)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Item
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Swaps</h1>
        <p className="text-muted-foreground">
          Manage your swap requests and track your exchanges
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </p>
                <p className="text-2xl font-bold">{incoming.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  My Requests
                </p>
                <p className="text-2xl font-bold">{outgoing.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">{completed.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Swaps Tabs */}
      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
          <TabsTrigger className="py-2 text-center" value="incoming">
            Incoming Requests ({incoming.length})
          </TabsTrigger>
          <TabsTrigger className="py-2 text-center" value="outgoing">
            My Requests ({outgoing.length})
          </TabsTrigger>
          <TabsTrigger className="py-2 text-center" value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Incoming Requests */}
        <TabsContent value="incoming" className="space-y-4">
          {incoming.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No incoming requests
                </h3>
                <p className="text-muted-foreground mb-4">
                  When someone wants to swap for your items, requests will
                  appear here.
                </p>
                <Button onClick={() => navigate("/add-item")}>
                  Add More Items
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {incoming.map((swap) => (
                <SwapCard key={swap._id} swap={swap} type="incoming" />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Outgoing Requests */}
        <TabsContent value="outgoing" className="space-y-4">
          {outgoing.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No outgoing requests
                </h3>
                <p className="text-muted-foreground mb-4">
                  Browse items and make swap requests to see them here.
                </p>
                <Button onClick={() => navigate("/items")}>Browse Items</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {outgoing.map((swap) => (
                <SwapCard key={swap._id} swap={swap} type="outgoing" />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Completed Swaps */}
        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No completed swaps
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your successful swaps will be recorded here.
                </p>
                <Button onClick={() => navigate("/items")}>
                  Start Swapping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completed.map((swap) => (
                <SwapCard key={swap._id} swap={swap} type="completed" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SwapsPage;
