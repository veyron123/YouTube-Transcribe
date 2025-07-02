'use client';

import YTInput from "@/components/YTInput";
import TranscriptionOutput from "@/components/TranscriptionOutput";
import Insights from "@/components/Insights";
import { useScroll } from "@/hooks/useScroll";
import StickyCTA from "@/components/StickyCTA";
import Features from "@/components/Features";
import LiveDemo from "@/components/LiveDemo";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const scrollY = useScroll();

  const sectionAnimation = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <main role="main" className="flex min-h-screen flex-col items-center justify-between">
      <section id="hero" className="flex flex-col items-center text-center py-12 sm:py-20 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Мгновенная транскрибация видео с YouTube
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl">
          Легко превращайте любое видео с YouTube в текст. Копируйте и скачивайте готовую транскрипцию в один клик.
        </p>
        <YTInput />
        <div id="transcription-section" className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 mt-8">
          <div className="lg:col-span-1">
            <TranscriptionOutput />
          </div>
          <div className="lg:col-span-1">
            <Insights />
          </div>
        </div>
      </section>
      <motion.div {...sectionAnimation} className="w-full">
        <Features />
      </motion.div>
      <motion.div {...sectionAnimation} className="w-full">
        <LiveDemo />
      </motion.div>
      <motion.div {...sectionAnimation} className="w-full">
        <Testimonials />
      </motion.div>
      <motion.div {...sectionAnimation} className="w-full">
        <FAQ />
      </motion.div>
      <Footer />
      {scrollY > 600 && <StickyCTA />}
    </main>
  );
}
