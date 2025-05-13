'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function OptOutAlert( { display = true }: { display?: boolean }) {
    const searchParams = useSearchParams();
    
    const firstRenderOccured = useRef(false);

    useEffect(() => {
        if(firstRenderOccured.current) return;
        firstRenderOccured.current = true;
        const _display = display && searchParams.get('optedOut') === 'true';
        if(_display) {
            location.search = '';
        }
    }, [])
    return <></>;
}