'use client';

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { getGroupById } from "@/app/api/groups/route";

export default function GroupIdPage() {
    const unwrappedParams = useParams();
    const { id } = unwrappedParams;
    const [group, setGroup] = useState();

    useEffect(() => {
        const fetchGroup = async () => {
            const group = await getGroupById(id);
            setGroup(group.data);

        };
        fetchGroup();
    }, [id]);


    return (
        <div>
            {group ? (
                <div>
                    <h1>{group.name}</h1>
                    <p className="mt-2">About me!</p>
                    <p>{group.description}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}