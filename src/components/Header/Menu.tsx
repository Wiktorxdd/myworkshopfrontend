"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/components/Header/Menu.css";
import Link from "next/link";
import CommunityIcon from "@/components/svgs/community";
import PersonIcon from "@/components/svgs/person";
import SettingsIcon from "@/components/svgs/settings";
import UserIcon from "@/components/svgs/user";
import LogoutIcon from "@/components/svgs/logout";
import { logOut } from "@/app/api/auth/route";

export default function Menu() {
    const token = localStorage.getItem("token");
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);

    const toggleButton = () => {
        setShowPopup(!showPopup);
    }

    async function logout() {
        try {
            const response = await logOut();
            if (response.ok) {
                localStorage.removeItem("token");
                router.push("/");
            } else {
                console.error(`Logout failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    function profile() {
        if (token) {
            return (
                <div>
                    <button onClick={toggleButton}>
                        <PersonIcon />
                    </button>
                    {showPopup && <div className="absolute right-0 top-10 bg-neutral-100 shadow-lg p-2 border rounded-md">
                        <Link href="/profile" className="flex items-center space-x-3hover:text-blue-800">
                            <UserIcon />
                            <span>profile</span>
                        </Link>
                        <Link href = "/settings" className="flex items-center mt-4 space-x-3hover:text-blue-800">
                            <SettingsIcon />
                            <span>settings</span>
                        </Link>
                        <button onClick={logout} className="flex items-center mt-4 space-x-3hover:text-blue-800">
                            <LogoutIcon />
                            <span>logout</span>
                        </button>
                    </div>}
                </div>
            )
        } else {
            return <Link href="/" className="flex items-center space-x-2">
                <PersonIcon />
            </Link>;
        }
    }

    return (
        <div className="flex justify-between items-center w-80">
            <Link href="/communities" className="flex items-center space-x-2">
                <CommunityIcon />
                <span>Communities</span>
            </Link>
            {profile()}
        </div>
    );
}