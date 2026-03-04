import { formatDate } from "./lib/utils/date";

describe("formatDate", () => {
  it("formats a date correctly", () => {
    const date = new Date("2026-03-05T00:00:00Z");
    expect(formatDate(date)).toBe("Mar 5, 2026");
  });
});
