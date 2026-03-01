import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        const supabase = await createClient();

        // Enforce fetching only events for the currently logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase.from("events")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Map backend schema back to frontend expected structure
        const mappedEvents = data.map(evt => ({
            id: evt.id,
            title: evt.title,
            date: evt.start_date ? parseInt(evt.start_date.split('-')[2], 10) : null, // Frontend uses int date currently
            start_date: evt.start_date,
            time: evt.start_time,
            type: evt.event_type,
            fullData: {}
        }));

        return NextResponse.json(mappedEvents, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
