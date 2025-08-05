
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Template2Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

interface SrtLine {
  startTime: number;
  endTime: number;
  text: string;
}

const parseSrt = (srtText: string): SrtLine[] => {
    if (!srtText) return [];
    const lines = srtText.trim().split(/\r?\n/);
    const entries: SrtLine[] = [];
    let i = 0;
    while (i < lines.length) {
        if (lines[i] && lines[i].match(/^\d+$/)) {
            i++;
            if (!lines[i]) continue;
            const timeMatch = lines[i].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
            if (timeMatch) {
                const [, h1, m1, s1, ms1, h2, m2, s2, ms2] = timeMatch.map(Number);
                const startTime = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000;
                const endTime = h2 * 3600 + m2 * 60 + s2 + ms2 / 1000;
                i++;
                let text = '';
                while (i < lines.length && lines[i] && lines[i].trim() !== '') {
                    text += (text ? '\n' : '') + lines[i];
                    i++;
                }
                entries.push({ startTime, endTime, text });
            }
        }
        i++;
    }
    return entries;
};

export default function Template2({ data }: Template2Props) {
  const { mediaUrl, audioUrl, srtContent, name, mute } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [userInteracted, setUserInteracted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');

  useEffect(() => {
    if (srtContent) {
      try {
        const parsedSubtitles = parseSrt(srtContent);
        setSubtitles(parsedSubtitles);
      } catch (error) {
        console.error("Failed to parse SRT data", error);
      }
    } else {
        const nameParts = name.split(' ');
        const defaultText = nameParts.join('\n');
        setCurrentSubtitle(defaultText);
    }
  }, [srtContent, name]);

  const playMedia = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioPromise = audio.play();
    const videoPromise = isVideo ? videoRef.current?.play() : Promise.resolve();
    
    if (audioPromise !== undefined) {
      Promise.all([audioPromise, videoPromise]).then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing media:", error);
        setIsPlaying(false);
      });
    }
  }, [isVideo]);

  const pauseMedia = useCallback(() => {
    audioRef.current?.pause();
    if (isVideo) videoRef.current?.pause();
    setIsPlaying(false);
  }, [isVideo]);
  
  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseMedia();
    } else {
      playMedia();
    }
  }, [isPlaying, playMedia, pauseMedia]);

  const handleInitialInteraction = useCallback(() => {
    if (userInteracted) return;
    setUserInteracted(true);
    playMedia();
  }, [userInteracted, playMedia]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onVisChange = () => {
      if (document.hidden) {
        pauseMedia();
      } else if (isPlaying && userInteracted) {
        playMedia();
      }
    }
    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisChange)
    }
  }, [pauseMedia, playMedia, isPlaying, userInteracted]);

  useEffect(() => {
    const video = videoRef.current;
    if(video) {
        video.muted = mute ?? true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = userInteracted;
        if(userInteracted) {
          video.play().catch(e => console.error("Video autoplay failed", e));
        }
    }
  }, [mute, userInteracted]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !srtContent) return;

    const timeUpdateHandler = () => {
        const currentTime = audio.currentTime;
        const activeLine = subtitles.find(line => currentTime >= line.startTime && currentTime < line.endTime);
        
        const newSubtitle = activeLine ? activeLine.text : '';

        setCurrentSubtitle(current => current === newSubtitle ? current : newSubtitle);
    };

    const handleAudioEnd = () => {
        if(srtContent) setCurrentSubtitle('');
        setIsPlaying(false);
        if (audio) {
          audio.currentTime = 0;
        }
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        playMedia();
    }

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
        if (audio) {
          audio.removeEventListener('timeupdate', timeUpdateHandler);
          audio.removeEventListener('ended', handleAudioEnd);
        }
    };
  }, [subtitles, playMedia, srtContent]);

  const MediaComponent = isVideo ? 'video' : 'img';
  const mediaProps = {
      ref: isVideo ? videoRef : undefined,
      src: mediaUrl,
      playsInline: isVideo ? true : undefined,
      muted: isVideo ? true : undefined,
      loop: isVideo ? true : undefined,
      autoPlay: isVideo ? userInteracted : undefined,
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-sans bg-black" onClick={handleInitialInteraction}>
      {mediaUrl && (
        <MediaComponent
          src={mediaUrl}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}

      <div className="relative z-20 flex flex-col h-full items-center justify-center p-4">
        
        <div className="relative w-full max-w-md h-[65vh] max-h-[500px] flex flex-col items-center justify-center text-white">
            <div className="relative w-full h-full border-2 border-white/80 rounded-lg overflow-hidden shadow-2xl">
                 {mediaUrl && <MediaComponent {...mediaProps} className="w-full h-full object-cover" />}
                 <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm text-center">
                    <p className="font-serif text-sm tracking-wider text-white">{name}</p>
                </div>
            </div>
            
            {!userInteracted && !isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center animate-fade-in pointer-events-none">
                    <p className="text-xs font-light tracking-wider opacity-80">Click anywhere to play</p>
                </div>
            )}
        </div>
        
        <div className="text-center mt-6 h-16 z-30">
            {currentSubtitle.split('\n').map((line, index) => (
                <p key={`${currentSubtitle}-${index}`} className="font-serif text-lg text-white font-light tracking-wide leading-tight animate-fade-in" style={{animationDelay: `${index * 200}ms`}}>
                    {line}
                </p>
            ))}
        </div>

        <div className="absolute bottom-6 right-6 pointer-events-auto">
            <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                variant="outline"
                size="icon"
                className="bg-black/20 text-white border-white/80 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-white/20 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1"/>}
            </Button>
        </div>
      </div>
    </div>
  );
}
