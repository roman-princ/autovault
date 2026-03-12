import Navbar from "@/components/Navbar";
import { useDealershipCtx } from "@/contexts/DealershipContext";
import { MapPin, Phone, Info } from "lucide-react";

const About = () => {
  const { dealership } = useDealershipCtx();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12">
        <h1 className="font-display text-3xl font-bold">About Us</h1>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {dealership.aboutUs && (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">
                  {dealership.name}
                </h2>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {dealership.aboutUs}
              </p>
            </div>
          )}

          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">
              Contact Information
            </h2>
            <div className="mt-4 space-y-4">
              {dealership.phone ? (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href={`tel:${dealership.phone}`}
                      className="text-sm font-medium hover:text-primary">
                      {dealership.phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {dealership.address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="text-sm font-medium">{dealership.address}</p>
                  </div>
                </div>
              ) : null}

              {!dealership.phone && !dealership.address && (
                <p className="text-sm text-muted-foreground">
                  No contact information provided yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
