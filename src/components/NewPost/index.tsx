'use client'

import NewPostIcon from "@/components/svgs/newpost"
import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { createPost } from "@/app/api/posts/route";
import { useRouter } from "next/navigation";

export default function NewPost() {
    const [ShowButton, setShowButton] = useState(true);
    const router = useRouter();

    const toggleButton = () => {
        

        setShowButton(!ShowButton);
        
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title")
        const content = formData.get("content")
        createPost(title, content);
        setShowButton(!ShowButton);
        router.push("/profile");

    }

    return (
        <div className="fixed right-20 bottom-20 size-20">
            {ShowButton && <button onClick={toggleButton}><NewPostIcon /></button>}
            {!ShowButton && <form onSubmit={handleSubmit} className="absolute right-20 bottom-0 bg-neutral-100 shadow-lg p-5 border rounded-md">
                <input type="text" name="title" placeholder="Title" className="border rounded-md p-2 m-2" />
                <textarea type="text" name="content" placeholder="Content" className="border rounded-md p-2 m-2" />
                <button className="border rounded-md p-2 m-2 bg-blue-600 text-white">Post</button>
                <button onClick={toggleButton} className="border rounded-md p-2 m-2 bg-blue-600 text-white">Cancel</button>
            </form>}
        </div>
    )
}