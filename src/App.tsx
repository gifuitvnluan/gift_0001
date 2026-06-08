/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import GlassHeart3D from "./components/GlassHeart3D";
import AudioPlayer from "./components/AudioPlayer";
import LoveLetterSection from "./components/LoveLetterSection";
import FireworksCanvas from "./components/FireworksCanvas";
import gsap from "gsap";
import { config } from "./config";

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"home" | "letter" | "memories" | "promises">("home");

  const [isTourCompleted, setIsTourCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("love_applet_tour_completed") === "true";
    } catch (e) {
      return false;
    }
  });
  const [showCongratsToast, setShowCongratsToast] = useState(false);

  const handleCompleteTour = () => {
    // Blast a huge wave of romantic bubbles & sparkles
    triggerUpwardFountain("💖");
    triggerUpwardFountain("💌");
    triggerUpwardFountain("🌸");
    triggerUpwardFountain("🔒");
    triggerUpwardFountain("✨");

    setIsTourCompleted(true);
    localStorage.setItem("love_applet_tour_completed", "true");
    setShowCongratsToast(true);

    // Swap back to Home screen to admire the spinning crystal heart
    setTimeout(() => {
      setActiveScreen("home");
    }, 450);

    // Auto close toast after 9 seconds
    setTimeout(() => {
      setShowCongratsToast(false);
    }, 9000);
  };

  // Split name for GSAP stagger typing
  const subtitleText = config.subtitle;
  const subtitleChars = subtitleText.split("");

  const tagText = config.tagline;
  const tagChars = tagText.split("");

  // GSAP: Animate letters when intro camera flies in and completes
  useEffect(() => {
    if (introFinished) {
      // Small delay then type tag line
      gsap.fromTo(
        ".tag-char",
        { opacity: 0, scale: 0.3, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.1,
          stagger: 0.04,
          ease: "power2.out",
          onComplete: () => {
            // Type main name "Dành tặng cho Linh"
            gsap.fromTo(
              ".sub-char",
              { opacity: 0, y: 15, rotateX: -60 },
              {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.15,
                stagger: 0.08,
                ease: "back.out(1.8)",
                onComplete: () => {
                  // Fade in sub-note and scroll CTA button
                  gsap.fromTo(
                    ".explore-gate",
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
                  );
                },
              }
            );
          },
        }
      );
    }
  }, [introFinished]);

  // Handle click on Enter Gift Button
  const handleOnboardEnter = () => {
    setOnboarded(true);
    setIsPlaying(true); // Fire audio player safely (permitted since user clicked)
    triggerUpwardFountain("💖");
  };

  // Upward emoji fountain effect
  const triggerUpwardFountain = (emoji: string) => {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");
      element.innerText = emoji;
      element.style.position = "fixed";
      element.style.left = `${Math.random() * 80 + 10}vw`;
      element.style.bottom = "0vh";
      element.style.fontSize = `${Math.random() * 24 + 18}px`;
      element.style.pointerEvents = "none";
      element.style.zIndex = "99999";
      element.style.opacity = "1";
      document.body.appendChild(element);

      gsap.fromTo(
        element,
        { scale: 0.5, y: 0, rotate: 0 },
        {
          scale: Math.random() * 1.5 + 0.8,
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 350,
          rotate: Math.random() * 360,
          opacity: 0,
          duration: 2.0 + Math.random() * 1.2,
          ease: "power2.out",
          onComplete: () => {
            element.remove();
          },
        }
      );
    }
  };

  // Switch smoothly to Letter screen instead of scrolling
  const handleScrollDown = () => {
    // Blast glowing heart sparkles
    triggerUpwardFountain("💖");
    triggerUpwardFountain("✨");
    setActiveScreen("letter");
  };

  // Switch screens with customized emoji fountains
  const handleTabChange = (tab: "home" | "letter" | "memories" | "promises") => {
    if (tab === activeScreen) return;

    let emoji = "💖";
    if (tab === "home") emoji = "💖";
    else if (tab === "letter") emoji = "💌";
    else if (tab === "memories") emoji = "🌸";
    else if (tab === "promises") emoji = "🔒";

    triggerUpwardFountain(emoji);
    setActiveScreen(tab);
  };

  return (
    <div className="bg-[#050505] min-h-screen relative overflow-x-hidden selection:bg-pink-500/30 selection:text-white font-sans text-white">
      {/* Cinematic ambient background systems from Artistic Flair */}
      <div className="atmosphere" />
      <div className="stars" />
      
      {/* 1. INITIAL SPLASH INTRO (Autoplay bypass) */}
      {!onboarded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95">
          <div className="atmosphere" />
          <div className="stars" />
          
          <div className="max-w-md w-full relative z-10 glass-btn rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-pink-950/20 animate-fade-in border-pink-500/20">
            {/* Top Ring Accent */}
            <div className="absolute top-0 left-10 right-10 h-0.5 bg-gradient-to-r from-pink-500/40 via-rose-500/40 to-pink-500/40" />
            
            <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center mx-auto mb-5 romantic-heart-pulse">
              <i className="fa-solid fa-heart text-2xl"></i>
            </div>

<h1 className="text-2xl md:text-3xl font-serif italic text-pink-100 glow-text font-light tracking-wide mb-2">
               {config.welcome.heading}
             </h1>
             <p className="text-[10px] text-pink-300/80 font-sans tracking-[0.2em] uppercase mb-5 font-semibold">{config.welcome.subheading}</p>
             
             <p className="text-xs md:text-sm text-gray-300/85 leading-relaxed font-sans mb-8">
               {config.welcome.description}
             </p>

             <button
               onClick={handleOnboardEnter}
               className="group relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
               id="welcome-enter-btn"
             >
               <i className="fa-solid fa-volume-high text-xs group-hover:scale-115 transition-transform"></i>
               <span>{config.welcome.buttonText}</span>
             </button>
          </div>
        </div>
      )}

      {/* FLOATING HEADER */}
{onboarded && (
         <>
           <div className="fixed top-8 right-40 z-40 text-[10px] tracking-[0.3em] uppercase opacity-75 font-sans hidden lg:block select-none pointer-events-none text-right text-pink-100 glow-text">
             {config.subtitle}
           </div>
         </>
       )}

      {/* FLOAT MUSIC INSTANCE */}
      {onboarded && (
        <>
          <AudioPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          <FireworksCanvas activeScreen={activeScreen} />
        </>
      )}

      {/* 2. THE HERO 100VH 3D SPACE VIEWPORT WITH ZERO VERTICAL SCROLLING */}
      {onboarded && (
        <div className="relative w-full h-screen overflow-hidden bg-[#050505]" id="hero-space">
          
          {/* GlassHeart3D Canvas Component is persistent across all screens */}
          <GlassHeart3D
            onIntroFinished={() => setIntroFinished(true)}
            hoverActive={hoverActive}
            setHoverActive={setHoverActive}
            playlistPlaying={isPlaying}
          />

          {/* OVERLAY ELEMENTS OVER THREE.JS CANVAS BASED ON STATE */}
          {activeScreen === "home" ? (
            <div className="absolute inset-0 flex flex-col justify-between items-center py-6 md:py-10 px-4 pointer-events-none select-none z-20 animate-fade-in">
              
              {/* Top Tag Line heading */}
              <div className="text-center mt-14 md:mt-12">
                <p className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-pink-400/90 font-bold max-w-sm sm:max-w-lg mb-1 flex items-center justify-center gap-1.5 glow-text">
                  {tagText.split("").map((c, i) => (
                    <span
                      key={i}
                      className="tag-char opacity-0 inline-block filter drop-shadow-[0_0_8px_rgba(255,105,180,0.4)]"
                    >
                      {c === " " ? "\u00a0" : c}
                    </span>
                  ))}
                </p>
              </div>

              {/* Bottom Dedication text & CTA explore button */}
              <div className="text-center w-full max-w-xl pb-16">
                
                {/* Typewriter subtitle: "Dành tặng cho Linh" using elegant serif fontstyle */}
                <h2 className="text-4xl sm:text-6xl font-serif font-light italic tracking-wide mb-3 flex items-center justify-center glow-text-strong text-pink-100">
                  {subtitleText.split("").map((c, i) => (
                    <span
                      key={i}
                      className="sub-char opacity-0 inline-block text-pink-100 filter drop-shadow-[0_2px_12px_rgba(255,20,147,0.35)]"
                      style={{ perspective: 400 }}
                    >
                      {c === " " ? "\u00a0" : c}
                    </span>
                  ))}
                </h2>

                <div className="explore-gate opacity-0 transform translate-y-6 flex flex-col items-center">
                  <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-6" />
                  
                  <p className="text-[10px] sm:text-xs font-sans text-pink-200/60 max-w-xs sm:max-w-md mx-auto mb-8 tracking-[0.18em] uppercase text-center leading-relaxed font-semibold">
                    Anh thắp sáng vũ trụ tình yêu kì diệu này dành riêng tặng em. Rê chuột hoặc chạm xoay khối tim pha lê Linh nhé.
                  </p>

                  {/* Explorer Call to Action style: glass-btn */}
                  <button
                    onClick={handleScrollDown}
                    className="pointer-events-auto px-10 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-3 glass-btn hover:text-pink-300 shadow-xl transition-all cursor-pointer"
                    id="explore-btn"
                  >
                    <span>Mở Lá Thư Tình ❤️</span>
                    <i className="fa-solid fa-chevron-down text-[10px] group-hover:translate-y-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* SUB-VIEW OVERLAYS: Letter, Memories, Promises floated directly over 3D space */
            <div className="absolute inset-0 z-20 flex flex-col justify-start md:justify-center items-center overflow-y-auto px-4 pt-16 pb-28 bg-black/60 backdrop-blur-md animate-fade-in">
              <LoveLetterSection 
                activeTab={activeScreen as any} 
                onNextScreen={(nextTab) => handleTabChange(nextTab as any)}
                isTourCompleted={isTourCompleted}
                onCompleteTour={handleCompleteTour}
              />
            </div>
          )}
          
          {/* Custom congrats celebration toast banner */}
          {showCongratsToast && (
            <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-gradient-to-r from-pink-950/90 to-purple-950/90 border border-pink-500/40 backdrop-blur-xl rounded-2xl p-5 shadow-2xl shadow-pink-500/25 animate-fade-in text-center flex flex-col items-center">
              <span className="text-2xl animate-bounce">🎉💖🏆</span>
              <h4 className="text-sm font-bold text-pink-200 tracking-wide mt-2">Mở Khóa Vũ Trụ Thành Công!</h4>
              <p className="text-xs text-gray-100 mt-1.5 leading-relaxed">
                Chúc mừng Linh thương mến! Em đã mở khóa thành công lối đi của Vũ trụ tình yêu. Hãy sử dụng **Thanh thực đơn Menu** vừa hiện phía dưới để thoải mái tự do chu du nha! 🥰
              </p>
              <button 
                onClick={() => setShowCongratsToast(false)}
                className="mt-3.5 text-[10px] bg-pink-500/20 hover:bg-pink-500/35 text-pink-300 border border-pink-500/30 font-extrabold px-3 py-1 rounded-full pointer-events-auto cursor-pointer uppercase tracking-wider"
              >
                Nhận lấy chìa khóa 🔑
              </button>
            </div>
          )}
          
          {/* PERSISTENT FLOATING NAVIGATION DOCK - Only shown once sequencing is completed */}
          {isTourCompleted && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/75 border border-pink-500/25 px-2 py-1.5 rounded-full flex items-center justify-center gap-1 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-auto w-[90%] max-w-[280px] sm:max-w-sm md:max-w-md border-pink-500/20">
              {[
                { id: "home", label: "Trang Chủ", emoji: "💖" },
                { id: "letter", label: "Thư Tình", emoji: "💌" },
                { id: "memories", label: "Kỷ Niệm", emoji: "🌸" },
                { id: "promises", label: "Lời Hứa", emoji: "🔒" },
              ].map((tab) => {
                const active = activeScreen === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wider cursor-pointer transition-all duration-300 text-center flex items-center justify-center gap-1.5 hover:scale-[1.03] active:scale-[0.97] select-none ${
                      active
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 font-extrabold"
                        : "text-pink-300/70 hover:text-white hover:bg-white/5"
                    }`}
                    id={`nav-dock-${tab.id}`}
                  >
                    <span className="text-xs sm:text-sm">{tab.emoji}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
