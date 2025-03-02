
import React, { useState, useEffect, use } from 'react';
import { getUserId } from "@/app/api/users/[userId]/route";
import { useParams } from 'next/navigation';

export default function SideBar() {
    const params = useParams();
    const { id } = params;
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
        console.log(user),
        <div className="flex ">
            <div className="fixed w-64 h-screen bg-gray-200">
                <div className='p-10'>
                    {user.map((user: any) => (
                        <div key={user.id}>
                            <h1 className="p-2">{user.name}</h1>
                            <p className="p-2">{user.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}