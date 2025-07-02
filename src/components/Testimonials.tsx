'use client';

import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const testimonials = [
  {
    avatar: 'https://i.pravatar.cc/150?img=1',
    name: 'Анна',
    role: 'Маркетолог',
    text: 'Этот инструмент сэкономил мне часы работы! Теперь я могу быстро получать текстовые версии видео для анализа и создания контента.',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=2',
    name: 'Михаил',
    role: 'Студент',
    text: 'Идеально для учебы. Легко транскрибирую лекции и вебинары, чтобы потом вернуться к материалу в текстовом формате. Очень удобно!',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    name: 'Елена',
    role: 'Журналист',
    text: 'Точность транскрибации на высоте. Использую для расшифровки интервью, и результат превосходит все ожидания. Рекомендую!',
    rating: 4,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=4',
    name: 'Иван',
    role: 'Разработчик',
    text: 'Простой и понятный интерфейс, ничего лишнего. Вставил ссылку — получил текст. То, что нужно для быстрых задач.',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=5',
    name: 'Ольга',
    role: 'Контент-менеджер',
    text: 'Отличный помощник в создании субтитров и описаний для видео. Работает быстро и без сбоев. Качество на высоте!',
    rating: 5,
  },
];

const Testimonials = () => {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            perView: 2,
            spacing: 32,
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: 3,
            spacing: 32,
          },
        },
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Что говорят наши пользователи
        </h2>
        <div ref={sliderRef} className="keen-slider mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="keen-slider__slide">
              <article className="shadow-xl rounded-2xl p-6 h-full flex flex-col">
                <div className="flex-grow">
                  <p className="text-gray-600">{testimonial.text}</p>
                </div>
                <div className="mt-6 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={`Аватар пользователя ${testimonial.name}`}
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-yellow-400">
                      {'★'.repeat(testimonial.rating)}
                    </span>
                    <span className="text-gray-300">
                      {'★'.repeat(5 - testimonial.rating)}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              document.getElementById('transcription-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="px-8 py-3 text-white font-semibold rounded-md bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:scale-105 transition-transform"
          >
            Посмотреть транскрипт
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;