"use client";

import { useMemo, useState } from "react";

interface SponsorCalculatorProps {
  initialDistance?: number;
}

export function SponsorCalculator({ initialDistance = 0 }: SponsorCalculatorProps) {
  const [distance, setDistance] = useState(String(initialDistance));
  const [perKm, setPerKm] = useState("0");
  const total = useMemo(
    () => Math.max(0, (Number(distance) || 0) * (Number(perKm) || 0)),
    [distance, perKm],
  );

  return (
    <div className="sponsorCalculator">
      <div className="sponsorFields">
        <label>
          <span>Distance</span>
          <div className="suffixInput">
            <input
              type="number"
              min="0"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
            />
            <span>km</span>
          </div>
        </label>
        <label>
          <span>Amount per km</span>
          <div className="prefixInput">
            <span>₹</span>
            <input
              type="number"
              min="0"
              value={perKm}
              onChange={(event) => setPerKm(event.target.value)}
            />
          </div>
        </label>
        <div className="calculatedTotal" aria-live="polite">
          <span>Total</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>
      </div>
      <a className="button buttonPrimary buttonWide" href="#contact">
        Talk to me about ₹{total.toLocaleString("en-IN")}
      </a>
      <p>Nothing is charged here. This is a transparent planning tool, not a payment form.</p>
    </div>
  );
}
