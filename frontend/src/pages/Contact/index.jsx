import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'

const STORES = [
  {
    name:  'Main Store — Bhausinghji Road',
    addr:  'Bhausinghji Road, Kolhapur — 416001, Maharashtra',
    phone: '0231-2544441',
    hours: 'Mon – Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM',
  },
  {
    name:  'Venus Corner — Dasara Chowk',
    addr:  'Venus Corner, Dasara Chowk Road, Kolhapur, Maharashtra',
    phone: '+91 82371 29913',
    hours: 'Mon – Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM',
  },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', subject:'', message:'' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Helmet><title>Contact Us — Chipade Saraf | Kolhapur</title></Helmet>

      {/* Header */}
      <div className="bg-[#1a0a0f] py-14 text-center relative overflow-hidden">
        <img src="/images/imgi_26_selection.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10">
          <p className="label-gold mb-3">We're Here For You</p>
          <h1 className="font-serif text-5xl text-white mb-2">Contact Us</h1>
          <p className="font-sans text-white/50 text-sm">Kolhapur's Trusted Jewellers Since 1904</p>
        </div>
      </div>

      {/* Store cards */}
      <section className="py-14 bg-[#FDF8F0]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="label-gold mb-2">Our Stores</p>
            <h2 className="font-serif text-3xl text-gray-900">Visit Us in Kolhapur</h2>
            <div className="w-14 h-0.5 bg-[#C8963C] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {STORES.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className="bg-white p-8 border-t-4 border-[#8B1A4A] shadow-sm">
                <h3 className="font-serif text-xl text-[#8B1A4A] mb-5">{s.name}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <FiMapPin size={16} className="text-[#C8963C] shrink-0 mt-0.5" />
                    <span className="font-sans text-gray-600 text-sm leading-relaxed">{s.addr}</span>
                  </li>
                  <li className="flex gap-3">
                    <FiPhone size={16} className="text-[#C8963C] shrink-0 mt-0.5" />
                    <a href={`tel:${s.phone.replace(/[^\d+]/g,'')}`} className="font-sans text-gray-600 text-sm hover:text-[#8B1A4A] transition-colors">{s.phone}</a>
                  </li>
                  <li className="flex gap-3">
                    <FiClock size={16} className="text-[#C8963C] shrink-0 mt-0.5" />
                    <span className="font-sans text-gray-600 text-sm whitespace-pre-line">{s.hours}</span>
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Email */}
          <div className="mt-6 bg-white p-6 text-center border border-[#C8963C]/20">
            <FiMail size={22} className="text-[#C8963C] mx-auto mb-2" />
            <p className="font-sans font-semibold text-gray-800 text-sm mb-1">Email Us</p>
            <a href="mailto:chipadesamraf@gmail.com" className="font-sans text-[#8B1A4A] text-sm hover:underline">chipadesamraf@gmail.com</a>
          </div>
        </div>
      </section>

      {/* Contact form + Map */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12">

          {/* Form */}
          <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <p className="label-gold mb-3">Send a Message</p>
            <h2 className="font-serif text-3xl text-gray-900 mb-6">We'd Love to Hear From You</h2>
            <p className="font-sans text-gray-500 text-sm mb-8 leading-relaxed">
              Whether you want to enquire about a design, book an appointment, or ask about our bridal packages — we'll reply within 24 hours.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-[#C8963C]/30 bg-[#FDF8F0]">
                <FiCheckCircle size={40} className="text-[#C8963C]" />
                <h3 className="font-serif text-2xl text-gray-800">Message Sent!</h3>
                <p className="font-sans text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn-crimson text-xs mt-2">SEND ANOTHER</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                      className="input-base" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                      className="input-base" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
                    className="input-base" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">Subject</label>
                  <select value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}
                    className="input-base">
                    <option value="">Select a topic...</option>
                    <option>Product Enquiry</option>
                    <option>Bridal Appointment</option>
                    <option>Custom Order</option>
                    <option>Repair / Servicing</option>
                    <option>Bullion / Gold Rate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message:e.target.value})}
                    className="input-base resize-none" placeholder="Tell us what you're looking for..." />
                </div>
                <button type="submit" className="btn-crimson justify-center mt-2 gap-2">
                  <FiSend size={14} /> SEND MESSAGE
                </button>
              </form>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="flex flex-col gap-6">
            <img src="/images/imgi_30_footerbigimage_1.png" alt="Chipade Saraf Store"
              className="w-full aspect-video object-cover" />

            <div className="bg-[#8B1A4A] p-8 text-white">
              <h3 className="font-serif text-2xl text-[#ead08a] mb-4">Book a Bridal Appointment</h3>
              <p className="font-sans text-white/65 text-sm leading-relaxed mb-5">
                Planning your wedding jewellery? Visit our store and our bridal experts will curate a complete look — from Saaj & Thushi to earrings, bangles and rings.
              </p>
              <a href="tel:02312544441" className="btn-gold inline-flex text-xs">
                <FiPhone size={13} className="mr-2" /> CALL NOW: 0231-2544441
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="/images/imgi_13_Bride_jpg.jpg" alt="Bridal" className="w-full aspect-square object-cover object-top" />
              <img src="/images/imgi_8_Gold.jfif.jpg" alt="Gold jewellery" className="w-full aspect-square object-cover" />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
