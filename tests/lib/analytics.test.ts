import { describe, expect, it } from "vitest";
import { aggregateAnalyticsEvents } from "@/hooks/use-analytics";

describe("analytics aggregation", () => {
  it("aggregates dealership totals and per-car metrics", () => {
    const analytics = aggregateAnalyticsEvents([
      {
        id: "1",
        dealership_id: "d1",
        car_id: "car-1",
        car_label: "Audi A4",
        event_type: "impression",
        created_at: "2026-03-16T10:00:00.000Z",
      },
      {
        id: "2",
        dealership_id: "d1",
        car_id: "car-1",
        car_label: "Audi A4",
        event_type: "testDriveBooking",
        created_at: "2026-03-16T10:05:00.000Z",
      },
      {
        id: "3",
        dealership_id: "d1",
        car_id: "car-2",
        car_label: "BMW X5",
        event_type: "depositIntent",
        created_at: "2026-03-16T10:10:00.000Z",
      },
    ]);

    expect(analytics.impressions).toBe(1);
    expect(analytics.testDriveBookings).toBe(1);
    expect(analytics.depositIntents).toBe(1);
    expect(analytics.perCar["car-1"].impressions).toBe(1);
    expect(analytics.perCar["car-1"].testDriveBookings).toBe(1);
    expect(analytics.perCar["car-2"].depositIntents).toBe(1);
    expect(analytics.leadEvents).toHaveLength(2);
    expect(analytics.lastUpdatedAt).toBe("2026-03-16T10:00:00.000Z");
  });

  it("returns empty analytics for no events", () => {
    const analytics = aggregateAnalyticsEvents([]);

    expect(analytics.impressions).toBe(0);
    expect(analytics.testDriveBookings).toBe(0);
    expect(analytics.depositIntents).toBe(0);
    expect(analytics.lastUpdatedAt).toBeNull();
    expect(Object.keys(analytics.perCar)).toHaveLength(0);
    expect(analytics.leadEvents).toHaveLength(0);
  });
});
