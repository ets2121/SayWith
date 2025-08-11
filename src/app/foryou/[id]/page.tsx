
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Template1 from '@/components/templates/Template1';
import Template2 from '@/components/templates/Template2';
import Template3 from '@/components/templates/Template3';
import Template4 from '@/components/templates/Template4';
import Template5 from '@/components/templates/Template5';
import Template6 from '@/components/templates/Template6';
import Template7 from '@/components/templates/Template7';
import Template8 from '@/components/templates/Template8';
import Template9 from '@/components/templates/Template9';
import Template10 from '@/components/templates/Template10';
import Template11 from '@/components/templates/Template11';
import Template12 from '@/components/templates/Template12';
import Template13 from '@/components/templates/Template13';
import Template14 from '@/components/templates/Template14';
import Template15 from '@/components/templates/Template15';
import Template16 from '@/components/templates/Template16';
import Template17 from '@/components/templates/Template17';
import Template18 from '@/components/templates/Template18';
import Template19 from '@/components/templates/Template19';
import Template20 from '@/components/templates/Template20';
import Template21 from '@/components/templates/Template21';
import Template22 from '@/components/templates/Template22';
import Template23 from '@/components/templates/Template23';
import Template24 from '@/components/templates/Template24';
import Template25 from '@/components/templates/Template25';
import Template26 from '@/components/templates/Template26';
import Template27 from '@/components/templates/Template27';
import Template28 from '@/components/templates/Template28';
import Template29 from '@/components/templates/Template29';
import Template30 from '@/components/templates/Template30';
import Template31 from '@/components/templates/Template31';
import Template32 from '@/components/templates/Template32';
import Template33 from '@/components/templates/Template33';
import Template34 from '@/components/templates/Template34';
import Template35 from '@/components/templates/Template35';
import Template36 from '@/components/templates/Template36';
import Template37 from '@/components/templates/Template37';
import Template38 from '@/components/templates/Template38';
import Template39 from '@/components/templates/Template39';
import Template40 from '@/components/templates/Template40';

interface SaywithData {
  template: string;
  enabled: boolean;
  mediaUrl: string;
  audioUrl: string;
  srtContent: string;
  name: string;
  mute?: boolean;
}

const loadingTexts = [
    "Loading your content...",
    "Crafting your moment...",
    "Making it unforgettable...",
    "Almost there...",
    "Just a second more..."
];

const LoadingSpinner = () => {
    const [textIndex, setTextIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const textInterval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
                setFade(true);
            }, 500);
        }, 2500);
        return () => clearInterval(textInterval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground overflow-hidden">
             <style jsx>{`
                .animate-spin-reverse {
                    animation-direction: reverse;
                }
                .text-fade-enter {
                    opacity: 0;
                    transition: opacity 500ms ease-in;
                }
                .text-fade-enter-active {
                    opacity: 1;
                }
                .text-fade-exit {
                    opacity: 1;
                    transition: opacity 500ms ease-out;
                }
                .text-fade-exit-active {
                    opacity: 0;
                }
            `}</style>
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-primary/50 rounded-full animate-spin animate-spin-reverse"></div>
                <div className="absolute inset-4 border-4 border-primary/20 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-6 text-lg text-center h-6">
                <span className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                    {loadingTexts[textIndex]}
                </span>
            </div>
        </div>
    );
};


export default function ForYouPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<SaywithData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          const saywithRef = ref(db, `Saywith/${id}`);
          const snapshot = await get(saywithRef);

          if (snapshot.exists()) {
            const fetchedData = snapshot.val() as SaywithData;
            setData(fetchedData);
            if (navigator.serviceWorker.controller) {
                const assetsToCache = [fetchedData.mediaUrl, fetchedData.audioUrl].filter(Boolean);
                navigator.serviceWorker.controller.postMessage({
                    action: 'CACHE_USER_ASSETS',
                    userId: id,
                    assets: assetsToCache
                });
            }
          } else {
            setError('The link you followed may be broken, or the page may have been removed.');
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred while fetching data.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchData();
    }
  }, [id]);
  
  useEffect(() => {
    if (data?.mediaUrl) {
      const isVideo = data.mediaUrl.includes('.mp4') || data.mediaUrl.includes('.mov') || data.mediaUrl.includes('video');
      if (isVideo) {
        const video = document.createElement('video');
        video.src = data.mediaUrl;
        video.onloadeddata = () => setIsMediaLoaded(true);
        video.onerror = () => {
            setError('Failed to load media.');
            setIsMediaLoaded(true); // Stop loading on error
        };
      } else {
        const img = new Image();
        img.src = data.mediaUrl;
        img.onload = () => setIsMediaLoaded(true);
        img.onerror = () => {
            setError('Failed to load media.');
            setIsMediaLoaded(true); // Stop loading on error
        };
      }
    } else if (!isFetching) {
        setIsMediaLoaded(true);
    }
  }, [data, isFetching]);

  const showLoading = isFetching || !isMediaLoaded;

  if (showLoading) {
    return (
        <>
            <Head>
                {data?.mediaUrl && <link rel="preload" href={data.mediaUrl} as={data.mediaUrl.includes('.mp4') ? 'video' : 'image'} />}
                {data?.audioUrl && <link rel="preload" href={data.audioUrl} as="audio" />}
            </Head>
            <LoadingSpinner />
        </>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-red-500 text-center px-4">{error}</p>
      </div>
    );
  }
  
  if (!data) {
    return null; 
  }

  if (!data.enabled) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-yellow-500">This link is currently not active.</p>
      </div>
    );
  }

  const renderTemplate = () => {
    if (!data.mediaUrl || !data.audioUrl) {
      return (
        <div className="flex items-center justify-center h-screen bg-background">
          <p className="text-red-500">Media or audio URL is missing.</p>
        </div>
      );
    }
      
    switch (data.template) {
      case 'template1':
        return <Template1 data={data} />;
      case 'template2':
        return <Template2 data={data} />;
      case 'template3':
        return <Template3 data={data} />;
      case 'template4':
        return <Template4 data={data} />;
      case 'template5':
        return <Template5 data={data} />;
      case 'template6':
        return <Template6 data={data} />;
      case 'template7':
        return <Template7 data={data} />;
      case 'template8':
        return <Template8 data={data} />;
      case 'template9':
        return <Template9 data={data} />;
      case 'template10':
        return <Template10 data={data} />;
      case 'template11':
        return <Template11 data={data} />;
      case 'template12':
        return <Template12 data={data} />;
      case 'template13':
        return <Template13 data={data} />;
      case 'template14':
        return <Template14 data={data} />;
      case 'template15':
        return <Template15 data={data} />;
      case 'template16':
        return <Template16 data={data} />;
      case 'template17':
        return <Template17 data={data} />;
      case 'template18':
        return <Template18 data={data} />;
      case 'template19':
        return <Template19 data={data} />;
      case 'template20':
        return <Template20 data={data} />;
      case 'template21':
        return <Template21 data={data} />;
      case 'template22':
        return <Template22 data={data} />;
      case 'template23':
        return <Template23 data={data} />;
      case 'template24':
        return <Template24 data={data} />;
      case 'template25':
        return <Template25 data={data} />;
      case 'template26':
        return <Template26 data={data} />;
      case 'template27':
        return <Template27 data={data} />;
      case 'template28':
        return <Template28 data={data} />;
      case 'template29':
        return <Template29 data={data} />;
      case 'template30':
        return <Template30 data={data} />;
      case 'template31':
        return <Template31 data={data} />;
      case 'template32':
        return <Template32 data={data} />;
      case 'template33':
        return <Template33 data={data} />;
      case 'template34':
        return <Template34 data={data} />;
      case 'template35':
        return <Template35 data={data} />;
      case 'template36':
        return <Template36 data={data} />;
      case 'template37':
        return <Template37 data={data} />;
      case 'template38':
        return <Template38 data={data} />;
      case 'template39':
        return <Template39 data={data} />;
      case 'template40':
        return <Template40 data={data} />;
      default:
        return (
          <div className="flex items-center justify-center h-screen bg-background">
            <p className="text-red-500">Invalid template specified.</p>
          </div>
        );
    }
  };

  return <>{renderTemplate()}</>;
}
