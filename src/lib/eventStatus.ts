export function getEventStatus(eventDate: string | null): "upcoming" | "ongoing" | "ended" {
  if (!eventDate) return "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(eventDate + "T00:00:00");
  if (date > today) return "upcoming";
  if (date.getTime() === today.getTime()) return "ongoing";
  return "ended";
}

export function getStatusVariant(status: "upcoming" | "ongoing" | "ended") {
  switch (status) {
    case "upcoming": return "default" as const;
    case "ongoing": return "secondary" as const;
    case "ended": return "outline" as const;
  }
}
