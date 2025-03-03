'use client';

import { useEffect, useState } from "react"
import { getGroups } from "@/app/api/groups/route";

export default function Communities() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await getGroups()
                const groups = await response.json();
                setGroups(groups.communitydata);
                console.log(groups);
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
            <div className="flex-grow flex items-center justify-center p-12">
            
                <h1>Communities</h1>
            </div>
        </div>
    )
}