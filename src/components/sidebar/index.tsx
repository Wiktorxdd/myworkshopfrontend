import React, { useState, useEffect } from 'react';
import { getUserId } from "@/app/api/users/[userId]/route";
import { getCurrentUser } from '@/app/api/users/route';
import { useParams } from 'next/navigation';
import FollowIcon from "@/components/svgs/follow";
import SettingsIcon from "@/components/svgs/settings";

export default function SideBar() {
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
            }
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchUser = async () => {
                try {
                    if (id) {
                        const fetchedUser = await getUserId(id);
                        setUser(fetchedUser);
                    } else {
                        setUser(currentUser);
                    }
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            };
            fetchUser();
        }
    }, [id, currentUser]);

    return (
        <div className="flex">
            <div className="fixed w-64 h-screen bg-gray-200">
                <div className="p-10">
                    {user ? (
                        <div>
                            <h1>{user.name}</h1>
                            <p className="mt-2">About me!</p>
                            <p>{user.description}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    {user && currentUser && user.id !== currentUser.id && (
                        <button className="flex items-center space-x-3 mt-5 hover:text-blue-800">
                            <FollowIcon />
                            <span>Follow User</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}