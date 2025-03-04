import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
           
        
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name")
        const email = formData.get("email")
        const password = formData.get("password")
        const password_confirmation = formData.get("password_confirmation")

        if (password !== password_confirmation) {
            alert('Password does not match')
        }
        else {
            const response = await fetch('http://localhost:80/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation
                }),
            })
            if (response.ok) {
                console.log(response)
                router.push(`/`)
            }
        }
        
    }

    return (
        <form className="space-y-3 " onSubmit={handleSubmit}>
            <div className="flex-1 rounded-lg bg-cyan-200 px-6 pb-4 pt-8 bg-neutral-200 shadow-xl">
                <h1 className="mb-3 text-2xl">Register</h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="name"
                        >
                         Name
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required
                        />
                        </div>
                    </div>
                </div>   
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
                            minLength={8}
                        />
                        </div>
                    </div>
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password_confirmation"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-neutral-100 bg-neutral-100 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm password"
                            required
                        />
                        </div>
                    </div>
                    
                </div>
                <button className="mt-4 w-full bg-blue-700 rounded-md text-white p-1">
                    Register Account
                </button>
            </div>
        </form>
    )
}