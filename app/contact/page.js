'use client';

import { useEffect, useState } from 'react';
import AppFooter from '@/components/footer';
import AppHeader from '@/components/header';
import Image from 'next/image';
import {
  Moon,
  Sun,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  ShieldCheck,
  Clock3,
} from 'lucide-react';

export default function ContactPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('site-theme') : null;

    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      return;
    }

    if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (typeof window !== 'undefined') {
      localStorage.setItem('site-theme', next ? 'dark' : 'light');
    }

    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitted(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const whatsappMessage = encodeURIComponent(
      `Hello, I would like to get in touch.\n\n` +
        `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone}\n` +
        `Subject: ${form.subject}\n` +
        `Message: ${form.message}`
    );

    window.open(`https://wa.me/27796849423?text=${whatsappMessage}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <AppHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,64,175,0.12),transparent_32%),radial-gradient(circle_at_left,rgba(59,130,246,0.1),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_32%),radial-gradient(circle_at_left,rgba(59,130,246,0.12),transparent_28%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  Contact & support
                </span>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  Let’s help you find the right place faster
                </h1>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                  Have a question about a listing, need help with availability, or want to
                  arrange a viewing? Send us a message and we’ll guide you to the next step.
                </p>
              </div>
{/* 
              <div className="flex justify-start lg:justify-end">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>
              </div> */}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="relative h-72 sm:h-80">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d"
                    alt="Room Finders contact"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                      <ShieldCheck className="h-4 w-4" />
                      Trusted local rental support
                    </div>
                    <h2 className="mt-3 text-2xl font-bold text-white">
                      Talk to a team that knows the area
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">Call or WhatsApp</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Get quick help with enquiries and property matches.
                  </p>
                  <a
                    href="tel:+27796849423"
                    className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    (+27) 79 684 9423
                  </a>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">Response time</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Most enquiries get a response within the same day.
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                    Mon - Sat
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">Property enquiries</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Send detailed questions about rentals, pricing, and viewings.
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                    Fast follow-up support
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">Coverage area</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    We help renters find rooms and apartments in Tembisa and nearby areas.
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                    Tembisa, Gauteng
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <MessageSquare className="h-4 w-4" />
                      Send an enquiry
                    </div>
                    <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                      Tell us what you need
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Fill in your details and continue your message on WhatsApp for faster help.
                    </p>
                  </div>
                </div>

                {submitted && (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    Your message is ready. Complete the conversation in WhatsApp.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="What do you need help with?"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell us about the property, area, budget, or viewing you’re interested in."
                      rows="6"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      By sending this message, you agree to be contacted about your enquiry.
                    </p>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
                    >
                      <Send className="h-4 w-4" />
                      Send message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}