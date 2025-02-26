"use client";

import Logo from "@/components/Header/Logo";
import Header from "../components/Header";
import Image from "next/image";
import Login from "@/components/Login/Index";

import placeholder from "../../public/placeholder.svg";

export default function Home() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-7 md:-mt-32">
        <Login />
      </div>
        
    </main>
  )
}
