"use client";

import React from "react";
import Link from "next/link"; // Import Link
import Image from "next/image"; // Import Image

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0f0a1d] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-gray-400">
        
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          {/* <Image 
            src="logo2.png" 
            alt="Jobify" 
            width={100} 
            height={24} 
            className="brightness-0 invert mb-6" 
          /> */}
          <p className="text-sm leading-relaxed">
            Connecting the next generation of talent with global opportunities through a smarter hiring experience.
          </p>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="#features" className="hover:text-[#7270b1] transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className="hover:text-[#7270b1] transition-colors">
                How it works
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="/terms" className="hover:text-[#7270b1] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#7270b1] transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <p className="text-sm mb-2">support@jobify.com</p>
          <p className="text-sm">+961 123 456</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-xs tracking-widest uppercase text-gray-500">
        © {new Date().getFullYear()} Jobify Platform. Built for the future.
      </div>
    </footer>
  );
}