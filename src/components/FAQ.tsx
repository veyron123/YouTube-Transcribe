'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: 'Как это работает?',
    answer:
      'Наш сервис использует передовые технологии распознавания речи для транскрибации аудио из YouTube видео. Просто вставьте ссылку, и мы сделаем все остальное.',
  },
  {
    question: 'Какие языки поддерживаются?',
    answer:
      'В настоящее время мы поддерживаем более 50 языков, включая английский, испанский, русский, китайский и многие другие. Мы постоянно работаем над расширением этого списка.',
  },
  {
    question: 'Это бесплатно?',
    answer:
      'Да, у нас есть бесплатный тариф с базовыми функциями. Для более продвинутых возможностей, таких как экспорт в разные форматы и отсутствие ограничений, мы предлагаем премиум-подписку.',
  },
  {
    question: 'Насколько точна транскрибация?',
    answer:
      'Точность зависит от качества звука в видео. Для видео с чистым звуком и без фонового шума точность может достигать 98-99%.',
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem = ({ question, answer, isOpen, onClick }: AccordionItemProps) => {
  const contentId = `faq-content-${question.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-5 text-left font-semibold"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        id={contentId}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <p className="pb-5 pr-4 text-gray-600 dark:text-gray-300">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Часто задаваемые вопросы</h2>
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;