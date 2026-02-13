import React from 'react';
import Link from 'next/link'; 
import { Container } from './Container';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-100 py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Info Section */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-700">Information</h4>
            <p className="text-gray-600 leading-relaxed">
              This site provide an helpful powerhouse to help the family of the patients .
            </p>
          </div>

          {/* Rapid Link Section */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-700">Useful Link</h4>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li>
                <Link href="/" className="hover:text-blue-600 hover:underline transition-all">
                  Home Page (Home)
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-blue-600 hover:underline transition-all">
                  Write us!  (Contact)
                </Link>
              </li>
              <li className="opacity-50 cursor-not-allowed">Privacy Policy</li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-700">Direct Contact</h4>
            <p className="text-gray-600 mb-1">Email: help@example.com</p>
            <p className="text-gray-600">Cellular: +00 012 345678</p>
          </div>

        </div>
        
        {/* Copyright Bar */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 text-gray-400 text-sm">
          © 2026 Sherpa Alzheimer.
        </div>
      </Container>
    </footer>
  );
};