"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0f0a1d] pt-20 pb-10 border-t border-white/5">
      {/* Improved: Grid columns start at 1, go to 2 on small screens, and 4 on desktop */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-gray-400">
        
        {/* Improved: Col-span only triggers on larger screens to keep mobile stacked cleanly */}
        <div className="sm:col-span-2 md:col-span-1">
          <h4 className="text-white font-bold mb-6">Jobify</h4>
          <p className="text-sm leading-relaxed">
            Connecting the next generation of talent with global opportunities through a smarter hiring experience.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Product</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="#features" className="hover:text-[#7270b1] transition-colors">Features</Link></li>
            <li><Link href="#how-it-works" className="hover:text-[#7270b1] transition-colors">How it works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/" className="hover:text-[#7270b1] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:text-[#7270b1] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Support</h4>
          <p className="text-sm mb-2">support@jobify.com</p>
          <p className="text-sm">+961 123 456</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-xs tracking-widest uppercase text-gray-500">
        © {new Date().getFullYear()} Jobify Platform. Built for the future.
      </div>
    </footer>
  );
}