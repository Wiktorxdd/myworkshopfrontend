import { NextResponse} from 'next/server'
import userdata from '@/userdata.json';

export async function getUserId(id: any) {
    const user = userdata.filter(x => id === x.id.toString());

    return NextResponse.json({
        user
    });
}
