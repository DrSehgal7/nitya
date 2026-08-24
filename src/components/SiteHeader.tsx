"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Habits" },
  { href: "/goals", label: "Goals" },
  { href: "/events", label: "Events" },
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
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : route !== "/" && pathname === route.replace(/\/$/, "");
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
            <Link className="navCta" href="/#contribute" onClick={() => setOpen(false)}>
              Contribute
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
