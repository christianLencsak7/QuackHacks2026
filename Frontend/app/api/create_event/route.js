import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
    try {
        const payload = await request.json();
        const supabase = await createClient();

        // Ensure user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase.from("events").insert({
            user_id: user.id, // Enforce server-side user ID attachment for security
            title: payload.title,
            start_date: payload.start_date || payload.date,
            end_date: payload.end_date,
            location: payload.location,
            event_type: payload.event_type || payload.type,
            start_time: payload.start_time || payload.time,
            end_time: payload.end_time
        }).select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Event created successfully", event: data }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
