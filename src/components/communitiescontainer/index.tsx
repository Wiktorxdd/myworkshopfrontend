import { useState, useEffect } from "react";
import { getGroups } from "@/app/api/groups/route";
import { getCategoryById } from "@/app/api/categories/route";
import Link from "next/link";

export default function GroupContainer() {
    const [groups, setGroups] = useState([])
    const [catMap, setCatMap] = useState({});

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await getGroups()
                const groups = [...response.data]
                const randomGroups = groups.sort(() => Math.random() - 0.5).slice(0, 3);
                setGroups(randomGroups);

                const catIds = [...new Set(groups.map(group => group.category_id))];
                const groupPromises = catIds.map(id =>
                    getCategoryById(id).catch(error => {
                        console.error(`Failed to fetch category ${id}:`, error);
                        return null;
                    })
                );
                const categories = await Promise.all(groupPromises);
                console.log(categories)
                const map = {};
                categories.forEach(category => {
                    if (category) {
                        map[category.data.id] = category.data.name;
                    }
                });
                setCatMap(map);

            } catch (error) {
                console.error("failed to fetch groups:", error);
            }
        };
        fetchGroups();
    }, []);


    return (
        <div className="w-1/4 mt-10 fixed">
            <div className="flex flex-col border bg-neutral-100 rounded-md shadow-lg p-5 space-y-5">
                <p className="text-center">Communities!</p>
                {groups.map((group: any) => (
                    <ul key={group.id} className="border bg-neutral-100 shadow-lg rounded-md p-5">
                        <Link href={`/communities/${group.id}`}>
                            <div className="text-center">
                                {group.name}
                            </div>
                        </Link>
                        <div className="text-center">
                            {catMap[group.category_id]}
                        </div>
                        <div className="text-center break-words line-clamp-1">
                            {group.description}
                        </div>
                    </ul>
                ))}
            </div>
        </div>
    )
}