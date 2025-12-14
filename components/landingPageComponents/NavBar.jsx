
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/uploads/logo2.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-[80px]">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Jobify" width={150} height={32} />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["How It Works", "Features", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-gray-700 hover:text-[#14364f] transition"
            >
              {item}
            </Link>
          ))}

          <Link
            href="../register/"
             className="bg-gradient-to-r from- bg-[#2529a1] to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile bg-[#2529a1] hover:bg-[#1f238f]*/}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#14364f]"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          {["How It Works", "Features", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="block px-6 py-3 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            href="../register/"
            className="block px-6 py-3 bg-[#14364f] text-white"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
