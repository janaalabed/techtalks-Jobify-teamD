"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/uploads/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[75px] px-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer h-full">
            <Image
              src={logo}
              alt="Jobify Logo"
              width={120}
              height={30}
              className="object-contain block"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4 h-full">
          <Link href="#how-it-works" className="hover:text-blue-600 text-gray-700 text-sm flex items-center h-full">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-blue-600 text-gray-700 text-sm flex items-center h-full">
            Features
          </Link>
          <Link href="#contact" className="hover:text-blue-600 text-gray-700 text-sm flex items-center h-full">
            Contact
          </Link>
          <Link href="../register/">
            <button className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600 transition h-full flex items-center">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center h-full">
          <button onClick={toggleMenu} className="focus:outline-none h-full flex items-center">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-sm border-t">
          <Link
            href="#how-it-works"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#contact"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link href="../register/">
            <button className="w-full px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 transition text-left rounded-b-md">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
