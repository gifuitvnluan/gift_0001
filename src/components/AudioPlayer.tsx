/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
// Removed lucide-react in favor of FontAwesome class icons as requested by user

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export interface Track {
  title: string;
  artist: string;
  url: string;
  durationMs: number;
}

export default function AudioPlayer({ isPlaying, setIsPlaying }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const playlist: Track[] = [
    {
      title: "Tender Affection (Piano)",
      artist: "Mixkit Instrumental",
      url: "https://assets.mixkit.co/music/493/493.mp3",
      durationMs: 97000,
    },
    {
      title: "Beautiful Dream (Calm)",
      artist: "Mixkit Cinematic",
      url: "https://assets.mixkit.co/music/688/688.mp3",
      durationMs: 123000,
    },
    {
      title: "Love Is All Around",
      artist: "Acoustic Melody",
      url: "https://assets.mixkit.co/music/815/815.mp3",
      durationMs: 132000,
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay was blocked or audio error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const selectTrack = (idx: number) => {
    setCurrentTrackIndex(idx);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex].url}
        loop
        onEnded={skipTrack}
      />

      {/* Main Player Bar */}
      <div className="flex items-center gap-3 bg-black/40 hover:bg-black/55 border border-pink-500/20 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-lg shadow-pink-900/10 transition-all duration-300">
        
        {/* Animated Bouncing Music Waves */}
        <div className="flex items-end gap-0.5 h-4 w-4 mr-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`bg-pink-400 w-0.5 rounded-full transition-all duration-200 ${
                isPlaying ? "animate-bounce" : "h-1"
              }`}
              style={{
                height: isPlaying ? "100%" : "25%",
                animationDelay: `${bar * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>

        {/* Info label */}
        <div className="hidden sm:flex flex-col text-left max-w-28 overflow-hidden pointer-events-none select-none">
          <span className="text-[10px] text-pink-300 font-mono tracking-wider uppercase font-semibold">Giai điệu lãng mạn</span>
          <span className="text-xs text-white truncate font-medium">
            {playlist[currentTrackIndex].title}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 border-l border-pink-500/15 pl-3">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-1.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-pink-300 transition-colors ${
              showPlaylist ? "bg-white/10 text-pink-400" : ""
            }`}
            title="Danh sách nhạc"
            id="audio-playlist-btn"
          >
            <i className="fa-solid fa-list-ul text-xs"></i>
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 shadow-md shadow-pink-500/20 transition-all"
            title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            id="audio-play-pause-btn"
          >
            {isPlaying ? <i className="fa-solid fa-pause text-xs"></i> : <i className="fa-solid fa-play text-xs pl-0.5"></i>}
          </button>

          <button
            onClick={skipTrack}
            className="p-1.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-pink-300 transition-colors"
            title="Đổi bài"
            id="audio-next-btn"
          >
            <i className="fa-solid fa-forward text-xs"></i>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 group/volume ml-1 hidden md:flex">
            <button
              onClick={toggleMute}
              className="p-1.5 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-pink-300 transition-colors"
              title={isMuted ? "Mở tiếng" : "Tắt tiếng"}
              id="audio-mute-btn"
            >
              {isMuted || volume === 0 ? <i className="fa-solid fa-volume-xmark text-xs"></i> : <i className="fa-solid fa-volume-high text-xs"></i>}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-0 group-hover/volume:w-16 h-1 bg-pink-900/30 accent-pink-500 rounded-lg cursor-pointer transition-all duration-300"
              id="audio-volume-range"
            />
          </div>
        </div>
      </div>

      {/* Playlist Drawer */}
      {showPlaylist && (
        <div className="mt-2 w-64 bg-black/60 border border-pink-500/20 backdrop-blur-xl rounded-2xl p-3 shadow-2xl shadow-pink-950/30 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-2 border-b border-pink-500/10 mb-2">
            <span className="text-xs font-mono font-medium tracking-wider text-pink-300 uppercase">Danh sách phát</span>
            <span className="text-[10px] text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded-full">3 Bản nhạc</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {playlist.map((track, index) => (
              <button
                key={track.title}
                onClick={() => selectTrack(index)}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-xl transition-all ${
                  currentTrackIndex === index
                    ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/20"
                    : "hover:bg-white/5 text-gray-400 hover:text-white border border-transparent"
                }`}
                id={`track-item-${index}`}
              >
                <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${currentTrackIndex === index ? "bg-pink-500/20 text-pink-400" : "bg-white/5 text-gray-500"}`}>
                  <i className="fa-solid fa-music text-[10px]"></i>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-medium truncate">{track.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
