'use client'

import { useParams, useRouter } from "next/navigation"
import { getUserId } from "@/app/api/users/[userId]/route";
import { useState, useEffect } from 'react';
import { use } from "react";

export default function ProfileID({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const [user, setUser] = useState([]);
    console.log(id);


    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserId(id);
            const user = await response.json();

            setUser(user.user);
        };
        fetchUser();
    }, [id]);

    return (
        <div>
           {user.map((user: any) => (
                    <div key={user.id}>
                        <h1 className="p-1">{user.name}</h1>
                        <p className="p-1">{user.email}</p>
                    </div>
                ))}
        </div>
    )
}