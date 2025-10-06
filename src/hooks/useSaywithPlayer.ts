
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// Define the type for your data structure
interface SaywithData {
  mediaUrl: string;
  audioUrl: string;
  srtContent: string;
  name: string;
  mute?: boolean;
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


export const useSaywithPlayer = (data: SaywithData) => {
    const { mediaUrl, audioUrl, srtContent, name, mute } = data;
    const [isPlaying, setIsPlaying] = useState(false);
    const [subtitles, setSubtitles] = useState<SrtLine[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    const [userInteracted, setUserInteracted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const playerStateRef = useRef({ isPlaying: false });

    const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
    const useVideoAsAudioSource = isVideo && mute === false;

    useEffect(() => {
        playerStateRef.current.isPlaying = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        if (srtContent) {
            try {
                const parsedSubtitles = parseSrt(srtContent);
                setSubtitles(parsedSubtitles);
                setCurrentSubtitle(parsedSubtitles[0]?.text || '');
            } catch (error) {
                console.error("Failed to parse SRT data", error);
                setCurrentSubtitle("Could not load subtitles.");
            }
        } else {
             setCurrentSubtitle(name.split(' ').join('\n'));
        }
    }, [srtContent, name]);

    const playMedia = useCallback(() => {
        setIsPlaying(true);
    }, []);

    const pauseMedia = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const handleInitialInteraction = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!userInteracted) {
            setUserInteracted(true);
        }
        setIsPlaying(prev => !prev);
    }, [userInteracted]);

    const seek = useCallback((delta: number) => {
        const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
        if (audioSource) {
            const newTime = audioSource.currentTime + delta;
            audioSource.currentTime = Math.max(0, Math.min(newTime, audioSource.duration || 0));
        }
    }, [useVideoAsAudioSource]);

    const handleSeek = useCallback((value: number[]) => {
        const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
        if (audioSource && audioSource.duration) {
          const newTime = (value[0] / 100) * audioSource.duration;
          audioSource.currentTime = newTime;
          setProgress(value[0]);
        }
    }, [useVideoAsAudioSource]);
    
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        const audioSource = useVideoAsAudioSource ? video : audio;

        if (!userInteracted) return;

        let isCancelled = false;

        const syncPlay = async () => {
            try {
                if (video) await video.play();
                if (audio) await audio.play();
                if (!isCancelled && !playerStateRef.current.isPlaying) {
                    setIsPlaying(true);
                }
            } catch (error) {
                if (!isCancelled && (error as DOMException).name !== 'AbortError') {
                    console.error("Error playing media:", error);
                    setIsPlaying(false);
                }
            }
        };

        if (isPlaying) {
            syncPlay();
        } else {
            video?.pause();
            audio?.pause();
        }

        return () => {
            isCancelled = true;
        }

    }, [isPlaying, userInteracted, useVideoAsAudioSource]);


    useEffect(() => {
        const onVisChange = () => {
            if (document.hidden && playerStateRef.current.isPlaying) {
                pauseMedia();
            }
        }
        document.addEventListener("visibilitychange", onVisChange);

        return () => {
            document.removeEventListener("visibilitychange", onVisChange);
        }
    }, [pauseMedia]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.loop = true;
            video.playsInline = true;
            video.muted = !useVideoAsAudioSource;
        }
         const audio = audioRef.current;
        if (audio) {
            audio.loop = true;
            audio.playsInline = true;
        }
    }, [useVideoAsAudioSource]);

    useEffect(() => {
        const audioSource = useVideoAsAudioSource ? videoRef.current : audioRef.current;
        if (!audioSource) return;

        const timeUpdateHandler = () => {
            const time = audioSource.currentTime;
            const dur = audioSource.duration;
            if (dur > 0) {
                setProgress((time / dur) * 100);
                setCurrentTime(time);
                if (duration !== dur) setDuration(dur);
            }

            if (srtContent) {
                const activeLine = subtitles.find(line => time >= line.startTime && time < line.endTime);
                setCurrentSubtitle(activeLine ? activeLine.text : '');
            }
        };

        const handleAudioEnd = () => {
            if (audioSource) audioSource.currentTime = 0;
            if (videoRef.current && !useVideoAsAudioSource) videoRef.current.currentTime = 0;
            if(playerStateRef.current.isPlaying) {
                playMedia();
            } else {
                pauseMedia();
            }
        };
        
        const handleLoadedMetadata = () => {
             setDuration(audioSource.duration);
        };

        audioSource.addEventListener('timeupdate', timeUpdateHandler);
        audioSource.addEventListener('ended', handleAudioEnd);
        audioSource.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            if (audioSource) {
                audioSource.removeEventListener('timeupdate', timeUpdateHandler);
                audioSource.removeEventListener('ended', handleAudioEnd);
                audioSource.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [subtitles, srtContent, useVideoAsAudioSource, duration, playMedia, pauseMedia]);
    
    return {
        isPlaying,
        currentSubtitle,
        userInteracted,
        progress,
        currentTime,
        duration,
        videoRef,
        audioRef,
        isVideo,
        useVideoAsAudioSource,
        handleInitialInteraction,
        handlePlayPause: handleInitialInteraction,
        seek,
        handleSeek,
        playMedia,
        pauseMedia,
    };
};
