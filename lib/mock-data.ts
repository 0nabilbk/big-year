// Mock calendar and event data for development without Google OAuth

export const mockCalendars = [
  {
    id: "mock|primary",
    summary: "My Calendar",
    primary: true,
    backgroundColor: "#039be5",
    accountEmail: "demo@example.com",
    accessRole: "owner" as const,
  },
  {
    id: "mock|work",
    summary: "Work",
    backgroundColor: "#0b8043",
    accountEmail: "demo@example.com",
    accessRole: "owner" as const,
  },
  {
    id: "mock|personal",
    summary: "Personal",
    backgroundColor: "#d50000",
    accountEmail: "demo@example.com",
    accessRole: "writer" as const,
  },
];

export const mockAccounts = [
  {
    accountId: "mock",
    email: "demo@example.com",
  },
];

// Generate some sample events for the current year and adjacent years
function generateMockEvents(year: number) {
  const events: Array<{
    id: string;
    calendarId: string;
    summary: string;
    startDate: string;
    endDate: string;
  }> = [];

  const holidays = [
    { month: 0, day: 1, title: "New Year's Day", calendarId: "mock|primary" },
    { month: 1, day: 14, title: "Valentine's Day", calendarId: "mock|personal" },
    { month: 2, day: 17, title: "St. Patrick's Day", calendarId: "mock|personal" },
    { month: 3, day: 22, title: "Earth Day", calendarId: "mock|work" },
    { month: 4, day: 5, title: "Cinco de Mayo", calendarId: "mock|personal" },
    { month: 6, day: 4, title: "Independence Day", calendarId: "mock|primary" },
    { month: 9, day: 31, title: "Halloween", calendarId: "mock|personal" },
    { month: 10, day: 28, title: "Thanksgiving", calendarId: "mock|primary" },
    { month: 11, day: 25, title: "Christmas", calendarId: "mock|primary" },
    { month: 11, day: 31, title: "New Year's Eve", calendarId: "mock|personal" },
  ];

  // Add holidays
  holidays.forEach((holiday, idx) => {
    const startDate = new Date(Date.UTC(year, holiday.month, holiday.day));
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    events.push({
      id: `${holiday.calendarId}:holiday_${idx}`,
      calendarId: holiday.calendarId,
      summary: holiday.title,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  });

  // Add some work events
  const workEvents = [
    { month: 0, day: 15, title: "Q1 Planning", duration: 2, calendarId: "mock|work" },
    { month: 2, day: 10, title: "Team Offsite", duration: 3, calendarId: "mock|work" },
    { month: 3, day: 20, title: "Q2 Planning", duration: 2, calendarId: "mock|work" },
    { month: 5, day: 5, title: "Conference", duration: 4, calendarId: "mock|work" },
    { month: 6, day: 15, title: "Q3 Planning", duration: 2, calendarId: "mock|work" },
    { month: 8, day: 25, title: "All Hands", duration: 1, calendarId: "mock|work" },
    { month: 9, day: 10, title: "Q4 Planning", duration: 2, calendarId: "mock|work" },
  ];

  workEvents.forEach((event, idx) => {
    const startDate = new Date(Date.UTC(year, event.month, event.day));
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + event.duration);

    events.push({
      id: `${event.calendarId}:work_${idx}`,
      calendarId: event.calendarId,
      summary: event.title,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  });

  // Add some personal events
  const personalEvents = [
    { month: 2, day: 1, title: "Vacation", duration: 7, calendarId: "mock|personal" },
    { month: 5, day: 20, title: "Birthday Party", duration: 1, calendarId: "mock|personal" },
    { month: 7, day: 10, title: "Summer Trip", duration: 10, calendarId: "mock|personal" },
    { month: 10, day: 1, title: "Family Visit", duration: 5, calendarId: "mock|personal" },
  ];

  personalEvents.forEach((event, idx) => {
    const startDate = new Date(Date.UTC(year, event.month, event.day));
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + event.duration);

    events.push({
      id: `${event.calendarId}:personal_${idx}`,
      calendarId: event.calendarId,
      summary: event.title,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  });

  return events;
}

// Cache for generated events by year
const eventCache = new Map<number, ReturnType<typeof generateMockEvents>>();

export function getMockEvents(year: number) {
  if (!eventCache.has(year)) {
    eventCache.set(year, generateMockEvents(year));
  }
  return eventCache.get(year)!;
}

// In-memory storage for created/updated events
const customEvents = new Map<string, {
  id: string;
  calendarId: string;
  summary: string;
  startDate: string;
  endDate?: string;
}>();

export function getAllMockEvents(year: number, calendarIds?: string[]) {
  const baseEvents = getMockEvents(year);
  const custom = Array.from(customEvents.values()).filter((e) => {
    const eventYear = parseInt(e.startDate.split("-")[0]);
    return eventYear === year;
  });

  let allEvents = [...baseEvents, ...custom];

  if (calendarIds && calendarIds.length > 0) {
    allEvents = allEvents.filter((e) => calendarIds.includes(e.calendarId));
  }

  return allEvents;
}

export function createMockEvent(data: {
  title: string;
  calendarId: string;
  startDate: string;
  endDate?: string;
}) {
  const id = `${data.calendarId}:custom_${Date.now()}`;
  const event = {
    id,
    calendarId: data.calendarId,
    summary: data.title,
    startDate: data.startDate,
    endDate: data.endDate || data.startDate,
  };
  customEvents.set(id, event);
  return event;
}

export function updateMockEvent(
  id: string,
  data: {
    title?: string;
    calendarId?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  const existing = customEvents.get(id);
  if (existing) {
    const updated = {
      ...existing,
      summary: data.title ?? existing.summary,
      calendarId: data.calendarId ?? existing.calendarId,
      startDate: data.startDate ?? existing.startDate,
      endDate: data.endDate ?? existing.endDate,
    };
    customEvents.set(id, updated);
    return updated;
  }
  return null;
}

export function deleteMockEvent(id: string) {
  return customEvents.delete(id);
}
