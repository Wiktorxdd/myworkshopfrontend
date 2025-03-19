'use client';

import { useEffect, useState } from "react"
import { getGroups, getGroupMembers } from "@/app/api/groups/route";
import React from "react";
import { formatDate } from "@/utils/date";
import CommunityIcon from "@/components/svgs/community";
import CreateGroupicon from "@/components/svgs/creategroup"


import Link from "next/link";
import { getCategoryById } from "../api/categories/route";

const PostItem = React.memo(({ group, category }) => (
    <li className="border bg-neutral-100 shadow-lg rounded-md p-5 m-5 w-96">
        <div className="flex justify-between">
            <p>{category}</p>
            <p className="break-word">{formatDate(group.created_at)}</p>
        </div>
        <Link className="block mt-2 text-xl font-bold w-1/2" href={`/communities/${group.id}`}>
            {group.name}
        </Link>
        <div className="flex space-x-20">
            <p className="mt-2 text-gray-700 break-words line-clamp-2">{group.description}</p>
        </div>
    </li>
));

export default function Communities() {
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [catMap, setCatMap] = useState({});

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groups = await getGroups(currentPage)
                setGroups(groups.data);
                setLastPage(groups.last_page)

                const catIds = [...new Set(groups.data.map(group => group.category_id))];
                const groupPromises = catIds.map(id =>
                    getCategoryById(id).catch(error => {
                        console.error(`Failed to fetch user ${id}:`, error);
                        return null;
                    })
                );
                const categories = await Promise.all(groupPromises);
                const map = {};
                categories.forEach(category => {
                    if (category) {
                        map[category.data.id] = category.data.name;
                    }
                });
                setCatMap(map);

    
            }
            catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, [currentPage]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const groups = await getGroups(currentPage)
                setGroups(groups.data);
                setLastPage(groups.last_page)
            }
            catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, [currentPage]);


    return (
        <div>
            <header className="bg-blue-600 text-white p-4 text-center text-2xl font-bold">
                <div className="flex justify-center space-x-10">
                    <p>Groups</p>
                    <Link href={`/communities/creategroup`} className="flex">
                        <CreateGroupicon />
                        <p>Create Group</p>
                    </Link>
                </div>
            </header>
            <div className="flex-row flex justify-center">
                <div className="min-h-screen flex flex-col">
                    <ul className="grid grid-cols-3 mt-5">
                        {groups.map((group: any) => (
                            <PostItem
                                key={group.id}
                                group={group}
                                category={catMap[group.category_id] || group.category_id}
                            />
                        ))}
                    </ul>
                    <div className="flex justify-center space-x-4 mt-4 mb-5">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        <span className="self-center">Page {currentPage} of {lastPage}</span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}