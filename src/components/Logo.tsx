import Link from "next/link";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link className="brand" href="/" aria-label="Nitya home — a small daily mission">
      <span className="brandMark" aria-hidden="true">
        न
      </span>
      {!compact && (
        <span className="brandCopy">
          <strong lang="hi">नित्य</strong>
          <small>Nitya · daily</small>
        </span>
      )}
    </Link>
  );
}
