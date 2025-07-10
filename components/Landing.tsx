"use client";
import { Features } from "./features";
import { Kalam } from "next/font/google";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export function Landing() {
  const router = useRouter();
  return (
    <div>
      <header className="flex items-center justify-between bg-background/80 backdrop-blur-sm p-4 border-b fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kisan Sathi</h1>
        </div>
        <div>
          <Button>Sign in</Button>
        </div>
      </header>
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center items-center text-6xl font-bold">
            <motion.div initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					>Grow Smart with</motion.div> <motion.div initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					 className={`${kalam.className} pt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>{"किसान साथी"}</motion.div>
           
          </div>
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }} initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="mt-2 rounded-md">
            <Button className="text-xl px-10 py-6" onClick={() => {router.push("/chat")}}>Get Started</Button>
           </motion.div>
        </div>
      </div>
      <div>
        <Features />
      </div>
    </div>
  )
}