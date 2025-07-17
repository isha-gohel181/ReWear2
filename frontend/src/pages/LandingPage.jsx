import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Recycle, Users, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleCTA = (path) => {
    if (isSignedIn) {
      navigate(path);
    } else {
      navigate("/sign-in");
    }
  };

  const features = [
    {
      icon: <Recycle className="h-10 w-10 text-green-600" />,
      title: "Sustainable Fashion",
      description:
        "Reduce textile waste by giving clothes a second life through community exchanges.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Community Driven",
      description:
        "Connect with like-minded individuals who care about eco-conscious fashion.",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-purple-600" />,
      title: "Points System",
      description:
        "Earn points for donating clothes and redeem them for something new to you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-green-100 to-blue-100 py-24 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] bg-cover opacity-10 pointer-events-none" />
        <div className="container mx-auto px-6 text-center z-10 relative">
          <motion.h1
            className="text-5xl font-extrabold mb-6 leading-tight"
            variants={fadeInUp}
            custom={1}
          >
            Welcome to <span className="text-green-600">ReWear</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto mb-10"
            variants={fadeInUp}
            custom={2}
          >
            Swap, redeem, and explore sustainable fashion with a conscious
            community.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={fadeInUp}
            custom={3}
          >
            <Button
              size="lg"
              onClick={() => handleCTA("/items")}
              className="bg-green-600 hover:bg-green-700 text-white shadow-md"
            >
              Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 hover:border-gray-400"
              onClick={() => handleCTA("/items")}
            >
              Browse Items
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 hover:border-gray-400"
              onClick={() => handleCTA("/add-item")}
            >
              List an Item
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ReWear?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={index + 1}
              >
                <Card className="text-center shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Our Impact
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              ["1000+", "Items Exchanged", "text-green-600"],
              ["500+", "Active Members", "text-blue-600"],
              ["300+", "Successful Swaps", "text-purple-600"],
              ["95%", "Satisfaction Rate", "text-orange-600"],
            ].map(([stat, label, color], idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={idx + 2}
              >
                <div className={`text-4xl font-bold mb-2 ${color}`}>{stat}</div>
                <p className="text-gray-600">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white text-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold mb-4"
            custom={2}
            variants={fadeInUp}
          >
            Ready to Embrace Sustainable Fashion?
          </motion.h2>
          <motion.p className="text-lg mb-8" custom={3} variants={fadeInUp}>
            Join thousands making a positive environmental impact with ReWear.
          </motion.p>
          <motion.div variants={fadeInUp} custom={4}>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-green-700 hover:bg-gray-100 font-semibold"
              onClick={() => handleCTA("/dashboard")}
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
