"use client";

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-12">
        
        {/* About */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">About</h4>
          <p className="text-gray-400 text-sm">
            Jobify is a modern platform connecting students, job seekers, and companies efficiently.
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">Contact</h4>
          <p className="text-gray-400 text-sm">support@jobify.com</p>
          <p className="text-gray-400 text-sm">+961 123 456</p>
        </div>

        {/* Support / Terms */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">Support</h4>
          <Link href="/faq" className="text-gray-400 text-sm hover:text-white block">FAQ</Link>
          <Link href="/terms" className="text-gray-400 text-sm hover:text-white block">Terms & Privacy</Link>
        </div>

        {/* Social + CTA Buttons */}
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-white">Follow Us</h4>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
          </div>

        
        </div>

      </div>

      {/* Bottom text */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Jobify. All rights reserved.
      </div>
    </footer>
  );
}
