"use client";

import React from "react";
import { motion } from "framer-motion";
import { BotMessageSquare, FileText, Languages, Mic2, SlidersHorizontal, Waves } from "lucide-react";

const features = [
    {
        icon: <BotMessageSquare className="text-indigo-600" />,
        title: "Точная транскрибация",
        desc: "Наш сервис использует передовые AI-алгоритмы для обеспечения высокой точности распознавания речи в ваших видео.",
    },
    {
        icon: <FileText className="text-indigo-600" />,
        title: "Экспорт в разные форматы",
        desc: "Получайте готовые транскрипции в популярных форматах, таких как TXT, SRT или VTT, для удобного использования.",
    },
    {
        icon: <Languages className="text-indigo-600" />,
        title: "Поддержка нескольких языков",
        desc: "Мы поддерживаем транскрибацию на множестве языков, что делает сервис идеальным для глобального контента.",
    },
    {
        icon: <Waves className="text-indigo-600" />,
        title: "Устранение шумов",
        desc: "Автоматическое удаление фоновых шумов для получения более чистой и читаемой текстовой версии.",
    },
    {
        icon: <SlidersHorizontal className="text-indigo-600" />,
        title: "Гибкие настройки",
        desc: "Настраивайте процесс транскрибации под свои нужды, выбирая специфические модели и параметры.",
    },
    {
        icon: <Mic2 className="text-indigo-600" />,
        title: "Распознавание дикторов",
        desc: "Наш AI умеет различать голоса и помечать реплики разных дикторов в итоговом тексте.",
    },
];

const FeatureCard = ({ icon, title, desc }: { icon: JSX.Element, title: string, desc: string }) => (
    <motion.div
        className="flex flex-col items-start p-6 rounded-2xl shadow-sm transition-all duration-300 ease-in-out bg-white/75 backdrop-blur-lg border border-white/90"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    >
        <div className="mb-4 p-3 bg-purple-100 rounded-full" aria-hidden="true">
            {React.cloneElement(icon, { className: "w-8 h-8 text-indigo-600" })}
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
                        Все, что нужно для ваших видео
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Наш сервис предоставляет мощные инструменты для быстрой и точной транскрибации.
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