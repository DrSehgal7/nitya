import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Coffee } from "lucide-react";

export const metadata: Metadata = { title: "Thank you" };

export default function ThanksPage() {
  return (
    <main id="main-content" className="utilityMain">
      <section className="utilityCard">
        <Coffee size={28} strokeWidth={1.7} aria-hidden="true" />
        <p className="eyebrow">Note received</p>
        <h1>Thank you.</h1>
        <p>Your message is on its way to Hritik. Expect a human reply, not an automated funnel.</p>
        <Link className="button buttonPrimary" href="/">
          <ArrowLeft size={17} aria-hidden="true" /> Back to Nitya
        </Link>
      </section>
    </main>
  );
}
