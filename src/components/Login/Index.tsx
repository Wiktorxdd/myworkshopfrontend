import Head from "next/head";

export default function Login() {
    return (
        <form className="space-y-3 ">
            <div className="flex-1 rounded-lg bg-cyan-200 px-6 pb-4 pt-8 bg-neutral-200 shadow-xl">
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
                            minLength={6}
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