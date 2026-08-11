"use client";

import {
  CarFront,
  CreditCard,
  MoreHorizontal,
  RefreshCw,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

const categories = [
  { id: "food", label: "Food & eating out", icon: Utensils },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "subscriptions", label: "Subscriptions", icon: RefreshCw },
  { id: "fees", label: "Card fees", icon: CreditCard },
  { id: "transport", label: "Transport", icon: CarFront },
  { id: "other", label: "Something else", icon: MoreHorizontal },
] as const;

const suggestions: Record<(typeof categories)[number]["id"], string> = {
  food: "Plan two default meals and one guilt-free eating-out budget before the week starts.",
  shopping: "Put every non-essential purchase on a 30-day list before buying it.",
  subscriptions: "Cancel one low-use subscription and review renewals once a month.",
  fees: "Pay in full, set reminders, and ask the bank to reverse avoidable fees.",
  transport: "Bundle trips and compare the real monthly cost of each travel option.",
  other: "Name the trigger, set one simple limit, and review it after thirty days.",
};

export function SpendingAnalyzer() {
  const [category, setCategory] = useState<(typeof categories)[number]["id"]>("food");
  const [months, setMonths] = useState(["", "", ""]);
  const [analysed, setAnalysed] = useState(false);

  const numbers = useMemo(() => months.map((value) => Number(value) || 0), [months]);
  const average = numbers.reduce((total, value) => total + value, 0) / 3;
  const latest = numbers[2] ?? 0;
  const target = Math.round(latest * 0.9);
  const possibleSaving = Math.max(0, Math.round(latest - target));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysed(true);
  }

  return (
    <div className="toolCard">
      <div className="stepLabel">
        <span>1</span>
        <div>
          <strong>What do you want to optimise?</strong>
          <small>Pick one. Simple works.</small>
        </div>
      </div>
      <div className="categoryPills" role="group" aria-label="Spending category">
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={category === item.id ? "categoryPill categoryPillActive" : "categoryPill"}
              type="button"
              key={item.id}
              aria-pressed={category === item.id}
              onClick={() => {
                setCategory(item.id);
                setAnalysed(false);
              }}
            >
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={submit}>
        <div className="stepLabel secondStep">
          <span>2</span>
          <div>
            <strong>Your last three months</strong>
            <small>Rough numbers are fine. They never leave this browser.</small>
          </div>
        </div>
        <div className="monthFields">
          {months.map((value, index) => (
            <label key={index}>
              <span>
                {index === 0 ? "3 months ago" : index === 1 ? "2 months ago" : "Last month"}
              </span>
              <div className="currencyInput">
                <span aria-hidden="true">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="100"
                  value={value}
                  aria-label={`${index === 0 ? "Three" : index === 1 ? "Two" : "One"} months ago in rupees`}
                  onChange={(event) => {
                    const nextMonths = [...months];
                    nextMonths[index] = event.target.value;
                    setMonths(nextMonths);
                    setAnalysed(false);
                  }}
                  required
                />
              </div>
            </label>
          ))}
        </div>
        <button className="button buttonPrimary" type="submit">
          Analyse my spending
        </button>
      </form>

      {analysed && (
        <div className="analysisResult" aria-live="polite">
          <div>
            <span>Three-month average</span>
            <strong>₹{Math.round(average).toLocaleString("en-IN")}</strong>
          </div>
          <div>
            <span>A gentle 10% next step</span>
            <strong>₹{possibleSaving.toLocaleString("en-IN")} less</strong>
          </div>
          <p>{suggestions[category]}</p>
        </div>
      )}
    </div>
  );
}
