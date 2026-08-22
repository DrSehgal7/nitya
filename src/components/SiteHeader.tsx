"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { href: "/#mission", label: "Mission" },
  { href: "/#numbers", label: "Numbers" },
  { href: "/habits", label: "Habits" },
  { href: "/races", label: "Races" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
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
            {navigation.map((item) => {
              const route = item.href.split("#")[0] || "/";
              const isActive = route !== "/" && pathname === route.replace(/\/$/, "");
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
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
