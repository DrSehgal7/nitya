import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="utilityMain">
      <section className="utilityCard">
        <p className="eyebrow">404</p>
        <h1>Wrong turn.</h1>
        <p>
          This page is not on the route. The mission and the next start line are still right here.
        </p>
        <Link className="button buttonPrimary" href="/">
          <ArrowLeft size={17} aria-hidden="true" /> Back home
        </Link>
      </section>
    </main>
  );
}
