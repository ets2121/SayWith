"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Template1 from '@/components/templates/Template1';

// Define the type for your data structure
interface SaywithData {
  template: string;
  enabled: boolean;
  mediaUrl: string;
  audioUrl: string;
  srtUrl: string;
  name: string;
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
    switch (data.template) {
      case 'template1':
        return <Template1 data={data} />;
      // Add other templates here in the future
      // case 'template2':
      //   return <Template2 data={data} />;
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
