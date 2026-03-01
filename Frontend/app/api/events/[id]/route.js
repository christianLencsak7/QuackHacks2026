import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const payload = await request.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const updates = {};
        if (payload.title !== undefined) updates.title = payload.title;
        if (payload.start_date !== undefined) updates.start_date = payload.start_date;
        if (payload.end_date !== undefined) updates.end_date = payload.end_date;
        if (payload.start_time !== undefined) updates.start_time = payload.start_time;
        if (payload.end_time !== undefined) updates.end_time = payload.end_time;
        if (payload.location !== undefined) updates.location = payload.location;
        if (payload.event_type !== undefined) updates.event_type = payload.event_type;

        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)   // ensure users can only edit their own events
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Event updated', event: data }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Event deleted' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
