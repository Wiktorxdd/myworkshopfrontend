
import React, { useState, useEffect, use } from 'react';
import { getUserId } from "@/app/api/users/[userId]/route";
import { useParams } from 'next/navigation';
import LikeIcon from "@/components/svgs/like";
import FollowIcon from "@/components/svgs/follow";

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
                            <h1>{user.name}</h1>
                            <p className='mt-2'>About me!</p>
                            <p className="">{user.description}</p>
                        </div>

                    ))}
                    <button className="flex items-center space-x-3 mt-5 hover:text-blue-800">
                        <FollowIcon />
                        <span className=''>Follow User</span>
                    </button>
                </div>
            </div>
        </div>
    )
}