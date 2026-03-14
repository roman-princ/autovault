import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePublicDealerships } from "@/hooks/use-dealership";
import { Car, ArrowRight, Loader2, Store, Search } from "lucide-react";

const DiscoverDealerships = () => {
  const { data: dealerships = [], isLoading } = usePublicDealerships();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealerships;
    return dealerships.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q),
    );
  }, [dealerships, query]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-bold">
            <Car className="h-6 w-6 text-primary" />
            <span>AutoVault</span>
          </Link>
          <Link
            to="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary">
            Back to Landing
          </Link>
        </div>
      </nav>

      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-14">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Discover Dealerships
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse public storefronts created on AutoVault and jump straight
            into their available inventory.
          </p>

          <div className="mt-6 flex max-w-xl items-center gap-2 rounded-lg border bg-card p-2">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by dealership name, slug, or location"
              className="h-10 flex-1 bg-transparent px-2 text-sm outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border bg-card p-10 text-center">
              <p className="text-lg font-semibold">No dealerships found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or check back later.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <Link
                  key={d.id}
                  to={`/d/${d.slug}`}
                  className="group rounded-lg border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    {d.logoUrl ? (
                      <img
                        src={d.logoUrl}
                        alt={d.name}
                        className="h-11 w-11 rounded-md border bg-background object-contain"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight">
                        {d.name}
                      </p>
                      <p className="text-xs text-muted-foreground">/{d.slug}</p>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                    {d.heroSubtitle || "Visit this dealership storefront."}
                  </p>

                  {(d.address || d.phone) && (
                    <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                      {d.address && <p>{d.address}</p>}
                      {d.phone && <p>{d.phone}</p>}
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">
                    Open storefront
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DiscoverDealerships;
