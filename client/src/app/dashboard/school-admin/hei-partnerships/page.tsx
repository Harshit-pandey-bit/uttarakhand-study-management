"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/lib/services/api";
import type { AnnouncementDto } from "@/lib/services/api";

export default function HEIPartnershipsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        setLoading(true);
        // Fetch HEI partnership announcements using the new API method
        const data = await apiService.getHEIPartnershipAnnouncements(10, 0);
        setAnnouncements(data);
        setError(null);
      } catch (error: any) {
        console.error("Failed to fetch HEI partnership announcements", error);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div>Loading HEI partnership announcements...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">HEI Partnership Announcements</h1>

      <div className="space-y-4">
        {announcements.length === 0 && <p>No announcements found.</p>}
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-4 border rounded shadow">
            <h2 className="font-semibold">{announcement.title}</h2>
            <p>{announcement.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(announcement.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
