import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ChevronDown, CheckCircle } from 'lucide-react';

interface ContactScreenProps {
  onNavigateHome: () => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onNavigateHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is delivery across Pakistan?',
      a: 'We offer same-day doorstep delivery within Lahore for orders placed before 2:00 PM. For Karachi, Islamabad, Rawalpindi, Faisalabad, Peshawar, and all other cities, express courier delivery takes between 2 to 3 business days.'
    },
    {
      q: 'Can I inspect my package before paying cash on delivery?',
      a: 'Yes! We encourage our customers to verify the intact outer seal and package condition upon delivery before completing cash handover with the courier rider.'
    },
    {
      q: 'Are all products authentic and covered under warranty?',
      a: '100% yes. Insight Store is an authorized retail partner for leading global brands. All items are shipped in sealed retail packaging and include official 1-year brand warranty registration.'
    },
    {
      q: 'What is your return & exchange policy?',
      a: 'We provide a 7-day hassle-free replacement window. In the rare event of a transit mishap or factory defect, our team arranges immediate doorstep replacement or prompt refund.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <div className="wrap page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
        <button onClick={onNavigateHome} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Contact Us</span>
      </nav>

      {/* Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-[#073faf] block mb-2">
          GET IN TOUCH
        </span>
        <h1 className="page-title text-3xl sm:text-4xl font-black text-[#101828] mb-3">
          We're here to help anytime
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          Need assistance tracking an existing order, checking bulk corporate rates, or claiming official warranty? Reach out directly to our team in Lahore.
        </p>
      </div>

      {/* Contact Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#073faf] flex items-center justify-center mb-4">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#101828] mb-1">Direct Helpline</h3>
          <p className="text-xs text-gray-500 mb-3">Call or WhatsApp anytime</p>
          <a href="tel:03145338340" className="text-sm font-extrabold text-[#073faf] hover:underline block">
            03145338340
          </a>
        </div>

        <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#101828] mb-1">Email Support</h3>
          <p className="text-xs text-gray-500 mb-3">Replies within 2 hours</p>
          <a href="mailto:hello@insightstore.pk" className="text-sm font-extrabold text-[#073faf] hover:underline block truncate">
            hello@insightstore.pk
          </a>
        </div>

        <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#101828] mb-1">Head Office</h3>
          <p className="text-xs text-gray-500 mb-2">Gulberg III, Lahore, Punjab</p>
          <span className="text-xs text-gray-400">Pakistan</span>
        </div>

        <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#101828] mb-1">Support Hours</h3>
          <p className="text-xs text-gray-500 mb-1">Mon – Sat: 9:00 AM – 9:00 PM</p>
          <span className="text-xs text-emerald-600 font-bold">Live Support Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-[#e7eaf0] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#101828] mb-2">Send us a message</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Fill out the form below and an Insight Store customer representative will follow up with you.
          </p>

          {isSent ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-black text-emerald-800 text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you, {name || 'valued customer'}. Our team will review your inquiry and contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Subject</label>
                <input
                  type="text"
                  placeholder="Order question, product query, or warranty"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 bg-[#073faf] hover:bg-[#082f87] text-white font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-black text-[#101828] mb-2">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#e7eaf0] rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#101828] flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-[#fbfcfd]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
