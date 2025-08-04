"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  MapPin,
  Send,
  ExternalLink,
  MessageSquare,
  Heart,
  Star,
  Globe,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  BookOpen,
  ShoppingBag,
  User,
  Clock,
  CheckCircle,
} from "lucide-react"

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const socialLinks = [
    {
      name: "Threads",
      username: "@brieflybillal",
      url: "https://www.threads.com/@brieflybillal",
      icon: MessageSquare,
      color: "bg-black text-white",
      description: "Follow for daily updates and insights",
    },
    {
      name: "Facebook",
      username: "brieflybillal",
      url: "https://www.facebook.com/brieflybillal",
      icon: Facebook,
      color: "bg-blue-600 text-white",
      description: "Connect and stay updated",
    },
    {
      name: "Instagram",
      username: "@brieflybillal",
      url: "https://www.instagram.com/brieflybillal/",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      description: "Visual stories and behind-the-scenes",
    },
    {
      name: "GitHub",
      username: "Henrybillal",
      url: "https://github.com/Henrybillal",
      icon: Github,
      color: "bg-gray-900 text-white",
      description: "Open source projects and code",
    },
    {
      name: "LinkedIn",
      username: "brieflybillal",
      url: "https://www.linkedin.com/in/brieflybillal/",
      icon: Linkedin,
      color: "bg-blue-700 text-white",
      description: "Professional network and career updates",
    },
    {
      name: "Medium",
      username: "@briflybillal",
      url: "https://medium.com/@briflybillal",
      icon: BookOpen,
      color: "bg-green-600 text-white",
      description: "In-depth articles and tutorials",
    },
    {
      name: "Twitter/X",
      username: "@henrybillal",
      url: "https://x.com/henrybillal",
      icon: Twitter,
      color: "bg-black text-white",
      description: "Quick thoughts and tech discussions",
    },
    {
      name: "Website",
      username: "sylhetscribe.xyz",
      url: "https://www.sylhetscribe.xyz",
      icon: Globe,
      color: "bg-indigo-600 text-white",
      description: "Personal website and portfolio",
    },
    {
      name: "Store",
      username: "CyberZynth Store",
      url: "https://saverfavor.com/store/cyberzynth/",
      icon: ShoppingBag,
      color: "bg-orange-600 text-white",
      description: "Digital products and services",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Get in Touch</h1>
              <p className="text-blue-100 mt-1">Let's connect and collaborate on amazing projects</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>briflybillal@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Global Remote</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Success Message */}
        {isSubmitted && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Message sent successfully!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Thank you for reaching out. I'll get back to you within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-500" />
                Send a Message
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Have a question or want to collaborate? Drop me a message!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me more about your project or question..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  I'm a passionate developer and creator focused on building innovative AI-powered applications and
                  digital solutions. I love connecting with fellow creators and collaborating on exciting projects.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">AI Development</Badge>
                  <Badge variant="secondary">Web Applications</Badge>
                  <Badge variant="secondary">Mobile Apps</Badge>
                  <Badge variant="secondary">Content Creation</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  What I Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    AI-powered application development
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Technical writing and tutorials
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Open source contributions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Digital product creation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Connect With Me
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Follow me on social media for updates, insights, and behind-the-scenes content
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-200 dark:hover:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color}`}>
                          <link.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {link.name}
                            </h3>
                            <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                          </div>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-mono">{link.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{link.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">How quickly do you respond?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I typically respond within 24 hours. For urgent matters, feel free to reach out on multiple platforms.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">What kind of projects do you work on?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  I specialize in AI applications, web development, mobile apps, and digital content creation. Open to
                  discussing any innovative project ideas!
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Do you offer consulting services?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Yes! I provide consulting for AI integration, technical architecture, and digital strategy. Contact me
                  to discuss your needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
