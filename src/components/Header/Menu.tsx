"use client";

import Image from "next/image";
import "@/components/Header/Menu.css";
import Link from "next/link";
import CommunityIcon from "@/components/svgs/community";
import PersonIcon from "@/components/svgs/person";

export default function Menu() {
    const token = localStorage.getItem("token");
    return (
        <div className="flex justify-between items-center w-80">
            <Link href="/communities" className="flex items-center space-x-2">
                <CommunityIcon />
                <span>Communities</span>
            </Link>
            {!token ? (
                <Link href="/profile" className="flex items-center space-x-2">
                    <PersonIcon />
                </Link>
            ) : (
                <Link href="/" className="flex items-center space-x-2">
                    <PersonIcon />
                </Link>
            )}
        </div>
    );
}