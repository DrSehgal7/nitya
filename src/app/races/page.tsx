import { permanentRedirect } from "next/navigation";

export default async function RacesPage() {
  permanentRedirect("/events");
}
