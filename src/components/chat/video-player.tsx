"use client";

import { useState, useRef, type FC, useEffect } from "react";
import { Play, Pause, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const MAX_LOOPS = 3;

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked || !videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = () => {
     if (isLocked || !videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnd = () => {
    const newLoopCount = loopCount + 1;
    setLoopCount(newLoopCount);

    if (newLoopCount < MAX_LOOPS) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
      setIsLocked(true);
      if (videoRef.current) {
         videoRef.current.pause();
      }
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        // We handle looping manually, so we set the native loop to false
        video.loop = false;
    }
  }, []);


  return (
    <div
      className="relative w-full max-w-xs rounded-lg overflow-hidden"
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={src}
        className={cn("w-full h-full object-cover transition-all duration-300", isLocked && "blur-md")}
        onEnded={handleVideoEnd}
        playsInline
      />
       {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
          <button
            onClick={togglePlay}
            className={cn(
                "bg-primary/80 text-primary-foreground rounded-full p-4 hover:bg-primary transition-all",
                isLocked ? "cursor-not-allowed bg-black/50 hover:bg-black/50" : "cursor-pointer"
            )}
            disabled={isLocked}
          >
            {isLocked ? <Lock className="h-8 w-8" /> : <Play className="h-8 w-8 translate-x-0.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
