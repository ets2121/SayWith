"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { getTemplateComponent } from '@/components/templates/templateRegistry';
import { type SaywithPlayerData } from '@/hooks/useSaywithPlayer';

export interface SaywithData extends SaywithPlayerData {
  template: string;
  enabled: boolean;
}

export default function ForYouPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<SaywithData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

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

  if (isFetching) {
    return <LoadingSpinner />;
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

  const TemplateComponent = getTemplateComponent(data.template);

  if (!TemplateComponent) {
    return (
      <ErrorDisplay
        message={`Invalid template specified. Value: ${data.template ? `'${data.template}'` : 'no value provided'}`}
      />
    );
  }

  return (
    <>
      {data?.mediaUrl && (
        <link
          rel="preload"
          href={data.mediaUrl}
          as={data.mediaUrl.includes('.mp4') ? 'video' : 'image'}
          fetchPriority="high"
        />
      )}
      {data?.audioUrl && (
        <link rel="preload" href={data.audioUrl} as="audio" fetchPriority="low" />
      )}
      <TemplateComponent data={data} />
    </>
  );
}
