"use client";

import React from "react";
import { motion } from "framer-motion";
import { BotMessageSquare, FileText, Languages, Mic2, SlidersHorizontal, Waves } from "lucide-react";

const features = [
    {
        icon: <BotMessageSquare className="text-indigo-600" />,
        title: "Accurate Transcription",
        desc: "Our service uses advanced AI algorithms to ensure high accuracy in speech recognition for your videos.",
    },
    {
        icon: <FileText className="text-indigo-600" />,
        title: "Export to Different Formats",
        desc: "Get ready transcriptions in popular formats such as TXT, SRT, or VTT for convenient use.",
    },
    {
        icon: <Languages className="text-indigo-600" />,
        title: "Multiple Language Support",
        desc: "We support transcription in multiple languages, making the service ideal for global content.",
    },
    {
        icon: <Waves className="text-indigo-600" />,
        title: "Noise Reduction",
        desc: "Automatic removal of background noise to get a cleaner and more readable text version.",
    },
    {
        icon: <SlidersHorizontal className="text-indigo-600" />,
        title: "Flexible Settings",
        desc: "Customize the transcription process to your needs by choosing specific models and parameters.",
    },
    {
        icon: <Mic2 className="text-indigo-600" />,
        title: "Speaker Recognition",
        desc: "Our AI can distinguish voices and mark different speakers' lines in the final text.",
    },
];

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactElement, title: string, desc: string }) => (
    <motion.div
        className="flex flex-col items-start p-6 rounded-2xl shadow-sm transition-all duration-300 ease-in-out bg-white/75 backdrop-blur-lg border border-white/90"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    >
        <div className="mb-4 p-3 bg-purple-100 rounded-full" aria-hidden="true">
            {React.cloneElement(icon as React.ReactElement<any>, { className: "w-8 h-8 text-indigo-600" })}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-700">{desc}</p>
    </motion.div>
);

const Features = () => {
    return (
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 aurora-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything You Need for Your Videos
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Our service provides powerful tools for fast and accurate transcription.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;