"use client";

import Image from "next/image";
import { motion } from "motion/react"


const cardVariants = {
  hidden: {
    opacity: 0,
    y: 100,       
    scale: 0.8,   
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,    
  }
};

export function Features() {
  return (
    <section className="w-full py-10 px-10">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView={"visible"}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 14
           }}
        >
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-4 h-screen">
            <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
              Instant Crop Disease Diagnosis
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto md:mx-0">
              {"Farmers simply snap a photo of any troubled leaf or fruit, and the assistant—powered by Vertex AI’s multimodal Gemini vision model—instantly pinpoints pests, pathogens, or nutrient deficiencies. It then delivers clear, step-by-step treatment advice using only inputs and remedies that are both affordable and locally available, all communicated in Kannada."}
            </p>
          </div>

          <div className="flex justify-center md:justify-end rounded-2xl border-8">
            <div className="relative  h-auto">
              <Image
                src="/1st.jpg"
                alt="Task preview"
                width={800}
                height={700}
                className="rounded-xl shadow-lg object-contain w-full h-auto"
              />
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView={"visible"}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 14
           }}
        >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-4 h-screen">
        <div className="flex justify-center md:justify-end rounded-2xl border-8">
          <div className="relative  h-auto">
            <Image
              src="/2nd.jpg"
              alt="Task preview"
              width={800}
              height={600}
              className="rounded-xl shadow-lg object-contain w-full h-auto"
            />
          </div>
        </div>
        <div className="text-center md:text-right space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            Live Market Price Analysis
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg md:ml-auto">
            {"By tapping into public mandi-price APIs in real time, this feature provides up-to-the-minute price quotes and demand trends for crops like tomatoes. Using a Gemini model to interpret fluctuations, it offers a simple recommendation—sell now, wait, or store—and a short-term price forecast, all presented in Kannada text or voice."}
          </p>
        </div>       
      </div>
      </motion.div>
      <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView={"visible"}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ 
            type: "spring",
            stiffness: 120,
            damping: 14
           }}
        >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-4 h-screen">
          <div className="text-center md:text-left space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            Voice-First Scheme Navigation Assistant
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto md:mx-0">
            {"Through natural voice interaction in Kannada, farmers can ask about subsidies or support—“What schemes exist for drip irrigation?”—and receive a plain-language breakdown of each relevant government program, eligibility criteria, required documents, deadlines, and direct application links, ensuring no one misses out on available aid."}
          </p>
        </div>

        <div className="flex justify-center md:justify-end rounded-2xl border-8">
          <div className="relative  h-auto">
            <Image
              src="/3rd.jpg"
              alt="Task preview"
              width={800}
              height={700}
              className="rounded-xl shadow-lg object-contain w-full h-auto"
            />
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  )
}