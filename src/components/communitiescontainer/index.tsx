import { useState, useEffect } from "react";
import { getGroups } from "@/app/api/groups/route";

export default function groupContainer() {
    const [groups, setGroups] = useState([])

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await getGroups()
                const groups = await response.json();
                setGroups(groups.communitydata);
            } catch (error) {
                console.error("failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, []);


    return (
        
    )
}