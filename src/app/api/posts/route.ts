import { NextResponse} from 'next/server'
import data from '@/data.json';

export async function getPosts() {
    return NextResponse.json({
        data
    });
}


export async function getPost(id: any) {
    const post = data.filter(x => id === x.id.toString());

    return NextResponse.json({
        post
    });
}

export async function getUserPosts(id: any) {
    const posts = data.filter(x => id === x.userId.toString());

    return NextResponse.json({
        posts
    });
}