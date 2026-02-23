export function getEventStatus(eventDate: Date | string | null): "upcoming" | "ongoing" | "ended" {
  if (!eventDate) return "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = typeof eventDate === "string"
    ? new Date(eventDate.includes("T") ? eventDate : eventDate + "T00:00:00")
    : new Date(eventDate);

  date.setHours(0, 0, 0, 0);

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
