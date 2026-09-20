'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
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

const AUTOPLAY_INTERVAL = 6500;

export function HeroSlider({ initialSlides }: HeroSliderProps) {
  const slides = (initialSlides && initialSlides.length > 0) ? initialSlides : defaultHeroSlides;
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (slides.length > 1) {
      timerRef.current = setInterval(() => {
        setActive((current) => (current + 1) % slides.length);
      }, AUTOPLAY_INTERVAL);
    }
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setActive(index);
    resetTimer();
  }, [resetTimer]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setActive((current) => (current + 1) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setActive((current) => (current - 1 + slides.length) % slides.length);
    resetTimer();
  }, [slides.length, resetTimer]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (slides.length <= 1) return;
      if (event.key === 'ArrowRight') nextSlide();
      if (event.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, nextSlide, prevSlide]);

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
  const button2Link = currentSlide.button_2_link || whatsappLink('Hello Qadri Horncraft, I would like to make a product inquiry.');

  return (
    <section
      className="hero"
      onTouchStart={(event) => setTouchStart(event.changedTouches[0].screenX)}
      onTouchEnd={(event) => {
        const distance = event.changedTouches[0].screenX - touchStart;
        if (Math.abs(distance) > 45 && slides.length > 1) {
          if (distance < 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={active}
          className="hero-visual"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.eyebrow || 'Hero slide'}
            fill
            priority
            sizes="100vw"
            className="object-cover hero-slide-img"
          />
        </motion.div>
      </AnimatePresence>

      <div className="hero-overlay" />

      <div className="shell hero-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
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
        <>
          <div className="hero-dots-container">
            <div className="hero-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={idx === active ? 'active' : ''}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="hero-nav-container">
            <div className="hero-nav">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="hero-nav-btn"
                type="button"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="hero-nav-btn"
                type="button"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

