import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmvyyurqddhluungbudy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptdnl5dXJxZGRobHV1bmdidWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODMwNTksImV4cCI6MjA5NTU1OTA1OX0.R-4QU1bdxHQtT8Gbl8YaizrEuQXF9A7LWvJVWUC9toU'

export const supabase = createClient(supabaseUrl, supabaseKey)