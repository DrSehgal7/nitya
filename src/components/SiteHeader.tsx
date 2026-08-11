"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { href: "/#mission", label: "Mission" },
  { href: "/#numbers", label: "Numbers" },
  { href: "/#habits", label: "Habits" },
  { href: "/#races", label: "Race calendar" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="siteHeader">
      <div className="shell headerInner">
        <Logo />
        <div className="headerActions">
          <nav
            id="primary-navigation"
            className={open ? "primaryNav primaryNavOpen" : "primaryNav"}
            aria-label="Primary"
          >
            {navigation.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="navCta" href="/#contact" onClick={() => setOpen(false)}>
              Let&apos;s talk
            </Link>
          </nav>
          <ThemeToggle />
          <button
            className="menuToggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
