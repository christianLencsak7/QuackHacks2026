import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'User signed up', user: data.user }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
