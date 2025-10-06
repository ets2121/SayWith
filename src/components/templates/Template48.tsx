"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { Play, Pause } from 'lucide-react';

interface Template48Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const AudioVisualizer = ({ audioRef, isVideo, useVideoAsAudioSource, videoRef, isPlaying }: { 
    audioRef: React.RefObject<HTMLAudioElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    isVideo: boolean;
    useVideoAsAudioSource: boolean;
    isPlaying: boolean;
 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    
    const audioEl = useVideoAsAudioSource ? videoRef.current : audioRef.current;
    if (!audioEl) return;

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        try {
            if (!sourceRef.current || sourceRef.current.mediaElement !== audioEl) {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
                sourceRef.current.connect(analyserRef.current);
                sourceRef.current.connect(audioContextRef.current.destination);
            }
        } catch (e) {
            console.error("Error connecting audio source:", e);
            return;
        }
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext('2d');
    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      if (canvas && canvasCtx) {
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i];

          const r = barHeight + 25 * (i/bufferLength);
          const g = 250 * (i/bufferLength);
          const b = 50;

          canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
          canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);

          x += barWidth + 1;
        }
      }
    };
    
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, audioRef, videoRef, isVideo, useVideoAsAudioSource]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 filter blur-sm" />;
};


export default function Template48({ data }: Template48Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    userInteracted,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
  } = useSaywithPlayer(data);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const mediaX = useTransform(smoothX, (val) => val * 0.05 * 10);
  const mediaY = useTransform(smoothY, (val) => val * 0.05 * 10);
  const textX = useTransform(smoothX, (val) => val * 0.05 * -5);
  const textY = useTransform(smoothY, (val) => val * 0.05 * -5);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xPos = clientX - left;
    const yPos = clientY - top;
    const xPct = xPos / width - 0.5;
    const yPct = yPos / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-gray-900 text-white font-sans"
      onMouseMove={handleMouseMove}
      onClick={!userInteracted ? handleInitialInteraction : undefined}
    >
        <AudioVisualizer 
            audioRef={audioRef}
            videoRef={videoRef}
            isVideo={isVideo}
            useVideoAsAudioSource={useVideoAsAudioSource}
            isPlaying={isPlaying}
        />
        <div className="absolute inset-0 bg-black/50 z-0" />
      
        {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop crossOrigin="anonymous"/>}

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
            <motion.div 
                className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl bg-black/20 border-2 border-white/10"
                style={{ x: mediaX, y: mediaY }}
            >
                {mediaUrl && (
                    <>
                    {isVideo ? (
                        <video
                        ref={videoRef}
                        src={mediaUrl}
                        playsInline
                        loop
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        />
                    ) : (
                        <img
                        src={mediaUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                        />
                    )}
                    </>
                )}
            </motion.div>

            <motion.div
              className="mt-8 text-center"
              style={{ x: textX, y: textY }}
            >
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white/90 drop-shadow-lg">
                {name}
              </h1>

              <motion.div 
                className="min-h-[56px] mt-3"
                key={currentSubtitle}
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
              >
                 <p className="text-lg text-white/70 drop-shadow-md">
                     {currentSubtitle}
                 </p>
              </motion.div>
            </motion.div>

            <div className="absolute bottom-10">
                <button
                    onClick={(e) => { e.stopPropagation(); handlePlayPause()}}
                    className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    aria-label="Play/Pause"
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>
            </div>
        </div>
    </div>
  );
}
