"use client";

import Image from "next/image";
import "@/components/Header/Menu.css";

export default function Menu() {
    return (
        <div>
            <Image 
                src="/person.svg" width={40} height={40} alt="login"
                className="pointer"
            />
        </div>
    );
}