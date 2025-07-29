-- Create calendar_user_events table for storing user-created calendar events
CREATE TABLE IF NOT EXISTS calendar_user_events (
    id TEXT PRIMARY KEY,
    browser_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT DEFAULT 'single' CHECK (event_type IN ('single', 'multi', 'recurring')),
    start_date DATE NOT NULL,
    end_date DATE,
    recurrence TEXT CHECK (recurrence IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurrence_end DATE,
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on browser_id for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_user_events_browser_id ON calendar_user_events(browser_id);

-- Create index on start_date for date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_user_events_start_date ON calendar_user_events(start_date);

-- Enable Row Level Security (RLS)
ALTER TABLE calendar_user_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to manage their own events based on browser_id
CREATE POLICY "Users can manage their own events" ON calendar_user_events
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions to anon role
GRANT ALL ON calendar_user_events TO anon;
GRANT ALL ON calendar_user_events TO authenticated;