"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Image src={logo} alt="Jobify Logo" width={120} height={40} />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#how-it-works" className="hover:text-blue-600">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="#contact" className="hover:text-blue-600">
            Contact
          </Link>
          <Link href="/signup">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            href="#how-it-works"
            className="block px-6 py-3 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="block px-6 py-3 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#contact"
            className="block px-6 py-3 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link href="/signup">
            <button className="w-full text-left px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-b-lg">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
