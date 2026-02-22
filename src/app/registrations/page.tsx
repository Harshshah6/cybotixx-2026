'use client';
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { initialEvents, initialRegistrations } from "@/lib/mockData";

const PAGE_SIZE = 10;

const Registrations = () => {
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data fetching
  const events = initialEvents;

  const filteredRegistrations = initialRegistrations.filter(reg => {
    const matchesSearch = !search.trim() ||
      reg.full_name.toLowerCase().includes(search.toLowerCase()) ||
      reg.email.toLowerCase().includes(search.toLowerCase()) ||
      (reg.team_name && reg.team_name.toLowerCase().includes(search.toLowerCase()));

    const matchesEvent = eventFilter === "all" || reg.event_id === eventFilter;

    return matchesSearch && matchesEvent;
  });

  const data = {
    rows: filteredRegistrations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    total: filteredRegistrations.length
  };

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">View</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Registrations</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search by name, email, team..."
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={eventFilter} onValueChange={(v) => { setEventFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-mono text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden sm:table-cell">Event</th>
                  <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th className="text-left p-3 font-mono text-xs uppercase tracking-wider hidden lg:table-cell">Members</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td colSpan={4} className="p-3"><div className="h-4 bg-muted rounded animate-pulse w-1/2" /></td>
                    </tr>
                  ))
                ) : data?.rows && data.rows.length > 0 ? (
                  data.rows.map((r: any) => (
                    <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="font-medium">{r.full_name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{r.events?.name}</div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">{r.events?.name}</td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                          {r.events?.event_type}
                        </Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {r.team_members && r.team_members.length > 0
                          ? r.team_members.sort((a: any, b: any) => a.member_order - b.member_order).map((m: any) => m.member_name).join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">No registrations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages} ({data?.total} total)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <ChevronLeft size={14} />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registrations;
