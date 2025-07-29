import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Fetching calendar data...')
    
    // Your Google Calendar iCal URL
    const calendarUrl = 'https://calendar.google.com/calendar/ical/cdnom1h6cu6b0753l110q9nh50f4sdg7%40import.calendar.google.com/public/basic.ics'
    
    // Fetch the calendar data
    const response = await fetch(calendarUrl, {
      headers: {
        'User-Agent': 'Supabase Edge Function Calendar Proxy'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const icalData = await response.text()
    
    // Validate that we got valid iCal data
    if (!icalData.includes('BEGIN:VCALENDAR')) {
      throw new Error('Invalid iCal data received')
    }
    
    console.log(`Successfully fetched calendar data (${icalData.length} characters)`)
    
    return new Response(icalData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    })
    
  } catch (error) {
    console.error('Error fetching calendar:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch calendar data',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})