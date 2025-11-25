"use client";

import { useState, useRef, useEffect, type FC } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
}

export const AudioPlayer: FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full max-w-[250px] bg-pink-500 rounded-full px-4 py-2 text-white">
      <audio ref={audioRef} src={src} preload="metadata" />
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        className="rounded-full bg-transparent text-white hover:bg-white/20 shrink-0 w-8 h-8"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 translate-x-px" />
        )}
      </Button>
      <div className="flex-grow flex items-center gap-2 cursor-pointer" ref={progressBarRef} onClick={handleProgressClick}>
        <div className="w-full bg-pink-400/80 rounded-full h-1 relative">
          <div
            className="bg-white h-1 rounded-full absolute top-0 left-0"
            style={{ width: `${progress}%` }}
          >
            <div className="w-3 h-3 bg-white rounded-full absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </div>
       <span className="text-xs text-white tabular-nums w-10 text-right">
        {formatTime(duration)}
      </span>
    </div>
  );
};
