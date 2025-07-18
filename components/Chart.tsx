"use client";
import { Mic, Send, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Inter } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  weight: "500"
})

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string; // Base64 image data
}

const hardcodedResponse = `
**ಇಂದು ಟೊಮೆಟೊ ಮಾರುಕಟ್ಟೆ ಸ್ಥಿತಿ:**
**ಮೂಲಸ್ಥಳ:** ಕೋಲಾರ APMC
ನಿಮ್ನ–ಗರಿಷ್ಠ ಬೆಲೆ: ₹650 – ₹950 ಕ್ವಿಂಟಲ್‌ಗೆ
**ಮಧ್ಯಮ ಬೆಲೆ:** ₹800
**ಹಿಂದಿನ ವಾರ ಹೋಲಿಕೆ:** ಬೆಲೆಯಲ್ಲಿ 5% ಇಳಿಕೆ
**🌦 ಕಾರಣ:** ಕಡಿಮೆ ಗುಣಮಟ್ಟದ ಸರಬರಾಜು ಮತ್ತು ಮಳೆ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಬೇಡಿಕೆ ಇಳಿಕೆ

**ನಿಮಗೆ ಸಲಹೆ:**
- ಇಂದು ಮಾರಾಟ ಮಾಡುವುದನ್ನು ತಡೆಹಿಡಿಯಿರಿ (ಯಾವಾಗ ಸಾಧ್ಯವೋ).
- 2–3 ದಿನಗಳಲ್ಲಿ ಹವಾಮಾನ ಸುಧಾರಣೆಯೊಂದಿಗೆ ಬೆಲೆ ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ.

**ಉತ್ತಮ ಬೆಲೆಗಾಗಿ:**
- ಮಾರುಕಟ್ಟೆ ನೇರ ಮಾರಾಟಕ್ಕೆ ಪ್ರಯತ್ನಿಸಿ
- ಮಧ್ಯವರ್ತಿಗಳ ಜಾಲ ತಪ್ಪಿಸಿ

**ನಾನೇ ನಿಮ್ಮ ಮುಂದಿನ ಮಾರಾಟ ವೇಳೆಗೆ ಹತ್ತುಕೊಳ್ಳಬಹುದಾ?**

**Today's Tomato Market Status:**
**Source:** Kolar APMC
**Min–Max Price:** ₹650 – ₹950 per quintal
**Average Price:** ₹800
**Compared to Last Week:** 5% drop in price
**Reason:** Low-quality supply and reduced demand due to rainfall

**Advice for You:**
- Hold off on selling today if possible.
- Prices are likely to rise in the next 2–3 days as weather conditions improve.

**To Get Better Prices:**
- Try direct market sales
- Avoid middlemen wherever possible

**Shall I remind you before the next optimal selling time?**`;

const cropYieldData = [
  { crop: "Rice", yield: 4200 },
  { crop: "Wheat", yield: 3800 },
  { crop: "Maize", yield: 5600 },
  { crop: "Barley", yield: 2800 },
  { crop: "Millet", yield: 1900 },
  { crop: "Sorghum", yield: 2100 },
]

const marketPriceData = [
  { month: "Jan", price: 2800 },
  { month: "Feb", price: 3200 },
  { month: "Mar", price: 2950 },
  { month: "Apr", price: 3100 },
  { month: "May", price: 3350 },
  { month: "Jun", price: 3600 },
]

const marketAnalysisData = [
  { crop: "Rice", currentPrice: "₹2,800/quintal", previousPrice: "₹2,650/quintal", change: "+5.7%", trend: "Rising" },
  { crop: "Wheat", currentPrice: "₹2,200/quintal", previousPrice: "₹2,100/quintal", change: "+4.8%", trend: "Stable" },
  { crop: "Maize", currentPrice: "₹1,800/quintal", previousPrice: "₹1,750/quintal", change: "+2.9%", trend: "Rising" },
  { crop: "Barley", currentPrice: "₹1,650/quintal", previousPrice: "₹1,600/quintal", change: "+3.1%", trend: "Stable" },  
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  yield: {
    label: "Yield (kg/hectare)",
    color: "hsl(var(--chart-1))",
  },
  price: {
    label: "Price (₹/quintal)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Chart() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      image: uploadedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setUploadedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: hardcodedResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); 
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return <div key={index} className="mb-1"></div>;
      
      // Check if line starts with ** (bold headers)
      if (line.startsWith('**') && line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={index} className="font-bold mb-2 text-gray-900">
            {parts.map((part, i) => 
              i % 2 === 1 ? <span key={i} className="font-bold">{part}</span> : part
            )}
          </div>
        );
      }
      
      // Check if line starts with - (bullet point)
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        // Check if bullet point has bold text
        if (content.includes('**')) {
          const parts = content.split('**');
          return (
            <div key={index} className="ml-4 mb-1 flex">
              <span className="mr-2">•</span>
              <span>
                {parts.map((part, i) => 
                  i % 2 === 1 ? <span key={i} className="font-semibold">{part}</span> : part
                )}
              </span>
            </div>
          );
        }
        return (
          <div key={index} className="ml-4 mb-1 flex">
            <span className="mr-2">•</span>
            <span>{content}</span>
          </div>
        );
      }
      
      // Regular line with potential bold formatting
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <div key={index} className="mb-1">
            {parts.map((part, i) => 
              i % 2 === 1 ? <span key={i} className="font-semibold">{part}</span> : part
            )}
          </div>
        );
      }
      
      // Regular line
      return (
        <div key={index} className="mb-1">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {/* Left column - 2/3 width */}
        <div className="border-2 col-span-2 p-4 rounded-lg h-[calc(100vh-104px)] overflow-y-auto">
          <div className="space-y-4">
            {/* Top row - Two charts side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Crop Yield Chart */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Crop Yield Analysis</h3>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart accessibilityLayer data={cropYieldData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="crop"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 4)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="yield" fill="var(--color-yield)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </div>

              {/* Market Price Chart */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-3">Market Price Trends</h3>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart accessibilityLayer data={marketPriceData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="price" fill="var(--color-price)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Bottom row - Market Analysis Table */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold mb-3">Market Analysis Summary</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Previous Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketAnalysisData.map((item) => (
                    <TableRow key={item.crop}>
                      <TableCell className="font-medium">{item.crop}</TableCell>
                      <TableCell>{item.currentPrice}</TableCell>
                      <TableCell>{item.previousPrice}</TableCell>
                      <TableCell className={`font-medium ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.trend === 'Rising' ? 'bg-green-100 text-green-800' : 
                          item.trend === 'Stable' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.trend}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Right column - 1/3 width with chatbot */}
        <div className="border-2 rounded-lg flex flex-col h-[calc(100vh-104px)]">
          {/* Chat Header */}
          
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.length === 0 && !isTyping ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className={`${inter.className} font-bold text-2xl `}>
                    Real-Time Market Analysis
                  </div>
                  <div className="text-gray-500 text-lg">
                    Get the latest market prices for your crops. Prices are per quintal.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <Image 
                            src={message.image} 
                            alt="Shared image" 
                            className="max-w-full max-h-32 rounded-lg border"
                          />
                        </div>
                      )}
                      {message.text && (
                        <div className="text-sm whitespace-pre-wrap">
                          {message.isUser ? message.text : renderMessageText(message.text)}
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area - Always at bottom */}
          <div className="p-4 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 shadow-sm">
              {uploadedImage && (
                <div className="relative">
                  <Image 
                    src={uploadedImage} 
                    alt="Uploaded preview" 
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <button 
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
              <Button 
                size={"icon"} 
                variant="ghost" 
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the market trends, crop prices....."
                className="border-0 shadow-none resize-none bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 min-h-[32px] max-h-[80px] flex-1"
              />
              <div className="flex gap-1 flex-shrink-0">
                <Button variant={"ghost"} size={"icon"} className="text-gray-500 hover:text-gray-700 h-8 w-8">
                  <Mic size={16} />
                </Button>
                <Button 
                  onClick={handleSend}
                  disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                  variant={"ghost"} 
                  size={"icon"} 
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50 h-8 w-8"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}