'use client'
import { updateGroup } from "@/app/api/groups/route"
import { getCategories } from "@/app/api/categories/route"
import { getGroupById } from "@/app/api/groups/route"
import { useParams } from "next/navigation"
import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function EditGroup() {
    const params = useParams();
    const { id } = params;
    const [categories, setCategories] = useState([])
    const [group, SetGroup] = useState({})
    const router = useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories.data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchGroup = async () => {
            const group = await getGroupById(id);
            SetGroup(group.data);
        };
        fetchGroup();
    }, [id]);


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const response = await updateGroup(formData, id);
            router.push(`/communities/${id}`)
        } catch (error) {
            console.error('Error during user update:', error);
        }
    }

    return (

        <form className="mt-10 flex-1 justify-items-center" onSubmit={handleSubmit}>
            <div className="flex-1 rounded-lg bg-cyan-200 px-6 pb-4 pt-8 w-1/2 bg-neutral-200 shadow-xl">
                <h1 className="mb-3 text-2xl">Change your details</h1>
                <div className="w-full">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="name"
                    >
                        Group Name
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="name"
                            type="text"
                            name="name"
                            defaultValue={group.name}

                        />
                    </div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="aboutme"
                    >
                        Group Description
                    </label>
                    <div className="relative">
                        <textarea
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="description"
                            type="text"
                            name="description"
                            defaultValue={group.description}

                        />
                    </div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="image"
                    >
                        Group Image
                    </label>
                    <div className="relative">
                        <input className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            type="file"
                            name="image"
                            id="image"
                        />
                    </div>
                </div>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="category"
                        >
                            Group Category
                        </label>
                        <div className="relative">
                            <select
                                className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                                id="category_id"
                                name="category_id"
                                defaultValue={group.category_id} 
                            >
                                {
                                    categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <button className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Edit Group
                </button>
                <button onClick={() => router.back()} className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Cancel
                </button>
            </div>
        </form>
    )
}