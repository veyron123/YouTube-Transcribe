'use client';

import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const testimonials = [
  {
    avatar: 'https://i.pravatar.cc/150?img=1',
    name: 'Anna',
    role: 'Marketer',
    text: 'This tool saved me hours of work! Now I can quickly get text versions of videos for analysis and content creation.',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=2',
    name: 'Michael',
    role: 'Student',
    text: 'Perfect for studying. I easily transcribe lectures and webinars to return to the material in text format later. Very convenient!',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    name: 'Elena',
    role: 'Journalist',
    text: 'The transcription accuracy is excellent. I use it for transcribing interviews, and the result exceeds all expectations. Highly recommend!',
    rating: 4,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=4',
    name: 'Ivan',
    role: 'Developer',
    text: 'Simple and clear interface, nothing unnecessary. Pasted the link — got the text. Exactly what you need for quick tasks.',
    rating: 5,
  },
  {
    avatar: 'https://i.pravatar.cc/150?img=5',
    name: 'Olga',
    role: 'Content Manager',
    text: 'Excellent assistant for creating subtitles and video descriptions. Works fast and without glitches. Quality is top-notch!',
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
          What Our Users Say
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
                    alt={`${testimonial.name}'s avatar`}
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
            View Transcript
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;