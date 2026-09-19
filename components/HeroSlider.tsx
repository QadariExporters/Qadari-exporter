'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { whatsappLink } from '@/lib/config';
import { HeroSlide } from '@/lib/db/schema';
import { defaultHeroSlides } from '@/lib/db/default-data';

interface HeroSliderProps {
  initialSlides?: HeroSlide[];
}

export function HeroSlider({ initialSlides }: HeroSliderProps) {
  const slides = (initialSlides && initialSlides.length > 0) ? initialSlides : defaultHeroSlides;
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (slides.length <= 1) return;
      if (event.key === 'ArrowRight') setActive((current) => (current + 1) % slides.length);
      if (event.key === 'ArrowLeft') setActive((current) => (current - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[active] || slides[0];

  const renderTitle = (title: string) => {
    if (!title) return null;
    const parts = title.split('\n');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <br />
          <em>{parts.slice(1).join(' ')}</em>
        </>
      );
    }
    return title;
  };

  const button1Text = currentSlide.button_1_text || 'Explore collection';
  const button1Link = currentSlide.button_1_link || '/products';
  const button2Text = currentSlide.button_2_text || 'Enquire on WhatsApp';
  const button2Link = currentSlide.button_2_link || whatsappLink('Hello Qadri Exporters, I would like to make a product inquiry.');

  return (
    <section
      className="hero"
      onTouchStart={(event) => setTouchStart(event.changedTouches[0].screenX)}
      onTouchEnd={(event) => {
        const distance = event.changedTouches[0].screenX - touchStart;
        if (Math.abs(distance) > 45 && slides.length > 1) {
          setActive((current) =>
            distance < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length
          );
        }
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="hero-visual"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.eyebrow || 'Hero slide'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="shell hero-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7 }}
          >
            {currentSlide.eyebrow && <p className="eyebrow">{currentSlide.eyebrow}</p>}
            <h1>{renderTitle(currentSlide.title)}</h1>
            {currentSlide.description && (
              <p className="hero-description">{currentSlide.description}</p>
            )}
            <div className="hero-buttons">
              <Link className="button button-light" href={button1Link}>
                {button1Text} <ArrowRight size={16} />
              </Link>
              <a
                className="button button-outline-light"
                href={button2Link}
                target={button2Link.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <MessageCircle size={16} /> {button2Text}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <div className="shell hero-controls">
          <div className="hero-nav">
            <button
              onClick={() => setActive((active - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
              className="hero-nav-button bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setActive((active + 1) % slides.length)}
              aria-label="Next slide"
              className="hero-nav-button bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
