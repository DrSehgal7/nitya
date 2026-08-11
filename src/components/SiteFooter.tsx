import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="shell footerInner">
        <Logo />
        <p>Small things, done daily. Publicly, carefully, without guilt.</p>
        <nav aria-label="Footer">
          <a href={site.instagramUrl} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={site.stravaUrl} target="_blank" rel="noreferrer">
            Strava
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
