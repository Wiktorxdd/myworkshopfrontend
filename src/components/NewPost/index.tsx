'use client'

import NewPostIcon from "@/components/svgs/newpost"
import React, { useState, useEffect, useCallback } from "react";

export default function NewPost() {
    const [ShowButton, setShowButton] = useState(true);

    const toggleButton = () => {
        setShowButton(!ShowButton);
    }
    return (
       <div className="fixed right-20 bottom-20 size-20">
            {ShowButton && <button onClick={toggleButton}><NewPostIcon /></button>}
            {!ShowButton && <div className="absolute right-20 bottom-0 bg-neutral-100 shadow-lg p-5 border rounded-md">
                <input type="text" placeholder="Title" className="border rounded-md p-2 m-2" />
                <textarea placeholder="Content" className="border rounded-md p-2 m-2" />
                <button className="border rounded-md p-2 m-2 bg-blue-600 text-white">Post</button>
                <button onClick={toggleButton} className="border rounded-md p-2 m-2 bg-blue-600 text-white">Cancel</button>
            </div>}
       </div>
    )
}