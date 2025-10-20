"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Navbar = () => {


  const links = [
    { href: "/", label: "Home", icon: "/Lambda.svg" },
    { href: "/quizzes/services", label: "Quizzes", icon: "/Cognito.svg" },
  ]

  return (
    <header className="top-0 fixed w-[100dvw] z-[995] bg-inherit">
      <nav className="w-full bg-inherit">
        {/* <div className="flex justify-between items-center border-b-[2px] border-b-[#22272F]">
          <div></div>
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-primary">
                United States (N. California) <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                This does nothing.
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div> */}
        <div className="px-4 flex justify-start items-center gap-x-3 border-b-[2px] border-b-[#22272F]">
          {links.map((link) => {
            const pathname = usePathname();
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "pt-2 pb-1 text-[14px] text-primary font-semibold hover:text-[#3BB4FF] tracking-wide",
                )}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={20}
                  height={20}
                  className="inline-block mr-1 mb-1"
                  style={{ borderRadius: "2px" }}
                />
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="bg-[#161D26] flex justify-between items-center text-primary border-b-[2px] border-b-[#22272F]">
          <div className="flex justify-start items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-[16px] font-semibold text-[#2EA5F8] underline underline-offset-2 px-3 py-2 pb-3"
            >
              Quizzes
            </Link>
            <ChevronRight size={16} className="text-[#84A4AD]" />
            <Link
              href="/"
              className="flex items-center gap-2 text-[16px] font-semibold text-[#2EA5F8] underline underline-offset-2 px-3 py-2 pb-3"
            >
              Services
            </Link>
            <ChevronRight size={16} className="text-[#84A4AD]" />
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 pb-3 text-[#8C8C94]"
            >
              Multiple Choice
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
