import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
   

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")
        const password = formData.get("password")

        const response = await fetch('http://localhost/api/log-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('token', data.token)

            console.log(data.token)
            router.push(`/mainpage`)
            router.refresh()

        }
    }

    
    return (
        <form className="space-y-3 " onSubmit={handleSubmit}>
            <div className="flex-1 rounded-lg px-6 pb-4 pt-8 bg-neutral-200 shadow-xl">
                <h1 className="mb-3 text-2xl">Login</h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                         Email
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                        />
                        </div>
                    </div>
                </div>
                <button className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Log in 
                </button>
            </div>
        </form>
        
    )
}