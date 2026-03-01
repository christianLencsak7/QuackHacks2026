import { NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request) {
    try {
        const payload = await request.json();

        // --- Server-side validation: block bad data before it touches the DB ---
        if (!payload.title?.trim()) {
            return NextResponse.json({ error: 'Event title is required.' }, { status: 400 });
        }
        const startDate = payload.start_date || payload.date || null;
        if (!startDate) {
            return NextResponse.json({ error: 'start_date is required.' }, { status: 400 });
        }
        // Must be a valid YYYY-MM-DD date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate)) {
            return NextResponse.json({ error: `Invalid start_date format "${startDate}". Expected YYYY-MM-DD.` }, { status: 400 });
        }
        // ------------------------------------------------------------------------

        const supabase = await createClient();

        // Ensure user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase.from("events").insert({
            user_id: user.id,
            title: payload.title.trim(),
            start_date: startDate,
            end_date: payload.end_date || startDate,
            location: payload.location || null,
            event_type: payload.event_type || payload.type || 'Custom',
            start_time: payload.start_time || payload.time || null,
            end_time: payload.end_time || null,
        }).select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Event created successfully', event: data }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
