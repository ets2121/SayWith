
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

// Define the type for your data structure
interface SaywithData {
  template: string;
  enabled: boolean;
  mediaUrl: string;
  audioUrl: string;
  srtContent: string;
  name: string;
  mute?: boolean;
}

export default function ForYouPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<SaywithData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const saywithRef = ref(db, `Saywith/${id}`);
          const snapshot = await get(saywithRef);

          if (snapshot.exists()) {
            const fetchedData = snapshot.val() as SaywithData;
            setData(fetchedData);
          } else {
            setError('The link you followed may be broken, or the page may have been removed.');
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred while fetching data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
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
