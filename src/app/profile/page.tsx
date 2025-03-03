'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { usersGet, getCurrentUser } from "../api/users/route";
import SideBar from "@/components/sidebar";

export default function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchCurrentUser = async () => {
            try {
                const fetchedUser = await getCurrentUser();
                setUser(fetchedUser);
            } catch (error) {
                console.error("Failed to fetch current user:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    return (
        <main>
            <div className="flex flex-col items-center justify-center">
                {user ? (
                    <div>
                        <h1>{user.name}</h1>
                        <p className="mt-2">About me!</p>
                        <p>{user.description}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </main>
    );
}