import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="shell footerInner">
        <Logo />
        <p>A self-funded public promise to turn small actions into practical, measurable help.</p>
        <nav aria-label="Footer">
          <Link href="/about/">About</Link>
          <Link href="/work/">Habits</Link>
          <Link href="/goals/">Goals</Link>
          <Link href="/events/">Events</Link>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <Link href="/privacy/">Privacy</Link>
          <a href={site.repositoryUrl} target="_blank" rel="noreferrer">
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}
