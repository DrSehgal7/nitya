import { ArrowUpRight, MapPin } from "lucide-react";
import type { Race } from "@/data/races";

interface RaceCardProps {
  race: Race;
  number: number;
  featured?: boolean;
}

export function RaceCard({ race, number, featured = false }: RaceCardProps) {
  const date = new Date(`${race.date}T12:00:00+05:30`);
  const month = new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date);
  const day = new Intl.DateTimeFormat("en-IN", { day: "2-digit" }).format(date);
  const fullDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <article className={featured ? "raceCard raceCardFeatured" : "raceCard"}>
      <div className="raceDate" aria-hidden="true">
        <span>{month}</span>
        <strong>{day}</strong>
      </div>
      <div className="raceContent">
        <div className="raceMeta">
          <span>Race {number.toString().padStart(2, "0")}</span>
          <span>{race.registrationStatus}</span>
        </div>
        <h2>{race.name}</h2>
        <div className="raceLocation">
          <MapPin size={15} aria-hidden="true" />
          {race.location} · {race.distanceKm.toLocaleString("en-IN", { maximumFractionDigits: 3 })}{" "}
          km
        </div>
        <p>{race.note}</p>
        <a href={race.officialUrl} target="_blank" rel="noreferrer">
          {fullDate}
          <ArrowUpRight size={15} aria-hidden="true" />
          <span className="srOnly">— open official race page</span>
        </a>
      </div>
    </article>
  );
}
