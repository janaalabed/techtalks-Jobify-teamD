
"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        
        <div>
          <h4 className="text-white font-semibold mb-4">Jobify</h4>
          <p className="text-sm">
            Connecting talent and opportunity in one modern platform.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <Link href="#features" className="block hover:text-white">Features</Link>
          <Link href="#how-it-works" className="block hover:text-white">How it works</Link>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <Link href="/faq" className="block hover:text-white">FAQ</Link>
          <Link href="/terms" className="block hover:text-white">Terms & Privacy</Link>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <p>support@jobify.com</p>
          <p>+961 123 456</p>
        </div>
      </div>

      <div className="mt-16 text-center text-sm border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Jobify. All rights reserved.
      </div>
    </footer>
  );
}
