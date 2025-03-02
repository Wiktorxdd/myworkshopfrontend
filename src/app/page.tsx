"use client";

import Login from "@/components/Login/login";
import { useState } from "react";
import Register from "@/components/Login/register";

export default function Home() {
  const [ShowRegister, setShowRegister] = useState(true);

  const toggleButton = () => {
    setShowRegister(!ShowRegister);
}


  return (
    <main className="flex items-center justify-center md:h-screen bg-cover" style={{ backgroundImage: "url('/backgroundimg.jpg')" }}>
      {ShowRegister && <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-7 md:-mt-32">
        <Login />
        <button onClick={toggleButton} className="text-white hover:underline">Register</button>
      </div>}
      {!ShowRegister && <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-7 md:-mt-32">
        <Register />
        <button onClick={toggleButton} className="text-white hover:underline">Login Instead</button>
      </div>}
    </main>
  )
}
