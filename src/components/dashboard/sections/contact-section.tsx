'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function ContactCard({ title, content }: any) {
  return (
    <div className="rounded-xl md:rounded-2xl border border-white/40 px-5 md:px-6 py-5 md:py-6 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <h3 className="font-bold text-slate-900 text-base md:text-lg">{title}</h3>
      <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">{content}</p>
    </div>
  );
}

export function ContactUsSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      toast.success(data.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full p-4 md:p-6 lg:p-8 bg-slate-50 overflow-y-auto fade-up">
      <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">Get in Touch</p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">Contact Us</h2>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
            Have questions about our AML solutions? Reach out to our expert team.
          </p>
        </section>

        {/* Split Layout: Form & Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Interactive Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="bg-slate-50/50 border-slate-200"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="bg-slate-50/50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-slate-700">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="bg-slate-50/50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                  className="bg-slate-50/50 border-slate-200 resize-none"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-700 transition-colors">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Cards */}
          <div className="flex flex-col gap-4 md:gap-6">
            <ContactCard title="Email Support" content="surajcdev@gmail.com" />
            <ContactCard title="Phone" content="+1 (555) 123-4567" />
            <ContactCard title="Global Headquarters" content="123 Financial Street, New York, NY 10001" />
            <ContactCard title="Operating Hours" content="Monday - Friday, 9:00 AM - 5:00 PM EST" />
          </div>

        </div>
      </div>
    </div>
  );
}
