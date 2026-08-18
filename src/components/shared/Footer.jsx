"use client";
import { useState, useEffect } from "react";
import { useModal } from "@/context/ModalContext";

import { Instagram, Facebook, Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {

  const { openModal } = useModal();

  const handleAction = (modalType) => {
    openModal(modalType);
    setDropdownOpen(false);
  };
  return (
    <footer className="bg-[#003d33] text-white mt-5 border-t border-white/40 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-600 pb-10">
          {/* Column 1: Help Center */}
          <div>
            <h3 className="text-[#ffb400] text-xl font-bold mb-4">
              সাহায্য কেন্দ্র
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-[#16ff00]">
                  About US
                </Link>
              </li>
              <li>
                <Link href="/deposit" className="hover:text-[#16ff00]">
                  Deposit
                </Link>
              </li>
              <li>
                <Link href="/withdrawal" className="hover:text-[#16ff00]">
                  Withdrawal
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-[#16ff00]">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#16ff00]">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#16ff00]">
                  Privacy and Security
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#16ff00]">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Game Center */}
          <div>
            <h3 className="text-[#ffb400] text-xl font-bold mb-4">
              গেম সেন্টার
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  গরম খেলা
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  প্রিয় আইটেমস
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  স্লট
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  লাইভ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  স্পোর্টস
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  ই-স্পোর্টস
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  পোকার
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  ফিশিং
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#16ff00]">
                  লটারি
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 & 4: Brand & Socials */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0">
                <Image
                  src="/Ekhalo.png"
                  alt="TK999"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
              <p className="text-xs leading-relaxed text-gray-300">
                Our Website is an innovative online sportsbook and casino.
                Offering a wide variety of sports and betting markets with high
                odds, we make sure to bring you the best online experience ever!
              </p>
            </div>

            {/* Action Buttons & Socials */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center lg:justify-start">
              <button
                onClick={() => handleAction("বিনিয়োগ পরিকল্পনা")}
                className="w-full sm:w-auto bg-[#005c53] border border-cyan-500 text-cyan-400 px-8 py-2 rounded-md font-bold hover:bg-cyan-900 transition-all">
                অংশীদার
              </button>
              <button className="w-full sm:w-auto bg-[#005c53] border border-yellow-500 text-yellow-500 px-6 py-2 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-yellow-900 transition-all">
                <span className="bg-yellow-500 text-[#003d33] rounded-full p-1 text-[10px]">
                  💬
                </span>
                লাইভ চ্যাট
              </button>

              <div className="flex gap-3 mt-2 sm:mt-0">
                <SocialIcon color="bg-blue-600">
                  <Facebook size={18} />
                </SocialIcon>
                <SocialIcon color="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                  <Instagram size={18} />
                </SocialIcon>
                <SocialIcon color="bg-sky-500">
                  <Send size={18} />
                </SocialIcon>
                <SocialIcon color="bg-green-500">
                  <MessageCircle size={18} />
                </SocialIcon>
                <div className="border-2 border-red-500 text-red-500 rounded-full w-9 h-9 flex items-center justify-center font-bold text-xs">
                  18+
                </div>
              </div>
            </div>

            {/* Game Provider Grid */}
            <div className="grid grid-cols-4 gap-4 opacity-60 grayscale hover:grayscale-0 transition-all">
              <ProviderLogo bgUrl="/provider-jili.png" />
              <ProviderLogo bgUrl="/provider-pg.png" />
              <ProviderLogo bgUrl="/provider-spribe.png" />
              <ProviderLogo bgUrl="/provider-jdb.png" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-[10px] opacity-40 space-y-2 md:space-y-0 text-center">
          <p>© 2026 ekhalo All Rights Reserved.</p>
          <div className="text-right">
            <p>Activate Windows</p>
            <p>Go to Settings to activate Windows</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ children, color }) => (
  <Link
    href="#"
    className={`${color} w-9 h-9 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
  >
    {children}
  </Link>
);

const ProviderLogo = ({ bgUrl }) => (
  <div
    className="h-6 w-full bg-contain bg-no-repeat bg-center"
    style={{ backgroundImage: `url('${bgUrl}')` }}
  />
);

export default Footer;
