"use client";

import Logo from "@/components/Header/Logo";
import Menu from "@/components/Header/Menu";
import Link from "next/link";

export default function Header(props: any) {
    return <header className="px8 py-10 text-xl border-b bg-slate-50 sticky top-0">
        <Link href="/mainpage">
            <div className="absolute inset-y-7 left-20">MyWorkshop</div>
        </Link>
        <div className="absolute inset-y-5 right-20 w-16"><Menu /></div>

    </header>;
}   