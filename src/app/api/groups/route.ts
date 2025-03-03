import { NextResponse } from 'next/server';
import communitydata from '@/communitydata.json';

export async function getGroups() {
    return NextResponse.json({
        communitydata
    });
}