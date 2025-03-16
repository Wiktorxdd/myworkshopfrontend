'use client'
import { createGroup } from "@/app/api/groups/route"
import { getCategories } from "@/app/api/categories/route"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function CreateGroup() {
    const [categories, setCategories] = useState([])
    const router = useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setCategories(categories.data);
        };
        fetchCategories();
    }, []);


    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
            const response = await createGroup(formData);
            router.push('/communities')
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
                            placeholder="Enter the group name"

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
                            placeholder="Write a group description"

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
                            >
                                {
                                    categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <button className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Create Group
                </button>
                <button onClick={() => router.back()} className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Cancel
                </button>
            </div>
        </form>
    )
}