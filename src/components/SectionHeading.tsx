import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  inverted?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className={inverted ? "sectionHeading sectionHeadingInverted" : "sectionHeading"}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="sectionHeadingRow">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
