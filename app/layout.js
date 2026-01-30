import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const siteUrl = "https://www.tembisaroomfinders.co.za";

export const metadata = {
  title: "Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals in Tembisa",
  description:
    "Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available.",

  canonical: siteUrl,
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Tembisa Room Finders",
    title: "Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals in Tembisa",
    description:
      "Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Tembisa Room Finders Preview",
      },
    ],
  },

  // twitter: {
  //   handle: "@your_handle",
  //   site: "@your_handle",
  //   cardType: "summary_large_image",
  // },

  additionalMetaTags: [
    { name: "author", content: "Tshidiso Modiko" },
    { name: "keywords", content: "Tembisa Room Finders, Tembisa, Rooms, romm finders, rent tembisa, back room, bachelor, 2 room, tembisa room available" },
    { name: "theme-color", content: "#0a0a0a" }
  ],

  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],

  // JSON-LD Person Schema
  // This greatly improves Google search visibility
  schema: {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Tshidiso Modiko",
      url: "https://tembisaroomfinders.co.za", // Replace with your actual domain if different
      jobTitle: "Founder of TembisaRoomFinders",
      image: "https://firebasestorage.googleapis.com/v0/b/my-profile-95716.firebasestorage.app/o/me.jpeg?alt=media&token=7534e79e-1d94-4c34-8e20-15f83d806f02",
      sameAs: [
        "https://github.com/tshidiso-ium",
        "https://www.linkedin.com/in/tshidiso-modiko-a63400212"
      ],
      worksFor: {
        "@type": "Organization",
        name: "TembisaRoomFinders",
        url: "https://tembisaroomfinders.co.za"
      },
      knowsAbout: [
        "Real Estate Tech",
        "Property Listings",
        "React",
        "Next.js",
        "Node.js",
        "DevOps",
        "Cloud Engineering"
      ],
      description: "Tshidiso Modiko is a full-stack developer and the founder of TembisaRoomFinders, a platform focused on making it easy for residents in and around Tembisa to find affordable, reliable rental housing."
    }
  }
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
