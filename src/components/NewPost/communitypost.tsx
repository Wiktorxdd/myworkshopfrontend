'use client'

import NewPostIcon from "@/components/svgs/newpost"
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { createGroupPost } from "@/app/api/posts/route";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

export default function NewGroupPost() {
    const [ShowButton, setShowButton] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const toggleButton = () => {


        setShowButton(!ShowButton);

    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const group_id = id
        formData.append('group_id', group_id);
        createGroupPost(formData);
        setShowButton(!ShowButton);
    }

    return (
        <div className="fixed right-20 bottom-20 size-20">
            {ShowButton && <button onClick={toggleButton}><NewPostIcon /></button>}
            {!ShowButton && <form onSubmit={handleSubmit} className="absolute right-20 bottom-0 bg-neutral-100 shadow-lg p-5 border rounded-md">
                <input type="text" name="title" placeholder="Title" className="border rounded-md p-2 m-2" />
                <textarea type="text" name="content" placeholder="Content" className="border rounded-md p-2 m-2 w-full" />
                <input className="p-2 m-2" name="image" type="file"/>
                <button className="border rounded-md p-2 m-2 bg-blue-600 text-white">Post</button>
                <button onClick={toggleButton} className="border rounded-md p-2 m-2 bg-blue-600 text-white">Cancel</button>
            </form>}
        </div>
    )
}
