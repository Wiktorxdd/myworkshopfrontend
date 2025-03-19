import React, { useState, useEffect } from 'react';
import { getUserId, getFollowAmount, followUser, followsUser } from "@/app/api/users/[userId]/route";
import { getCurrentUser } from '@/app/api/users/route';
import { useParams } from 'next/navigation';
import FollowIcon from "@/components/svgs/follow";
import UnFollowIcon from "@/components/svgs/unfollow"
import SettingsIcon from "@/components/svgs/settings";
import Image from 'next/image';

export default function SideBar() {
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [amountFollows, setAmountFollows] = useState(null);
    const [followsUserCheck, setFollowUser] = useState();
    const [image, setImage] = useState(null);

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

                        if (fetchedUser.image.base64_data) {
                            const base64String = fetchedUser.image.base64_data;
                            setImage(base64String);
                        }

                        const followAmount = await getFollowAmount(fetchedUser.id)
                        setAmountFollows(followAmount);
                        const followsUserCheck = await followsUser(fetchedUser.id)
                        setFollowUser(followsUserCheck);
                    } else {
                        setUser(currentUser);

                        if (currentUser.image.base64_data) {
                            const base64String = currentUser.image.base64_data;
                            setImage(base64String);
                        }
                        const followAmount = await getFollowAmount(currentUser.id)
                        setAmountFollows(followAmount);
                    }

                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            };
            fetchUser();
        }
    }, [id, currentUser]);

    const handleFollowClick = async (id) => {
        await followUser(id)
        const followAmount = await getFollowAmount(user.id)
        setAmountFollows(followAmount);
        const followsUserCheck = await followsUser(user.id)
        setFollowUser(followsUserCheck);
    }
    const dataUrl = `data:image/jpeg;base64,${image}`;

    return (
        <div className="flex">
            <div className="fixed w-64 h-screen bg-gray-200">
                {image && <Image src={dataUrl} alt="image" width={270} height={100} quality={100} />}
                <div className="p-10">
                    {user ? (
                        <div>
                            <h1>{user.name}</h1>
                            <p className="mt-2 break-words">About me!</p>
                            <p className=''>{user.about_me}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    {user && currentUser && user.id !== currentUser.id && !followsUserCheck && (
                        <button className="flex items-center space-x-3 mt-5 hover:text-blue-800" onClick={() => handleFollowClick(user.id)}>
                            <FollowIcon />
                            <span>Follow User</span>
                        </button>
                    )}
                    {user && currentUser && user.id !== currentUser.id && followsUserCheck && (
                        <button className="flex items-center space-x-3 mt-5 hover:text-blue-800" onClick={() => handleFollowClick(user.id)}>
                            <UnFollowIcon />
                            <span>Unfollow User</span>
                        </button>
                    )}
                    <div>
                        <p>Followers: {amountFollows || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}