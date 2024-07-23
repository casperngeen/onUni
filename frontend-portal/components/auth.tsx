import { useAppSelector } from '@/utils/redux/hooks';
import { selectAccessToken } from '@/utils/redux/slicers/auth.slicer';
import { usePathname, useRouter } from 'next/navigation'
import React, { ComponentType, useEffect, useState } from 'react'

function withAuth<P extends object> (WrappedComponent: ComponentType<P>): React.FC<P> {
    return function EnhancedComponent(props: P) {
        const router = useRouter();
        const selector = useAppSelector();

        useEffect(() => {
            const checkToken = () => {
                const token = localStorage.getItem('accessToken')
                if (!token) {
                    router.replace(`/login`);
                }
            }
            const checkTokenInterval = setInterval(checkToken, 1000);

            return () => {
                clearInterval(checkTokenInterval)
            }

        }, [router]);

        return <WrappedComponent {...props} />;
    };
}

export default withAuth;