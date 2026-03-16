import { supabase } from "@/lib/supabase";
import type { AnalyticsEventType } from "@/hooks/use-analytics";

export async function trackAnalyticsEvent(
  dealershipId: string,
  carId: string,
  eventType: AnalyticsEventType,
  carLabel: string,
) {
  const { error } = await supabase.from("car_analytics_events").insert({
    dealership_id: dealershipId,
    car_id: carId,
    car_label: carLabel,
    event_type: eventType,
  });

  if (error) {
    // Analytics should not break the UX flow, so just log and continue.
    console.error("Failed to track analytics event", error);
  }
}
