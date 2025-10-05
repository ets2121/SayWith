"use client";

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
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
import Template41 from '@/components/templates/Template41';
import Template42 from '@/components/templates/Template42';
import Template43 from '@/components/templates/Template43';
import Template44 from '@/components/templates/Template44';
import Template45 from '@/components/templates/Template45';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

interface SaywithData {
  template: string;
  enabled: boolean;
  mediaUrl: string;
  audioUrl: string;
  srtContent: string;
  name: string;
  mute?: boolean;
}

const Template46 = dynamic(() => import('@/components/templates/Template46'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

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
        setError(null);
        try {
          const response = await fetch(`/api/saywith/${id}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error || 'An error occurred');
            setIsFetching(false);
            return;
          }

          const fetchedData = await response.json();
          setData(fetchedData);
          
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              action: 'SET_USER',
              userId: id,
            });
          }
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'An error occurred while fetching data.');
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
    return <ErrorDisplay message={error} />;
  }
  
  if (!data) {
    return <LoadingSpinner />;
  }

  if (!data.enabled) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-center px-4">
            <p className="text-yellow-500 text-lg">This link is currently not active.</p>
             <Link href="/" passHref>
                <Button className="mt-6">
                    <Home className="mr-2 h-4 w-4" /> Go to Homepage
                </Button>
            </Link>
        </div>
    );
  }

  const renderTemplate = () => {
    if (!data.mediaUrl || !data.audioUrl) {
      return <ErrorDisplay message="Media or audio URL is missing." />;
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
      case 'template41':
        return <Template41 data={data} />;
      case 'template42':
        return <Template42 data={data} />;
      case 'template43':
        return <Template43 data={data} />;
      case 'template44':
        return <Template44 data={data} />;
      case 'template45':
        return <Template45 data={data} />;
      case 'template46':
        return <Template46 data={data} />;
      default:
        return <ErrorDisplay message="Invalid template specified." />;
    }
  };

  return <>{renderTemplate()}</>;
}
