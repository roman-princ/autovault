import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCar } from "@/hooks/use-cars";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import Navbar from "@/components/Navbar";
import { ArrowLeft, FileDown, Loader2 } from "lucide-react";

interface BuyerInfo {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  paymentMethod: "cash" | "bank_transfer" | "financing";
  saleDate: string;
  agreedPrice: string;
  deposit: string;
  salesTax: string;
  notes: string;
}

const defaultBuyer: BuyerInfo = {
  firstName: "",
  lastName: "",
  idNumber: "",
  dateOfBirth: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
  email: "",
  paymentMethod: "bank_transfer",
  saleDate: new Date().toISOString().slice(0, 10),
  agreedPrice: "",
  deposit: "",
  salesTax: "0",
  notes: "",
};

const paymentLabels: Record<BuyerInfo["paymentMethod"], string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  financing: "Financing / Loan",
};

const SalesContract = () => {
  const { id } = useParams();
  const { slug, dealership } = useDealershipCtx();
  const { data: car, isLoading } = useCar(id);
  const [buyer, setBuyer] = useState<BuyerInfo>(defaultBuyer);

  const set = (field: keyof BuyerInfo) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setBuyer((b) => ({ ...b, [field]: e.target.value }));

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Vehicle not found</p>
          <Link to={`/d/${slug}`} className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const basePrice = Number(buyer.agreedPrice) || car.price;
  const salesTaxRate = Number(buyer.salesTax) || 0;
  const salesTaxAmount = basePrice * (salesTaxRate / 100);
  const totalPrice = basePrice + salesTaxAmount;
  const depositAmount = Number(buyer.deposit) || 0;
  const remainingBalance = Math.max(totalPrice - depositAmount, 0);

  const contractDate = buyer.saleDate
    ? new Date(buyer.saleDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "_______________";

  return (
    <div className="min-h-screen bg-background">
      {/* Screen-only elements */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="container max-w-5xl py-8 print:py-0 print:max-w-none print:container-none">
        {/* Header bar — screen only */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            to={`/d/${slug}/car/${id}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to listing
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <FileDown className="h-4 w-4" /> Export as PDF
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* ── Buyer info form — screen only ──────────────────────────── */}
          <div className="print:hidden">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Buyer Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="First Name *" value={buyer.firstName} onChange={set("firstName")} />
                <Field label="Last Name *" value={buyer.lastName} onChange={set("lastName")} />
                <Field label="ID / Passport Number *" value={buyer.idNumber} onChange={set("idNumber")} />
                <Field label="Date of Birth" type="date" value={buyer.dateOfBirth} onChange={set("dateOfBirth")} />
                <Field label="Phone" value={buyer.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
                <Field label="Email" type="email" value={buyer.email} onChange={set("email")} placeholder="buyer@example.com" />
                <div className="sm:col-span-2">
                  <Field label="Street Address" value={buyer.address} onChange={set("address")} />
                </div>
                <Field label="City" value={buyer.city} onChange={set("city")} />
                <Field label="Postal Code" value={buyer.postalCode} onChange={set("postalCode")} />
                <div className="sm:col-span-2">
                  <Field label="Country" value={buyer.country} onChange={set("country")} />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Sale Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Sale Date" type="date" value={buyer.saleDate} onChange={set("saleDate")} />
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <select
                    value={buyer.paymentMethod}
                    onChange={set("paymentMethod")}
                    className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="financing">Financing / Loan</option>
                  </select>
                </div>
                <Field
                  label="Agreed Sale Price (€)"
                  type="number"
                  value={buyer.agreedPrice}
                  onChange={set("agreedPrice")}
                  placeholder={String(car.price)}
                />
                <Field
                  label="Deposit Paid (€)"
                  type="number"
                  value={buyer.deposit}
                  onChange={set("deposit")}
                  placeholder="0"
                />
                <Field
                  label="Sales Tax (%)"
                  type="number"
                  value={buyer.salesTax}
                  onChange={set("salesTax")}
                  placeholder="0"
                />
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <textarea
                    rows={3}
                    value={buyer.notes}
                    onChange={set("notes")}
                    placeholder="Warranty terms, included accessories, conditions…"
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <FileDown className="h-4 w-4" /> Export as PDF
            </button>
          </div>

          {/* ── Contract document ──────────────────────────────────────── */}
          <div id="sales-contract" className="print:w-full">
            <div className="rounded-lg border bg-white p-8 text-sm text-gray-800 shadow-sm print:shadow-none print:border-none print:p-0 print:rounded-none">
              {/* Title */}
              <div className="border-b-2 border-gray-900 pb-4 text-center">
                <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-gray-900">
                  Vehicle Sales Contract
                </h1>
                <p className="mt-1 text-xs text-gray-500">Contract No. {id?.slice(0, 8).toUpperCase()}</p>
              </div>

              {/* Parties */}
              <section className="mt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  I. Parties
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded border border-gray-200 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Seller</p>
                    <p className="font-semibold">{dealership.name}</p>
                    {dealership.address && <p className="mt-0.5 text-gray-600">{dealership.address}</p>}
                    {dealership.phone && <p className="mt-0.5 text-gray-600">{dealership.phone}</p>}
                  </div>
                  <div className="rounded border border-gray-200 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Buyer</p>
                    <p className="font-semibold">
                      {buyer.firstName || buyer.lastName
                        ? `${buyer.firstName} ${buyer.lastName}`.trim()
                        : "___________________________"}
                    </p>
                    {buyer.idNumber && <p className="mt-0.5 text-gray-600">ID / Passport: {buyer.idNumber}</p>}
                    {buyer.dateOfBirth && (
                      <p className="mt-0.5 text-gray-600">
                        DOB:{" "}
                        {new Date(buyer.dateOfBirth).toLocaleDateString("en-GB")}
                      </p>
                    )}
                    {(buyer.address || buyer.city) && (
                      <p className="mt-0.5 text-gray-600">
                        {[buyer.address, buyer.city, buyer.postalCode, buyer.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {buyer.phone && <p className="mt-0.5 text-gray-600">{buyer.phone}</p>}
                    {buyer.email && <p className="mt-0.5 text-gray-600">{buyer.email}</p>}
                  </div>
                </div>
              </section>

              {/* Vehicle */}
              <section className="mt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  II. Vehicle Description
                </h2>
                <div className="rounded border border-gray-200 p-3">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Make & Model", `${car.brand} ${car.model}`],
                        ["Year", String(car.year)],
                        ["Colour", car.color || "—"],
                        ["Condition", car.condition],
                        ["Fuel Type", car.fuel],
                        ["Transmission", car.transmission],
                        ["Power", `${car.power} HP`],
                        ["Mileage", `${car.mileage.toLocaleString()} km`],
                        ["Vehicle ID", id?.toUpperCase() ?? "—"],
                      ].map(([label, value]) => (
                        <tr key={label} className="border-b border-gray-100 last:border-0">
                          <td className="py-1.5 pr-4 font-medium text-gray-500 w-36">{label}</td>
                          <td className="py-1.5 font-semibold text-gray-900">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Price & Payment */}
              <section className="mt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  III. Price &amp; Payment
                </h2>
                <div className="rounded border border-gray-200 p-3">
                  <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                    <span className="text-gray-500">Agreed Sale Price</span>
                    <span className="font-semibold text-gray-900">€{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                    <span className="text-gray-500">Sales Tax ({salesTaxRate}%)</span>
                    <span className="font-semibold">€{salesTaxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                    <span className="text-gray-500">Total Price (incl. tax)</span>
                    <span className="text-lg font-bold text-gray-900">€{totalPrice.toLocaleString()}</span>
                  </div>
                  {buyer.deposit && (
                    <div className="flex items-center justify-between border-b border-gray-100 py-1.5">
                      <span className="text-gray-500">Deposit Paid</span>
                      <span className="font-semibold">€{depositAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {buyer.deposit && (
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-gray-500">Remaining Balance</span>
                      <span className="font-semibold">€{remainingBalance.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="mt-2 border-t border-gray-100 pt-2">
                    <span className="text-gray-500">Payment Method: </span>
                    <span className="font-semibold">{paymentLabels[buyer.paymentMethod]}</span>
                  </div>
                </div>
              </section>

              {/* Features / Notes */}
              {(car.features.length > 0 || buyer.notes) && (
                <section className="mt-6">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    IV. Included Equipment &amp; Notes
                  </h2>
                  <div className="rounded border border-gray-200 p-3 text-sm text-gray-700">
                    {car.features.length > 0 && (
                      <p>{car.features.join(" · ")}</p>
                    )}
                    {buyer.notes && (
                      <p className={car.features.length > 0 ? "mt-2 border-t border-gray-100 pt-2" : ""}>
                        {buyer.notes}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Declaration */}
              <section className="mt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  V. Declaration
                </h2>
                <p className="text-xs leading-relaxed text-gray-600">
                  Both parties confirm that the sale described in this contract is made in good faith.
                  The seller guarantees that the vehicle is free of any undisclosed encumbrances and is
                  fit for road use at the time of handover. The buyer acknowledges having inspected the
                  vehicle prior to purchase and accepts it in its current condition unless otherwise
                  stated above. This contract is binding upon signature by both parties.
                </p>
              </section>

              {/* Signatures */}
              <section className="mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs text-gray-500">Seller signature &amp; date</p>
                    <div className="mt-6 border-b border-gray-400" />
                    <p className="mt-1 text-xs text-gray-400">{dealership.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Buyer signature &amp; date</p>
                    <div className="mt-6 border-b border-gray-400" />
                    <p className="mt-1 text-xs text-gray-400">
                      {buyer.firstName || buyer.lastName
                        ? `${buyer.firstName} ${buyer.lastName}`.trim()
                        : "Buyer"}
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-center text-xs text-gray-400">
                  Signed on {contractDate}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper component for form fields
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
);

export default SalesContract;
