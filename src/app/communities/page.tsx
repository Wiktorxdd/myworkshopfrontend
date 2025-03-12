'use client';

import { useEffect, useState } from "react"
import { getGroups } from "@/app/api/groups/route";
import React from "react";
import { formatDate } from "@/utils/date";


import Link from "next/link";

const PostItem = React.memo(({ group }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-96">
        <div className="flex justify-between">
            <p>{group.category_id}</p>
            <p className="break-word">{formatDate(group.created_at)}</p>
        </div>
        <Link className="block mt-2 text-xl font-bold" href={`/communities/${group.id}`}>
            {group.name}
        </Link>
        <p className="mt-2 text-gray-700 break-words line-clamp-2">{group.description}</p>
    </li>
));

export default function Communities() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groups = await getGroups()
                console.log(groups);
                setGroups(groups.data);
            }
            catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, []);


    return (
        <div>
            <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
                Communities
            </header>
            <div className="flex-row flex justify-center">
                <div className="min-h-screen flex flex-col">
                    <ul className="flex flex-row mt-5">
                        {groups.map((group: any) => (
                            <PostItem
                                key={group.id}
                                group={group}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}