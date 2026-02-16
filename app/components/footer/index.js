'use client'
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
// AppFooter.js
export default function AppFooter() {
    return (
      <footer className="bg-gray-100 text-center py-6 mt-10 border-t">
        <div className="mb-2 text-gray-700 font-medium">Connect with us</div>
        <div className="flex justify-center gap-6 text-gray-600 text-xl">
          <a href="https://wa.me/+2779689423" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors duration-200">
            <i className="fab fa-whatsapp"><FaWhatsapp/></i>
          </a>
          <a href="https://instagram.com/tshidiso_modiko" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors duration-200">
            <i className="fab fa-instagram"><FaInstagram/></i> 
          </a>
          <a href="https://facebook.com/tshidiso.modiko.3" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors duration-200">
            <i className="fab fa-facebook"><FaFacebook/></i>
          </a>
          {/* <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors duration-200">
            <i className="fab fa-x-twitter"><FaXTwitter/></i> 
          </a> */}
        </div>
        <p className="text-sm text-gray-500 mt-4">&copy; {new Date().getFullYear()} Apartment Rental. All rights reserved.</p>
      </footer>
    );
  }