
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

    const isVideo = mediaUrl?.includes('.mp4') || mediaUrl?.includes('.mov') || mediaUrl?.includes('video');
    const useVideoAsAudioSource = isVideo && mute === false;

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
        const video = videoRef.current;
        const audio = audioRef.current;
        let playPromise: Promise<void> | undefined;

        if (useVideoAsAudioSource && video) {
            playPromise = video.play();
        } else {
            if (video) video.play().catch(e => console.error("Video play failed silent", e));
            if (audio) playPromise = audio.play();
        }

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Error playing media:", error);
                setIsPlaying(false);
            });
        } else if (isVideo) {
             setIsPlaying(true);
        }
    }, [useVideoAsAudioSource, isVideo]);

    const pauseMedia = useCallback(() => {
        videoRef.current?.pause();
        if (!useVideoAsAudioSource) audioRef.current?.pause();
        setIsPlaying(false);
    }, [useVideoAsAudioSource]);

    const handleInitialInteraction = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (userInteracted) {
            if(isPlaying) pauseMedia();
            else playMedia();
        } else {
            setUserInteracted(true);
            playMedia();
        }
    }, [userInteracted, isPlaying, playMedia, pauseMedia]);

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
        const onVisChange = () => {
            if (document.hidden) {
                pauseMedia();
            } else if (isPlaying && userInteracted) {
                playMedia();
            }
        }
        document.addEventListener("visibilitychange", onVisChange);

        const handleOnline = () => {
            if (isPlaying) {
                playMedia();
            }
        };

        const handleOffline = () => {
            if (isPlaying) {
                playMedia(); 
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            document.removeEventListener("visibilitychange", onVisChange);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        }
    }, [pauseMedia, playMedia, isPlaying, userInteracted]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.loop = true;
            video.playsInline = true;
            video.muted = useVideoAsAudioSource ? false : (mute ?? true);
        }
    }, [mute, useVideoAsAudioSource]);

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
            setIsPlaying(false); // Reset playing state
            if (audioSource) audioSource.currentTime = 0; // Reset time
            if (videoRef.current && !useVideoAsAudioSource) videoRef.current.currentTime = 0;
            playMedia(); // Loop
        };

        audioSource.addEventListener('timeupdate', timeUpdateHandler);
        audioSource.addEventListener('ended', handleAudioEnd);
        audioSource.addEventListener('loadedmetadata', () => setDuration(audioSource.duration));

        return () => {
            if (audioSource) {
                audioSource.removeEventListener('timeupdate', timeUpdateHandler);
                audioSource.removeEventListener('ended', handleAudioEnd);
                audioSource.removeEventListener('loadedmetadata', () => setDuration(audioSource.duration));
            }
        };
    }, [subtitles, srtContent, playMedia, useVideoAsAudioSource, duration]);
    
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
