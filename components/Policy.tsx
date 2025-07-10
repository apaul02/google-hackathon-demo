"use client";
import { Mic, Send, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Inter } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
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

const dripIrrigationResponse = `**হ্যাঁ, ড্রিপ সেচের জন্য সরকারি সহায়তা পাওয়া যায়।**

**পরিকল্পনার নাম:** প্রধানমন্ত্রী কৃষি সিচাই যোজনা (PMKSY) – "Per Drop More Crop" উপ-উদ্যোগ

**মূল সুবিধা:**
• ড্রিপ ও স্প্রিংকলার সিস্টেমে ৪০%–৫৫% পর্যন্ত ভর্তুকি (ছোট ও প্রান্তিক কৃষকদের জন্য উচ্চ হারে ভর্তুকি)
• জমির পরিমাণ, জলের উৎস ও ফসল অনুযায়ী সহায়তা পরিবর্তিত হয়

**যোগ্যতা:**
• কৃষিজমির বৈধ মালিক
• জল উৎস (নলকূপ, পুকুর, গভীর নলকূপ ইত্যাদি)
• রাজ্য সরকারে রেজিস্টার্ড কৃষক

**আবেদনের লিঙ্ক:**
➡ https://pmksy.gov.in
➡ এছাড়াও, রাজ্য কৃষি দপ্তরের পোর্টালে আবেদন করা যায়

**সহায়তার জন্য:**
নিকটস্থ কৃষি সহকারী অফিসে যোগাযোগ করুন বা কৃষক কল সেন্টারে (1800-180-1551) ফোন করুন

---

**English Translation:**

**Yes, there is a government scheme for drip irrigation.**

**Scheme Name:** Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) – "Per Drop More Crop" sub-component

**Main Benefits:**
• 40%–55% subsidy on drip and sprinkler systems (higher for small and marginal farmers)
• Assistance varies based on land size, water source, and crop

**Eligibility:**
• Legal ownership of agricultural land
• Access to a water source (tube well, pond, deep bore well, etc.)
• Registered with the state agriculture department

**Application Links:**
➡ https://pmksy.gov.in
➡ Or through your State Agriculture Department portal

**For Help:**
Contact your local agriculture extension office or call the Kisan Call Center at 1800-180-1551`;

const policyCards = [
  {
    id: "pm-kisan",
    title: "PM-Kisan Scheme",
    description: "A central scheme to supplement the financial needs of all land-holding farmers families. Eligible families receive ₹6,000 per year in three equal installments.",
    sectionTitle: "Eligibility Requirements:",
    features: [
      "Must be a land-holding farmer family",
      "Annual income should not exceed ₹2 lakh",
      "Must have valid Aadhaar number linked to bank account",
      "Excludes institutional landholders and farmers in urban areas"
    ],
    linkText: "Application Portal"
  },
  {
    id: "fasal-bima",
    title: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
    sectionTitle: "Key Features:",
    features: [
      "Premium rates: 2% for Kharif, 1.5% for Rabi crops",
      "Covers all food grains, oilseeds, and annual commercial crops",
      "Technology-based claims settlement",
      "No upper limit on government subsidy"
    ],
    linkText: "Apply for Insurance"
  },
  {
    id: "pm-kusum",
    title: "PM-KUSUM Scheme",
    description: "Kisan Urja Suraksha evam Utthaan Mahabhiyan aims to provide financial and water security to farmers through solar energy solutions.",
    sectionTitle: "Components:",
    features: [
      "Solar pumps for irrigation",
      "Solar power plants on barren lands",
      "Solarization of grid-connected pumps",
      "Up to 90% subsidy available"
    ],
    linkText: "Solar Solutions"
  },
  {
    id: "food-security",
    title: "National Food Security Act",
    description: "Ensures food and nutritional security by providing subsidized food grains to eligible households through the Public Distribution System.",
    sectionTitle: "Benefits:",
    features: [
      "Rice at ₹3 per kg for priority households",
      "Wheat at ₹2 per kg for priority households",
      "Coarse grains at ₹1 per kg",
      "Covers 75% rural and 50% urban population"
    ],
    linkText: "Check Eligibility"
  },
  {
    id: "soil-health",
    title: "Soil Health Card Scheme",
    description: "Provides farmers with information on nutrient status of their soil and recommendations on appropriate dosage of nutrients for improved productivity.",
    sectionTitle: "Features:",
    features: [
      "Free soil testing for all farmers",
      "Recommendations for fertilizer use",
      "Digital soil health cards",
      "Issued every 3 years"
    ],
    linkText: "Get Soil Card"
  },
  {
    id: "pm-aasha",
    title: "PM-AASHA Scheme",
    description: "Annadata Aay SanraksHan Abhiyan ensures remunerative prices to farmers for their produce through Price Support Scheme, Price Deficiency Payment System, and Private Procurement.",
    sectionTitle: "Support Mechanisms:",
    features: [
      "Minimum Support Price (MSP) for crops",
      "Price Deficiency Payment System",
      "Private Procurement & Stockist Scheme",
      "Covers oilseeds, pulses, and copra"
    ],
    linkText: "MSP Information"
  }
];

export function Policy() {
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
        text: dripIrrigationResponse,
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

  const formatMessage = (text: string) => {
    // Convert markdown-style formatting to HTML
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/➡ (https?:\/\/[^\s]+)/g, '➡ <a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
      .replace(/\n/g, '<br />')
      .replace(/• /g, '<br />• ');

    return formatted;
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {/* Left column - 2/3 width */}
        <div className="border-2 col-span-2 p-4 rounded-lg h-[calc(100vh-104px)] overflow-y-auto">
          <div className="space-y-4">
            {policyCards.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{policy.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">{policy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-semibold">{policy.sectionTitle}</CardTitle>
                  <ul className="list-disc pl-5 space-y-2 pt-2">
                    {policy.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={"https://pmkisan.gov.in/RegistrationFormupdated.aspx"} target="_blank" className="text-blue-500 underline">{policy.linkText}</Link>
                </CardFooter>
              </Card>
            ))}
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
                  <div className={`${inter.className} font-bold text-2xl`}>
                    Government Schemes Navigator
                  </div>
                  <div className="text-gray-500 text-lg">
                    Ask about various government schemes and policies that can benefit farmers.
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
                            width={128}
                            height={128}
                            className="max-w-full max-h-32 rounded-lg border"
                          />
                        </div>
                      )}
                      {message.text && (
                        <div 
                          className="text-sm whitespace-pre-wrap leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                        />
                      )}
                      <p className={`text-xs mt-2 ${
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
                    width={32}
                    height={32}
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
                placeholder="Ask about policies..."
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