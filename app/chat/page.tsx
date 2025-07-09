import { Chat } from "@/components/Chat";
import Navbar from '@/components/navbar';

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Chat />
    </div>
  )
}