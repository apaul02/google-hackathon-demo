import { Features } from "@/components/features";
import { Landing } from "@/components/Landing";
import { Button } from "@/components/ui/button";
import { Kalam } from "next/font/google";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function Home() {
  return (
    <div>
      <Landing />
    </div>
  );
}
