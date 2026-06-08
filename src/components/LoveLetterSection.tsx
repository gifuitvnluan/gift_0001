/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
// Icons loaded from external FontAwesome CDN as requested by developer
import gsap from "gsap";

interface LoveLetterSectionProps {
  activeTab: "letter" | "memories" | "promises";
  onNextScreen: (nextTab: "letter" | "memories" | "promises") => void;
  isTourCompleted: boolean;
  onCompleteTour: () => void;
}

export default function LoveLetterSection({ activeTab, onNextScreen, isTourCompleted, onCompleteTour }: LoveLetterSectionProps) {
  const [letterState, setLetterState] = useState<"closed" | "opening" | "opened">("closed");
  
  // Typing simulation state
  const letterParagraphs = [
    "Hôm nay là Ngày Phụ nữ Việt Nam 20/10, một ngày đặc biệt để cả thế giới tôn vinh phái đẹp, nhưng với anh, ngày nào có Linh bên cạnh cũng đều là ngày lành ngọt ngào ngọt ngào nhất.",
    "Từ khoảnh khắc em bước rạng ngời vào cuộc đời anh, tất cả những vụn vỡ sầu lặng cũ dường như lùi sâu vào dĩ vãng, nhường chỗ cho niềm tự hào, thắp sáng cả tâm hồn anh. Sự hiền hậu, thấu hiểu và nụ cười rạng rỡ của em chính là chốn bình lặng hoàn hảo nhất để anh luôn nương tựa tìm về sau những âu lo thường nhật của cuộc sống.",
    "Anh đã tạo nên không gian 3D lấp lánh này đại diện cho tình yêu của anh dành cho em. Trái tim pha lê rực đỏ ở trung tâm luôn quay xung quanh những dũng cảm, lời hứa tốt đẹp nhất dành cho em. Dù dòng thời gian có đổi thay, dù vũ trụ xoay chuyển thế nào, tình cảm tròn đầy và khao khát chở che em trong anh vẫn mãi vững bền như khối pha lê ấy.",
    "Chúc người yêu bé bỏng của anh đón chào một ngày 20/10 ngập tràn niềm tin, luôn rạng rõ như ngàn sao trời lấp lánh kia. Hãy nhớ rằng, trong bất kỳ hoàn cảnh nào, phía sau em sẽ luôn có vòng tay của anh vững chãi bảo vệ và yêu chiều em dạt dào nhất."
  ];

  const fullLetterBody = letterParagraphs.join("\n\n");
  const [typedLength, setTypedLength] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize typing when letter reaches "opened" state
  useEffect(() => {
    if (letterState !== "opened") {
      setTypedLength(0);
      setIsTypingComplete(false);
      return;
    }

    let timer: any;
    // Visibly slower, exceptionally elegant and sentimental typing speed (78ms per character)
    const speed = 78; 

    const totalLength = fullLetterBody.length;
    
    const runTyping = () => {
      setTypedLength((prev) => {
        if (prev >= totalLength) {
          setIsTypingComplete(true);
          return totalLength;
        }
        timer = setTimeout(runTyping, speed);
        return prev + 1;
      });
    };

    // Delay typing commencement so the letter card is completely pulled out and opened
    timer = setTimeout(runTyping, 650);

    return () => {
      clearTimeout(timer);
    };
  }, [letterState]);

  // Auto-scroll logic as letter content grows
  useEffect(() => {
    if (containerRef.current && !isTypingComplete) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [typedLength, isTypingComplete]);

  const handleSkipTyping = () => {
    setTypedLength(fullLetterBody.length);
    setIsTypingComplete(true);
  };

  const displayedText = fullLetterBody.slice(0, typedLength);
  const displayedParagraphs = displayedText.split("\n\n");

  const [promises, setPromises] = useState(() => {
    try {
      const saved = localStorage.getItem("love_applet_promises_v3");
      return saved ? JSON.parse(saved) : [
        { id: 1, text: "Luôn bảo vệ và yêu thương em vô điều kiện", locked: false },
        { id: 2, text: "Luôn nhường nhịn và lắng nghe mọi tâm sự của em", locked: false },
        { id: 3, text: "Nắm chặt tay em đi qua mọi giông bão cuộc đời", locked: false },
        { id: 4, text: "Chăm sóc em mỗi khi mệt mỏi hay dỗi hờn", locked: false },
        { id: 5, text: "Luôn dành cho em nụ cười ấm áp nhất mỗi ngày", locked: false },
      ];
    } catch (e) {
      return [
        { id: 1, text: "Luôn bảo vệ và yêu thương em vô điều kiện", locked: false },
        { id: 2, text: "Luôn nhường nhịn và lắng nghe mọi tâm sự của em", locked: false },
        { id: 3, text: "Nắm chặt tay em đi qua mọi giông bão cuộc đời", locked: false },
        { id: 4, text: "Chăm sóc em mỗi khi mệt mỏi hay dỗi hờn", locked: false },
        { id: 5, text: "Luôn dành cho em nụ cười ấm áp nhất mỗi ngày", locked: false },
      ];
    }
  });

  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // Toggle promise lock
  const togglePromise = (id: number) => {
    const updated = promises.map((p) => {
      if (p.id === id) {
        if (!p.locked) {
          // Trigger floating heart effect near element
          triggerEmojiBurst("💖");
        } else {
          // Trigger floating lock unlock effect
          triggerEmojiBurst("🔓");
        }
        return { ...p, locked: !p.locked }; // Toggle lock state
      }
      return p;
    });
    setPromises(updated);
    try {
      localStorage.setItem("love_applet_promises_v3", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper floating love hearts generator
  const triggerEmojiBurst = (emoji: string) => {
    const burstCount = 12;
    for (let i = 0; i < burstCount; i++) {
      const element = document.createElement("div");
      element.innerText = emoji;
      element.style.position = "fixed";
      element.style.left = `${Math.random() * 80 + 10}vw`;
      element.style.top = `${Math.random() * 80 + 10}vh`;
      element.style.fontSize = `${Math.random() * 24 + 16}px`;
      element.style.pointerEvents = "none";
      element.style.zIndex = "99999";
      element.style.opacity = "1";
      document.body.appendChild(element);

      gsap.fromTo(
        element,
        { scale: 0, y: 0, x: 0, opacity: 1 },
        {
          scale: Math.random() * 1.5 + 0.8,
          y: -150 - Math.random() * 150,
          x: (Math.random() - 0.5) * 100,
          opacity: 0,
          duration: 1.5 + Math.random() * 1,
          ease: "power2.out",
          onComplete: () => {
            element.remove();
          },
        }
      );
    }
  };

  // State to track user custom uploaded photos
  const [customPhotos, setCustomPhotos] = useState<{ id: string; url: string; caption: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem("love_applet_custom_photos");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to ~4.5MB to stay within safe localStorage quotas
    if (file.size > 4.5 * 1024 * 1024) {
      alert("Hơi quá dung lượng! Linh chọn hình ảnh nhẹ hơn 4MB để tải lên nhanh và mượt nha 💖");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhotoUrl(reader.result as string);
      setIsAddingPhoto(true);
      setNewPhotoCaption(""); // Reset
    };
    reader.readAsDataURL(file);
  };

  const saveCustomPhoto = () => {
    if (!newPhotoUrl) return;
    const caption = newPhotoCaption.trim() || "Khoảnh khắc tuyệt vời ngọt ngào 💕";
    
    const newPhoto = {
      id: `cust-${Date.now()}`,
      url: newPhotoUrl,
      caption: caption,
      date: "Vừa mới ghi dấu"
    };

    const updated = [newPhoto, ...customPhotos];
    setCustomPhotos(updated);
    localStorage.setItem("love_applet_custom_photos", JSON.stringify(updated));
    triggerEmojiBurst("💖");

    // Close and reset form
    setIsAddingPhoto(false);
    setNewPhotoUrl("");
    setNewPhotoCaption("");
  };

  const deleteCustomPhoto = (id: string) => {
    const updated = customPhotos.filter(p => p.id !== id);
    setCustomPhotos(updated);
    localStorage.setItem("love_applet_custom_photos", JSON.stringify(updated));
    triggerEmojiBurst("⚡");
  };

  const defaultPolaroids = [
    {
      id: "def-photo-1",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=650&auto=format&fit=crop",
      caption: "Cầm tay anh đi khắp thế gian 💖",
      date: "Ngày lành bên em"
    },
    {
      id: "def-photo-2",
      url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=650&auto=format&fit=crop",
      caption: "Tự vai ấm bình lặng giữa ngàn mây trôi 🌸",
      date: "Kỷ niệm êm đềm"
    },
    {
      id: "def-photo-3",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=650&auto=format&fit=crop",
      caption: "Mỗi nụ cười của em là ánh sáng rạng rỡ ✨",
      date: "Giờ khắc đáng nhớ"
    }
  ];

  const allPolaroids = [...customPhotos, ...defaultPolaroids];
  const rotDegrees = ["-rotate-2", "rotate-1.5", "-rotate-1", "rotate-2.5", "-rotate-2.5", "rotate-1"];

  const handleLoverAction = (type: string) => {
    setClickedAction(type);
    if (type === "kiss") {
      triggerEmojiBurst("💋");
    } else if (type === "love") {
      triggerEmojiBurst("❤️");
    } else {
      triggerEmojiBurst("✨");
    }

    setTimeout(() => {
      setClickedAction(null);
    }, 2800);
  };

  const memories = [
    {
      id: "mem-1",
      title: "Khoảnh khắc đầu tiên 🌸",
      desc: "Lần đầu tiên anh nhìn vào mắt em, thế gian xung quanh như ngừng lại. Nụ cười tinh anh tỏa hương sắc riêng biệt khiến tim anh khẽ rung động.",
      tag: "First Date",
    },
    {
      id: "mem-2",
      title: "Nụ cười tỏa nắng ☀️",
      desc: "Nụ cười của em là liều thuốc chữa lành tuyệt diệu nhất. Chỉ cần thấy em vui, mọi mệt mỏi tủi hờn của ngày dài trong anh đều tan biến.",
      tag: "Sweet Smile",
    },
    {
      id: "mem-3",
      title: "Gió mây bình yên 🌅",
      desc: "Cùng nắm tay dạo bước, đón hoàng hôn lắng buông nhuộm hồng bờ vai nhỏ. Những giây phút bình dị bên Linh luôn là báu vật vô giá anh gìn giữ.",
      tag: "Sunset Memories",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto text-center relative z-20 px-4 min-h-[70vh] flex flex-col justify-center items-center py-4 animate-fade-in">
      <div className="w-full relative z-10">
        
        {/* Section Heart Icon */}
        <div className="inline-flex items-center justify-center p-2.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 mb-3 animate-bounce">
          <i className="fa-solid fa-heart text-base"></i>
        </div>

        <h2 className="text-2xl md:text-3.5xl font-sans font-bold tracking-tight bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 bg-clip-text text-transparent mb-1.5 glow-text">
          {activeTab === "letter" && "Bức Thư Tình Gửi Linh"}
          {activeTab === "memories" && "Kỷ Niệm Của Chúng Mình"}
          {activeTab === "promises" && "Giao Ước Định Mệnh"}
        </h2>
        <p className="text-xs md:text-sm text-pink-300/70 font-sans tracking-wide max-w-xl mx-auto mb-6">
          {activeTab === "letter" && "Nơi lưu giữ bức thư tình sâu kín, ngọt ngào dạt dào nhất gửi Linh."}
          {activeTab === "memories" && "Những khoảnh khắc quý giá mà anh luôn trân trọng giữ gìn trong góc tâm hồn."}
          {activeTab === "promises" && "Những lời cam kết chân thành từ sâu thẳm tâm khảm anh luôn dành riêng cho em."}
        </p>

        {/* Tab 1: Interactive Love Envelope Letter */}
        {activeTab === "letter" && (
          <div className="flex flex-col items-center">
            {letterState !== "opened" ? (
              /* High-fidelity 3D interactive envelope with opening state */
              <div className="envelope-3d-container my-6">
                <div
                  onClick={() => {
                    if (letterState === "closed") {
                      setLetterState("opening");
                      triggerEmojiBurst("💖");
                      setTimeout(() => {
                        setLetterState("opened");
                      }, 2000); // 2 seconds to let the flap rotate and paper slide up entirely
                    }
                  }}
                  className={`envelope-wrapper ${letterState === "opening" ? "open" : ""}`}
                  id="envelope-closed"
                >
                  {/* Outer Top flap */}
                  <div className="envelope-flap" />
                  
                  {/* Wax Seal holding the flap together */}
                  <div className="envelope-seal">
                    <i className="fa-solid fa-heart text-[10px] text-pink-100"></i>
                  </div>
                  
                  {/* Outer pocket container */}
                  <div className="envelope-pocket">
                    <div className="envelope-pocket-sides" />
                    <div className="envelope-pocket-bottom" />
                  </div>

                  {/* Pull-out Letter Paper */}
                  <div className="envelope-letter">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 mb-2 relative">
                        <i className="fa-solid fa-gift text-sm animate-pulse text-pink-400"></i>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-pink-100 font-sans tracking-wide">Món Quà Từ Trái Tim</h3>
                      <p className="text-[10px] text-pink-300/60 font-sans mb-3 font-medium">Dear Linh • Vietnamese Women's Day</p>
                      <button className="text-[10px] bg-pink-500/20 border border-pink-500/40 text-pink-200 py-1 px-3.5 rounded-full font-bold tracking-wide duration-300">
                        {letterState === "opening" ? "Đang Mở Thư..." : "Chạm Để Mở Thư ❤️"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Envelope Opened state revealing letter */
              <div
                className="w-full max-w-2xl bg-black/40 border border-pink-500/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl text-left animate-fade-in ring-1 ring-pink-500/10"
                id="envelope-opened"
              >
                {/* Letter Header */}
                <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 px-6 py-4 border-b border-pink-500/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-mono text-pink-300/80 uppercase tracking-widest font-bold">Thư Gửi Người Yêu • 20-10</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isTypingComplete && (
                      <button
                        onClick={handleSkipTyping}
                        className="text-xs text-pink-300 hover:text-pink-100 font-sans tracking-wide cursor-pointer bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/30 transition-all active:scale-95 text-[11px]"
                        id="skip-typing-btn"
                      >
                        ⚡ Hiện Nhanh
                      </button>
                    )}
                    <button
                      onClick={() => setLetterState("closed")}
                      className="text-xs text-pink-300/50 hover:text-pink-300 underline font-mono cursor-pointer"
                      id="close-letter-btn"
                    >
                      Gập thư lại
                    </button>
                  </div>
                </div>

                {/* Letter Content */}
                <div 
                  ref={containerRef}
                  className="p-6 md:p-10 font-sans leading-relaxed text-gray-200 text-sm md:text-base space-y-5 max-h-[460px] overflow-y-auto scrollbar-thin transition-all duration-300"
                >
                  <p className="text-pink-300 font-bold font-sans text-lg">Linh thương mến của anh ❤️,</p>
                  
                  {displayedParagraphs.map((para, idx) => {
                    const isLast = idx === displayedParagraphs.length - 1;
                    return (
                      <p key={idx} className="transition-all duration-300">
                        {para}
                        {isLast && !isTypingComplete && (
                          <span className="inline-block w-1.5 h-4 bg-pink-400 animate-pulse ml-0.5 align-middle" />
                        )}
                      </p>
                    );
                  })}

                  {isTypingComplete && (
                    <div className="text-pink-300 font-bold text-right pt-4 mt-6 border-t border-pink-500/5 animate-fade-in">
                      Yêu Linh hơn ngàn vạn tinh cầu,<br />
                      <span className="text-xs text-gray-400 font-mono font-normal">Chàng trai luôn bảo vệ em</span>
                    </div>
                  )}
                </div>

                {/* Cute Interactive Reaction Buttons */}
                <div className="bg-white/5 border-t border-pink-500/10 p-5 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleLoverAction("kiss")}
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-rose-500/20 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-300 font-medium text-xs md:text-sm active:scale-95 transition-all cursor-pointer"
                    id="btn-reaction-kiss"
                  >
                    Gửi Ngàn Nụ Hôn 💋
                  </button>
                  <button
                    onClick={() => handleLoverAction("love")}
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-pink-500/20 hover:bg-pink-500 hover:text-white border border-pink-500/30 text-pink-300 font-medium text-xs md:text-sm active:scale-95 transition-all cursor-pointer"
                    id="btn-reaction-love"
                  >
                    Yêu Anh Rất Nhiều ❤️
                  </button>
                  <button
                    onClick={() => handleLoverAction("smile")}
                    className="flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-purple-500/20 hover:bg-purple-500 hover:text-white border border-purple-500/30 text-purple-300 font-medium text-xs md:text-sm active:scale-95 transition-all cursor-pointer"
                    id="btn-reaction-smile"
                  >
                    Nụ cười Hạnh Phúc 😊
                  </button>
                </div>
              </div>
            )}

            {/* Reaction Message overlay */}
            {clickedAction && (
              <div className="mt-6 text-pink-300 animate-pulse font-bold text-lg font-sans flex items-center gap-3 justify-center bg-pink-950/20 border border-pink-500/10 py-2 px-6 rounded-full backdrop-blur-sm">
                <i className="fa-solid fa-wand-magic-sparkles text-pink-400"></i>
                <span>
                  {clickedAction === "kiss" && "Chụt! Linh vừa trao gửi nụ hôn cực kỳ ngọt ngào! 😘"}
                  {clickedAction === "love" && "Anh cũng yêu em vô ngần, trọn kiếp này không đổi thay! 💕"}
                  {clickedAction === "smile" && "Nụ cười rạng rỡ của Linh chính là nguồn sống của anh! 🥰"}
                </span>
                <i className="fa-solid fa-wand-magic-sparkles text-pink-400"></i>
              </div>
            )}
          </div>
        )}

        {/* Tab 1 reactions continued or next button */}
        {activeTab === "letter" && letterState === "opened" && (
          <div className="mt-8 text-center animate-fade-in flex flex-col items-center">
            <button
              onClick={() => onNextScreen("memories")}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs tracking-wider uppercase font-extrabold flex items-center gap-2.5 shadow-lg shadow-pink-500/20 duration-300 active:scale-95 cursor-pointer ring-1 ring-pink-400/30"
              id="next-step-memories-btn"
            >
              <span>Xem Kỷ Niệm Của Chúng Mình 🌸</span>
              <i className="fa-solid fa-arrow-right animate-pulse"></i>
            </button>
            <p className="text-[10px] text-pink-300/50 mt-2 font-medium">Bấm để sang màn hình Kỷ niệm tiếp theo</p>
          </div>
        )}

        {/* Tab 2: Memory Lane Grid + Polaroid Scrapbook */}
        {activeTab === "memories" && (
          <div className="space-y-12 animate-fade-in w-full text-left">
            
            {/* 1. Scrapbook Story Text Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="group relative bg-[#0e031a]/85 border border-pink-500/15 hover:border-pink-500/35 rounded-2xl p-6 shadow-xl hover:shadow-pink-900/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                  id={mem.id}
                >
                  {/* Small Top Glowing Ribbon */}
                  <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/20 font-mono tracking-wider font-bold">
                        {mem.tag}
                      </span>
                      <i className="fa-solid fa-face-smile text-pink-400 animate-pulse text-xs"></i>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                      {mem.title}
                    </h3>
                    <p className="text-xs md:text-sm text-pink-200/70 leading-relaxed mb-4">
                      {mem.desc}
                    </p>
                  </div>

                  <div className="text-[10px] text-pink-400/50 font-mono text-right flex items-center justify-end gap-1.5 border-t border-pink-500/10 pt-3">
                    <i className="fa-solid fa-calendar-days text-[9px]"></i>
                    <span>Kỷ niệm trường tồn</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Custom Polaroid Photo Wall */}
            <div className="pt-10 border-t border-pink-500/15 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div className="text-left w-full sm:w-auto">
                  <h3 className="text-lg md:text-xl font-bold text-pink-200 flex items-center gap-2">
                    <i className="fa-solid fa-camera text-pink-400 animate-bounce text-sm"></i>
                    <span>Góc Polaroid Tình Yêu 💖</span>
                  </h3>
                  <p className="text-xs text-pink-300/60 mt-1 max-w-md font-sans">
                    Hãy cùng anh thắp sáng góc kỷ niệm ngọt ngào này. Linh có thể tải lên những tấm hình hạnh phúc của tụi mình bằng nút bên cạnh nha!
                  </p>
                </div>

                {/* File input button styled as premium glass label */}
                <label className="cursor-pointer group flex items-center gap-2 py-2 px-5 rounded-full bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/35 hover:border-pink-500/60 text-pink-200 text-xs font-bold transition-all duration-300 shadow-md">
                  <i className="fa-solid fa-plus text-[10px] group-hover:rotate-90 transition-transform"></i>
                  <span>Tải Ảnh Lên 📸</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Inline dynamic photo details input */}
              {isAddingPhoto && (
                <div className="mb-10 p-5 rounded-2xl bg-pink-950/20 border border-pink-500/35 backdrop-blur-xl text-left animate-fade-in max-w-lg mx-auto">
                  <h4 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <i className="fa-solid fa-wand-magic-sparkles text-[10px] text-pink-300 animate-spin"></i>
                    <span>Tạo Tấm Ảnh Polaroid Kỷ Niệm Mới!</span>
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-pink-500/20 bg-neutral-900 flex-shrink-0 shadow-inner">
                      <img src={newPhotoUrl} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <label className="block text-xs font-semibold text-pink-200">Viết lời chú thích ngọt ngào nhất:</label>
                      <input 
                        type="text" 
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="VD: Chiều hoàng hôn đầy nắng rạng rỡ bên anh... 💕" 
                        className="w-full bg-black/55 border border-pink-500/25 focus:border-pink-500/60 text-white rounded-lg py-2 px-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-pink-500/40 duration-300 pointer-events-auto" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => {
                        setIsAddingPhoto(false);
                        setNewPhotoUrl("");
                        setNewPhotoCaption("");
                      }} 
                      className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 py-1.5 px-3.5 rounded-full cursor-pointer transition-all pointer-events-auto"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      onClick={saveCustomPhoto} 
                      className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white font-bold py-1.5 px-4 rounded-full cursor-pointer transition-all flex items-center gap-1.5 pointer-events-auto shadow-md"
                    >
                      Lưu giữ 💖
                    </button>
                  </div>
                </div>
              )}

              {/* Polaroid Photo Deck Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center mb-6">
                {allPolaroids.map((p, idx) => {
                  const rotClass = rotDegrees[idx % rotDegrees.length];
                  return (
                    <div 
                      key={p.id} 
                      className={`w-[200px] bg-[#fdfdfe] p-3 shadow-2xl rounded-sm hover:scale-[1.06] hover:rotate-0 hover:z-30 transition-all duration-300 transform group relative border border-gray-200/90 ${rotClass}`}
                    >
                      {/* Stick tape decoration */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-5.5 bg-pink-300/25 backdrop-blur-xs border border-pink-100/10 rotate-1 transform origin-center shadow-xs select-none pointer-events-none" />
                      
                      {/* Image Frame panel */}
                      <div className="w-[174px] h-[174px] bg-neutral-900 rounded-sm overflow-hidden relative border border-gray-300/50">
                        <img 
                          src={p.url} 
                          className="w-full h-full object-cover filter brightness-[1.03] contrast-[0.98]" 
                          alt={p.caption} 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 mix-blend-multiply" />
                        
                        {/* Delete button only for customer-added photos */}
                        {p.id.startsWith("cust-") && (
                          <button
                            onClick={() => deleteCustomPhoto(p.id)}
                            className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-rose-600 text-white/95 hover:text-white rounded-full transition-all duration-200 shadow-xl opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto"
                            title="Xóa tấm ảnh này"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        )}
                      </div>
                      
                      {/* Handwritten Custom Caption */}
                      <div className="pt-3.5 px-1 text-center">
                        <p className="font-serif italic text-xs tracking-wide text-neutral-800 min-h-[36px] leading-relaxed break-words select-none font-bold">
                          {p.caption}
                        </p>
                        <div className="text-[7.5px] font-mono tracking-wider text-pink-500/60 uppercase font-bold mt-1 shadow-2xs">
                          {p.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="mt-10 text-center flex flex-col items-center w-full">
              <button
                onClick={() => onNextScreen("promises")}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white text-xs tracking-wider uppercase font-extrabold flex items-center gap-2.5 shadow-lg shadow-pink-500/20 duration-300 active:scale-95 cursor-pointer ring-1 ring-pink-400/30 font-bold"
                id="next-step-promises-btn"
              >
                <span>Gửi Gắm Bản Giao Ước Định Mệnh 🔒</span>
                <i className="fa-solid fa-arrow-right animate-pulse"></i>
              </button>
              <p className="text-[10px] text-pink-300/50 mt-2 font-medium">Bấm để sang màn hình định mệnh giao ước cuối cùng</p>
            </div>

          </div>
        )}

        {/* Tab 3: Interactive Promise Wall */}
        {activeTab === "promises" && (
          <div className="space-y-8 animate-fade-in w-full text-center">
            <div className="max-w-xl mx-auto bg-black/40 border border-pink-500/20 backdrop-blur-xl rounded-3xl p-6 md:p-8 text-left shadow-2xl">
              <h3 className="text-lg font-bold text-pink-200 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-lock text-pink-400 animate-pulse text-xs"></i>
                <span>Giao Ước Định Mệnh</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans mb-6 leading-relaxed">
                Những lời cam kết chân thành từ tâm khảm anh. Hãy chạm vào từng thẻ để &quot;Khóa chặt&quot; 🔒 lời cam kết này lại và cất giữ trong rương kho báu tình yêu mãi mãi nhé.
              </p>

              <div className="flex flex-col gap-3">
                {promises.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => togglePromise(p.id)}
                    className={`group w-full p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 select-none ${
                      p.locked
                        ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/35 text-white animate-pulse"
                        : "bg-[#10041f]/70 border-white/5 text-gray-300 hover:border-pink-500/15"
                    }`}
                    id={`promise-item-${p.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 animate-pulse">
                        {p.locked ? (
                          <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                            <i className="fa-solid fa-circle-check text-pink-400 text-xs"></i>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-pink-500/10 text-gray-500 group-hover:text-pink-400 border border-white/10 group-hover:border-pink-500/20 transition-all" />
                        )}
                      </div>
                      <span className={`text-[13px] md:text-sm ${p.locked ? "font-medium text-pink-100" : ""}`}>
                        {p.text}
                      </span>
                    </div>

                    <div className="text-[10px] uppercase font-mono tracking-wider text-pink-400 flex items-center gap-1 flex-shrink-0">
                      {p.locked ? (
                        <span className="bg-pink-500/15 border border-pink-500/25 px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1 text-pink-300">
                          Đã Khóa 🔒
                        </span>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-pink-300/60 flex items-center gap-0.5 text-[9px]">
                          Chạm để khóa
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center border-t border-pink-500/10 pt-4">
                <span className="text-xs text-pink-300/40 font-mono">
                  Số lượng giao ước đã khóa: {promises.filter((p) => p.locked).length} / {promises.length}
                </span>
              </div>
            </div>

            {/* TOUR COMPLETE ACTION TRIGGER BUTTON */}
            {!isTourCompleted && (
              <div className="mt-8 text-center flex flex-col items-center">
                {promises.filter((p) => p.locked).length === promises.length ? (
                  <div className="animate-bounce">
                    <button
                      onClick={onCompleteTour}
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-pink-500 to-rose-500 hover:brightness-110 text-white text-xs tracking-wider uppercase font-extrabold flex items-center gap-2.5 shadow-2xl shadow-pink-500/40 duration-300 active:scale-95 cursor-pointer ring-2 ring-emerald-300/30 scale-[1.05]"
                      id="complete-tour-grand-btn"
                    >
                      <span>Hoàn Thành Hành Trình Diệu Kỳ ✨❤️</span>
                      <i className="fa-solid fa-heart animate-pulse"></i>
                    </button>
                    <p className="text-[11px] text-emerald-300 mt-3 font-bold max-w-sm leading-relaxed">
                      Tuyệt vời! Linh đã thắp sáng tất cả giao ước rồi kìa! Bấm nút bên trên để mở khóa Menu vũ trụ ngay nhé! 🎉💖
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink-500/20 backdrop-blur-md max-w-sm">
                    <p className="text-xs text-pink-300 font-semibold mb-2 flex items-center justify-center gap-1.5">
                      <i className="fa-solid fa-lock text-pink-400"></i>
                      <span>GIAO ƯỚC CHƯA HOÀN TẤT</span>
                    </p>
                    <p className="text-[11px] text-pink-200/75 leading-relaxed font-medium text-left">
                      Linh thương mến, em hãy chạm vào và thắp sáng hết cả **{promises.length} bản giao ước** ở trên ({promises.filter(p => p.locked).length}/{promises.length}) thì mới có thể kích hoạt hoàn tất hành trình diệu kỳ này nha! 🔓
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
