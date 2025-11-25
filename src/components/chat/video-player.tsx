"use client";

import { useState, useRef, type FC } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoEnd = () => {
    // With loop enabled, this will only be called if loop is false
    setIsPlaying(false);
  };

  return (
    <div
      className="relative w-full max-w-xs rounded-lg overflow-hidden cursor-pointer"
      onClick={handleVideoClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline
        loop
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
          <button
            onClick={togglePlay}
            className="bg-primary/80 text-primary-foreground rounded-full p-4 hover:bg-primary transition-all"
          >
            <Play className="h-8 w-8 translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};
