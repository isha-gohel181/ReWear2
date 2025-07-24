import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  ArrowRight,
  Recycle,
  Users,
  ShoppingBag,
  Star,
  Heart,
  Shield,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
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

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
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
      icon: <Recycle className="h-12 w-12 text-green-600" />,
      title: "Sustainable Fashion",
      description:
        "Reduce textile waste by giving clothes a second life through community exchanges.",
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Community Driven",
      description:
        "Connect with like-minded individuals who care about eco-conscious fashion.",
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-purple-600" />,
      title: "Points System",
      description:
        "Earn points for donating clothes and redeem them for something new to you.",
    },
  ];

  const benefits = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Quality Assurance",
      description: "Every item is verified for quality before listing",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Feel Good Fashion",
      description: "Make a positive environmental impact with every swap",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Secure Transactions",
      description: "Safe and protected exchanges with our trust system",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      title: "Discover Unique Pieces",
      description: "Find one-of-a-kind items you won't see anywhere else",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content:
        "ReWear has completely changed how I think about fashion. I've found amazing pieces while helping the environment!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Sustainability Advocate",
      content:
        "The community aspect is incredible. I've met so many like-minded people through clothing swaps.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "College Student",
      content:
        "Perfect for students on a budget! I've refreshed my entire wardrobe without spending much.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-blue-100/20" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-32 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-8"
            variants={fadeInUp}
            custom={0}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Join 10,000+ Eco-Conscious Fashion Lovers
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight"
            variants={fadeInUp}
            custom={1}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ReWear
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
            variants={fadeInUp}
            custom={2}
          >
            Transform your wardrobe sustainably. Swap, discover, and connect
            with a community that cares about the planet through conscious
            fashion choices.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6"
            variants={fadeInUp}
            custom={3}
          >
            <Button
              size="lg"
              onClick={() => handleCTA("/items")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-green-300 hover:border-green-400 hover:bg-green-50 px-8 py-6 text-lg font-semibold transition-all duration-300"
              onClick={() => handleCTA("/items")}
            >
              Explore Items
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={fadeInUp}
            custom={4}
          >
            {[
              ["10K+", "Happy Users"],
              ["50K+", "Items Swapped"],
              ["98%", "Satisfaction"],
              ["500+", "Cities Worldwide"],
            ].map(([stat, label], idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat}
                </div>
                <p className="text-gray-600 text-sm md:text-base">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-6">Why Choose ReWear?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover a revolutionary way to refresh your wardrobe while making
              a positive impact on the environment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index + 1}
              >
                <Card className="text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-6">More Reasons to Love Us</h2>
            <p className="text-xl text-gray-600">
              Experience the benefits that make ReWear the preferred choice for
              sustainable fashion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index + 1}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">
              Getting started with sustainable fashion is easier than ever
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "List Your Items",
                description:
                  "Upload photos and details of clothes you no longer wear. Our quality verification ensures everything meets our standards.",
              },
              {
                step: "02",
                title: "Earn Points",
                description:
                  "Receive points for each item you donate. The better the condition and demand, the more points you earn.",
              },
              {
                step: "03",
                title: "Shop & Swap",
                description:
                  "Use your points to claim items you love, or arrange direct swaps with community members nearby.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index + 1}
              >
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.description}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute -right-6 top-8 w-12 h-0.5 bg-gradient-to-r from-green-300 to-emerald-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-6">What Our Community Says</h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users who have transformed their
              fashion journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index + 1}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-green-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/20 to-transparent" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            className="text-5xl font-bold mb-6"
            variants={fadeInUp}
            custom={1}
          >
            Ready to Transform Your Wardrobe?
          </motion.h2>
          <motion.p
            className="text-2xl mb-12 opacity-90"
            variants={fadeInUp}
            custom={2}
          >
            Join our growing community of fashion-forward, environmentally
            conscious individuals making a real difference.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            variants={fadeInUp}
            custom={3}
          >
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-green-700 hover:bg-gray-100 font-semibold border-2 border-white px-8 py-6 text-lg"
              onClick={() => handleCTA("/dashboard")}
            >
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 font-semibold border-2 border-white px-8 py-6 text-lg"
              onClick={() => handleCTA("/items")}
            >
              Browse Collection
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Recycle className="h-8 w-8 text-green-400 mr-3" />
                <span className="text-2xl font-bold">ReWear</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Making sustainable fashion accessible to everyone. Join our
                community of eco-conscious fashion lovers and help reduce
                textile waste while discovering amazing pieces.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleCTA("/how-it-works")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/items")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Browse Items
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/add-item")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    List an Item
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/community")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCTA("/sustainability")}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                    type="button"
                  >
                    Sustainability
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">hello@rewear.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 ReWear. All rights reserved. Making fashion sustainable,
              one swap at a time.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
