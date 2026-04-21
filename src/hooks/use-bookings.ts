import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

function getTodayLocalDateISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface CarBooking {
  id: string;
  dealershipId: string;
  carId: string;
  carLabel: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  source: string;
  notes: string | null;
  createdAt: string;
}

type CarBookingRow = {
  id: string;
  dealership_id: string;
  car_id: string;
  car_label: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date: string;
  source: string;
  notes: string | null;
  created_at: string;
};

function mapBooking(row: CarBookingRow): CarBooking {
  return {
    id: row.id,
    dealershipId: row.dealership_id,
    carId: row.car_id,
    carLabel: row.car_label,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    preferredDate: row.preferred_date,
    source: row.source,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function useDealershipBookings(dealershipId: string | undefined) {
  return useQuery({
    queryKey: ["dealership-bookings", dealershipId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_bookings")
        .select("*")
        .eq("dealership_id", dealershipId!)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return ((data ?? []) as CarBookingRow[]).map(mapBooking);
    },
    enabled: !!dealershipId,
  });
}

export function useCreateCarBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      booking: Omit<CarBooking, "id" | "source" | "notes" | "createdAt"> &
        Partial<Pick<CarBooking, "source" | "notes">>,
    ) => {
      if (booking.preferredDate < getTodayLocalDateISO()) {
        throw new Error("Preferred date cannot be in the past");
      }

      const { data, error } = await supabase
        .from("car_bookings")
        .insert({
          dealership_id: booking.dealershipId,
          car_id: booking.carId,
          car_label: booking.carLabel,
          customer_name: booking.customerName,
          customer_email: booking.customerEmail,
          customer_phone: booking.customerPhone,
          preferred_date: booking.preferredDate,
          source: booking.source ?? "test_drive_form",
          notes: booking.notes ?? null,
        })
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return mapBooking(data as CarBookingRow);
    },
    onSuccess: (created) => {
      qc.invalidateQueries({
        queryKey: ["dealership-bookings", created.dealershipId],
      });
    },
  });
}
