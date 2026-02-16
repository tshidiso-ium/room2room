'use client'

import { FaBullseye, FaHandsHelping, FaHome } from "react-icons/fa";
import Link from "next/link";
import AppFooter from "@/app/components/footer";
import AppHeader from "@/app/components/header";

const sections = [
  {
    icon: <FaBullseye className="text-blue-600 text-5xl mb-4" />,
    title: "Our Mission",
    description:
      "To simplify the apartment hunting process by providing reliable, transparent listings and intuitive tools tailored to your needs."
  },
  {
    icon: <FaHandsHelping className="text-blue-600 text-5xl mb-4" />,
    title: "Our Support",
    description:
      "Our friendly support team is here to guide you through every step of your rental journey, ensuring clarity and confidence."
  },
  {
    icon: <FaHome className="text-blue-600 text-5xl mb-4" />,
    title: "Our Listings",
    description:
      "A curated collection of high-quality apartments across the best neighborhoods, suited for every lifestyle and budget."
  }
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-black flex flex-col">
      <AppHeader />
      <section className="flex flex-col justify-start bg-white">
        <div
          className="w-full h-60 sm:h-80 md:h-96 bg-cover bg-[position:50%_20%] mb-10"
          style={{
            backgroundImage:
              "url('https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d')"
          }}
        ></div>

        <div className="px-6">
          <h1 className="text-4xl font-bold text-black mb-6 font-serif text-center">
            About Us
          </h1>
          <p className="max-w-2xl mx-auto text-gray-700 mb-12 text-center text-base">
            At Tembisa Room Finders, we are committed to transforming your rental journey into a seamless and enjoyable experience. With quality listings, dedicated support, and neighborhood insights, we help you find more than just a place to stay—we help you find home.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-blue-50 p-8 rounded-lg max-w-7xl mx-auto w-full">
            {sections.map(({ icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                {icon}
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-600 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <div className="bg-transparent py-10 mt-10 h-[100px]">
        <AppFooter />
      </div>
    </div>
  );
}
