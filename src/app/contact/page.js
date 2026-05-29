"use client"

import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare, MapPin } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#c8f135] hover:underline mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
          Get in Touch
        </h1>
        <p className="text-[#999] text-lg mb-12">
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#c8f135]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-[#c8f135]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-[#888]">support@finova.app</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={20} className="text-[#00d4ff]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-[#888]">Available Monday-Friday, 9am-6pm IST</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#ff3cac]/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#ff3cac]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Location</h3>
                <p className="text-[#888]">Bangalore, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#bbb]">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#c8f135] focus:outline-none transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#bbb]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#c8f135] focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#bbb]">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#c8f135] focus:outline-none transition"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#bbb]">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#c8f135] focus:outline-none transition resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#c8f135] text-black font-bold rounded-lg hover:bg-[#e0b800] transition"
            >
              {submitted ? "Message Sent! ✓" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
