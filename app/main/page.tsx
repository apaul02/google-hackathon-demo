import { Topbar } from "@/components/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MainPage() {
  return (
    <div>
      <header className="flex items-center justify-between bg-background/80 backdrop-blur-sm p-4 border-b fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Kisan Sathi</h1>
        </div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/apaul02.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <Topbar />
    </div>
  )
}