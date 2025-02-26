'use client'

import { useParams } from "next/navigation"

export default function ProfileIDPostID() {
    const params = useParams();
    console.log(params.id);
    console.log(params.postId);
    return (
        <div>Hello post id</div>
    )
}