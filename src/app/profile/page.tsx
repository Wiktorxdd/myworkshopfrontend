'use client'

import Link from "next/link";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { usersGet } from "../api/users/route";


export default function Profile() {
    const router = useRouter();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await usersGet();
                const users = await response.json();
                setUsers(users.userdata);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchUsers();
    }, []);

    console.log(router);
    return (
        <div>
            <h1>List of Profiles</h1>
            <div>
                <ul className="p-10">
                    {users.map((user) => (
                        <li key={user.id}>
                            <Link href={`/profile/${user.id}`}>
                                {user.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

