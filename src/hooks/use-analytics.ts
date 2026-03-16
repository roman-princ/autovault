import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type AnalyticsEventType =
  | "impression"
  | "testDriveBooking"
  | "depositIntent";

type AnalyticsEventRow = {
  id: string;
  dealership_id: string;
  car_id: string;
  car_label: string;
  event_type: AnalyticsEventType;
  created_at: string;
};

export interface LeadEvent {
  id: string;
  type: "testDriveBooking" | "depositIntent";
  carId: string;
  carLabel: string;
  createdAt: string;
}

export interface CarAnalytics {
  impressions: number;
  testDriveBookings: number;
  depositIntents: number;
  lastInteractionAt: string | null;
}

export interface DealershipAnalytics {
  impressions: number;
  testDriveBookings: number;
  depositIntents: number;
  lastUpdatedAt: string | null;
  perCar: Record<string, CarAnalytics>;
  leadEvents: LeadEvent[];
}

function emptyAnalytics(): DealershipAnalytics {
  return {
    impressions: 0,
    testDriveBookings: 0,
    depositIntents: 0,
    lastUpdatedAt: null,
    perCar: {},
    leadEvents: [],
  };
}

export function aggregateAnalyticsEvents(
  rows: AnalyticsEventRow[],
): DealershipAnalytics {
  const result = emptyAnalytics();

  for (const row of rows) {
    if (!result.perCar[row.car_id]) {
      result.perCar[row.car_id] = {
        impressions: 0,
        testDriveBookings: 0,
        depositIntents: 0,
        lastInteractionAt: null,
      };
    }

    const perCar = result.perCar[row.car_id];
    result.lastUpdatedAt = result.lastUpdatedAt ?? row.created_at;
    perCar.lastInteractionAt = perCar.lastInteractionAt ?? row.created_at;

    if (row.event_type === "impression") {
      result.impressions += 1;
      perCar.impressions += 1;
    }

    if (row.event_type === "testDriveBooking") {
      result.testDriveBookings += 1;
      perCar.testDriveBookings += 1;
      result.leadEvents.push({
        id: row.id,
        type: "testDriveBooking",
        carId: row.car_id,
        carLabel: row.car_label,
        createdAt: row.created_at,
      });
    }

    if (row.event_type === "depositIntent") {
      result.depositIntents += 1;
      perCar.depositIntents += 1;
      result.leadEvents.push({
        id: row.id,
        type: "depositIntent",
        carId: row.car_id,
        carLabel: row.car_label,
        createdAt: row.created_at,
      });
    }
  }

  return result;
}

export function useDealershipAnalytics(dealershipId: string | undefined) {
  return useQuery({
    queryKey: ["dealership-analytics", dealershipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_analytics_events")
        .select("*")
        .eq("dealership_id", dealershipId!)
        .order("created_at", { ascending: false })
        .limit(5000);

      if (error) throw new Error(error.message);
      return aggregateAnalyticsEvents((data ?? []) as AnalyticsEventRow[]);
    },
    enabled: !!dealershipId,
  });
}

export function useClearDealershipAnalytics(dealershipId: string | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("car_analytics_events")
        .delete()
        .eq("dealership_id", dealershipId!);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["dealership-analytics", dealershipId],
      });
    },
  });
}
