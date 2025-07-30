import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  const version = "v2.1-home-only";

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    console.log(`Calendar Proxy ${version} - Fetching calendar data...`);

    const calendarUrl =
      "https://calendar.google.com/calendar/ical/cdnom1h6cu6b0753l110q9nh50f4sdg7%40import.calendar.google.com/public/basic.ics";

    const response = await fetch(calendarUrl, {
      headers: {
        "User-Agent": "Supabase Edge Function Calendar Proxy",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const icalData = await response.text();

    if (!icalData.includes("BEGIN:VCALENDAR")) {
      throw new Error("Invalid iCal data received");
    }

    console.log(`Fetched ${icalData.length} characters`);

    // Filter only events that are home games (SUMMARY starts with "KSC Wiedikon")
    const events = icalData.split("BEGIN:VEVENT").slice(1); // first part is VCALENDAR header
    const filteredEvents = events
      .map((event) => "BEGIN:VEVENT" + event)
      .filter((event) => {
        const summaryMatch = event.match(/SUMMARY:(.+)/);
        return summaryMatch && summaryMatch[1].startsWith("KSC Wiedikon");
      });

    console.log(`Filtered down to ${filteredEvents.length} home games`);

    // Rebuild the .ics file
    const header = icalData.split("BEGIN:VEVENT")[0].trim(); // includes VCALENDAR, headers
    const footer = "END:VCALENDAR";
    const filteredIcs = [header, ...filteredEvents, footer].join("\r\n");

    return new Response(filteredIcs, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "X-Function-Version": version,
      },
    });
  } catch (error) {
    console.error(`Calendar Proxy ${version} - Error:`, error.message);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch calendar data",
        details: error.message,
        version: version,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Function-Version": version,
        },
      }
    );
  }
});
