
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-center px-4">
        <p className="text-red-500 text-lg">{message}</p>
        <Link href="/" passHref>
            <Button className="mt-6">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
            </Button>
        </Link>
    </div>
);
