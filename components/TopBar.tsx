import { Bot, LineChart, ScrollText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Chat } from "./Chat";
import { Chart } from "./Chart";
import { Policy } from "./Policy";

export function Topbar() {
  return (
    <div className="w-full bg-white shadow-md p-4">
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto -mx-1 mt-15">
          <TabsTrigger value="chat" className="flex flex-col sm:flex-row gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Bot className="w-5 h-5" />
              <span>Disease Diagnosis</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex flex-col sm:flex-row gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <LineChart className="w-5 h-5" />
              <span>Market Prices</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex flex-col sm:flex-row gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <ScrollText className="w-5 h-5" />
              <span>Govt. Policies</span>
            </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <Chat />
        </TabsContent>
        <TabsContent value="market" className="mt-6">
          <Chart />
        </TabsContent>
        <TabsContent value="policy" className="mt-6">
          <Policy />
        </TabsContent>
      </Tabs>
    </div>
  )
}