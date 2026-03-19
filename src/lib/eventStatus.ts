export function getEventStatus(eventDate: Date | string | null): "upcoming" | "ongoing" | "ended" {
  if (!eventDate) return "upcoming";
  const now = new Date();

  const date = typeof eventDate === "string"
    ? new Date(eventDate.includes("T") ? eventDate : eventDate + "T00:00:00")
    : new Date(eventDate);

  if (now < date) {
    return "upcoming";
  }

  const isSameDay = now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  if (isSameDay) {
    return "ongoing";
  }

  return "ended";
}

export function getStatusVariant(status: "upcoming" | "ongoing" | "ended") {
  switch (status) {
    case "upcoming": return "default" as const;
    case "ongoing": return "secondary" as const;
    case "ended": return "outline" as const;
  }
}
