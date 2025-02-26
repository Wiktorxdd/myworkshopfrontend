import { NextResponse} from 'next/server'
import userdata from '@/userdata.json';

export async function usersGet() {
    return NextResponse.json({
        userdata
    });
}
