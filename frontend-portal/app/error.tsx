'use client'
 
import RequestError from '@/utils/request/request.error'
import { UserException } from '@/utils/request/status.code'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
 
const Error: React.FC<{ error: Error & { digest?: string }, reset: () => void }> = ({error, reset}) => {
    const router = useRouter();    
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        console.log('Error')
        if (error instanceof RequestError) {
            console.log(`Request Error`)
            if (error.getErrorCode() === UserException.UNAUTHORISED_USER) {
                localStorage.removeItem(`accessToken`);
                localStorage.removeItem(`refreshToken`);
                localStorage.removeItem(`username`);
                router.replace(`/login`);
            } else {
                setErrorMessage(error.message);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])
    
    return (
        <div>
        <h2>{errorMessage
            ? `${errorMessage}`
            : `An unexpected error occurred.`
            }</h2>
        <button
            onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
            }
        >
            Try again
        </button>
        </div>
    )
}

export default Error;