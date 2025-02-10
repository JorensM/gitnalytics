import { useEffect, useState } from 'react';

export default function useHydrated() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    return isClient;
}