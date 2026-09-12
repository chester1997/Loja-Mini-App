"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  contentId: string;
  videoUrl: string;
  title: string;
  initialPosition: number;
}

export default function VideoPlayer({ contentId, videoUrl, title, initialPosition }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && initialPosition > 0) {
      video.currentTime = initialPosition;
    }
  }, [initialPosition]);

  const saveProgress = async (completed?: boolean) => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          positionSeconds: video.currentTime,
          durationSeconds: video.duration || 0,
          completed
        })
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [contentId]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-[100] flex flex-col"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <div 
        className={`absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <button 
          onClick={() => {
            saveProgress();
            router.back();
          }}
          className="text-white hover:text-red-500 mr-4 transition"
        >
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-white font-bold text-lg md:text-xl truncate">{title}</h1>
      </div>

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        controls
        autoPlay
        playsInline
        onPause={() => saveProgress()}
        onEnded={() => saveProgress(true)}
      />
    </div>
  );
}
