"use client";
import { Leaf, Mic, Send, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Inter } from "next/font/google";
import { useState, useRef, useEffect } from "react";
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

const hardcodedResponse = `**Diagnosis:** Early Blight (caused by Alternaria solani)
**Crop:** Tomato
**Symptoms Identified:**
- Concentric brown lesions with yellow halos
- Older leaves infected first, progressing upwards
- Premature leaf drop reducing yield

**Cause:** Fungus thrives in warm, humid conditions—especially after rainfall or overhead irrigation.

**Recommended Actions:**
- Remove affected leaves immediately to slow spread.
- **Apply Fungicide:**
  - Locally available: Mancozeb or Chlorothalonil-based spray
  - Follow label instructions; reapply every 7–10 days during high humidity
- **Improve Airflow:** Space plants adequately and avoid overhead watering.
- **Crop Rotation:** Don't plant tomatoes or potatoes in the same spot for 2–3 seasons.

**Cost Tip:** Generic Mancozeb is widely available in local agri-stores at low cost (~₹150 per 500g).

**Prevention Tip:** Spray neem oil weekly as an organic preventive option.`;

export function Chat() {
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

  // New chat layout (original design)
  if (messages.length === 0 && !isTyping) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center justify-center p-4 mb-6">
  <Leaf color="#00ff11" className="h-12 w-12" />
  <h1 className={`${inter.className} font-bold text-5xl mt-2`}>
    AI Plant Disease Diagnosis
  </h1>
  <p className="pt-4 text-gray-500 text-lg text-center">
    Upload a photo of an affected plant leaf to get an instant diagnosis and treatment advice.
  </p>
</div>
          <div className="flex justify-center">
            <div className="w-[1000px] py-2 px-2 bg-white rounded-lg shadow-md border-2">
              <div className="flex flex-col h-full">
                <Textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="border-0 shadow-background resize-none bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                />
                {uploadedImage && (
                  <div className="mt-2 relative inline-block">
                    <Image 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-20 h-20 rounded-lg border object-cover"
                    />
                    <button 
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <Button 
                      size={"icon"} 
                      variant="ghost" 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload />
                    </Button>
                    <div className="flex justify-center">
                      <Button variant={"ghost"} size={"icon"} className="text-gray-500 hover:text-gray-700 items-center">
                        <Mic />
                      </Button>
                      <Button 
                        onClick={handleSend}
                        disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                        variant={"ghost"} 
                        size={"icon"} 
                        className="text-gray-500 hover:text-gray-700 items-center disabled:opacity-50"
                      >
                        <Send />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat layout (when there are messages)
  return (
    <div className="flex flex-col h-screen pt-20">
      {/* Header */}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
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
                      className="max-w-full max-h-64 rounded-lg border"
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
        </div>
      </div>

      {/* Input Area */}
      <div className=" bg-white p-4">
        <div className="max-w-xl mx-auto">
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
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="border-0 shadow-none resize-none bg-transparent text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 min-h-[36px] max-h-[120px] flex-1"
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
  )
}