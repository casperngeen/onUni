'use client'

import UniButton from '@/components/overwrite/uni.button'
import UniForm from '@/components/overwrite/uni.form'
import React, { useState } from 'react'
import { Image, InputGroup } from 'react-bootstrap'
import './login.scss'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import AuthRequest from '@/utils/request/auth.request'
import { useRouter } from 'next/navigation'
import RequestError from '@/utils/request/request.error'
import { AuthException, UserException } from '@/utils/request/status.code'

const LoginPage: React.FC<{}> = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const disabled = email === '' || password === '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const enterEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const enterPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const submitLogin = async () => {
        // validate email
        if (!emailPattern.test(email)) {
            setError('Invalid email format');
        } else {
            try {
                await AuthRequest.login({email: email, password: password});
                setError('');
                router.push(`/`);
            } catch (error) {
                if (error instanceof RequestError) {
                    const code = error.getErrorCode();
                    if (code === AuthException.PASSWORD_INCORRECT || 
                        code === UserException.USER_NOT_FOUND
                    ) {
                        setError('Email or password incorrect');
                    }
                } else {
                    setError('Unexpected error occurred');
                }
            }
        }
    }

    return (
        <div className='login-container'>
            <Image className='login-image' src='/login.svg' alt='login-pic' />
            <div className='login-form-container'>
                <Image className='login-form-logo' src='/header-logo.svg' alt='logo'/>
                <div className='login-form'>
                    <div className='login-form-header'>
                        <div className='header-title'>Login</div>
                        <div className='header-description'>Online Learning Management System</div>
                    </div>
                    <div className='login-form-error'>
                        {error}
                    </div>
                    <div className='login-form-fields'>
                        <div className='login-form-field-container'>
                            <UniForm.Group controlId="formBasicEmail">
                                <UniForm.Label>Email address</UniForm.Label>
                                <UniForm.Control type="email" value={email} onChange={enterEmail} placeholder="Enter email" className='email-input-field'/>
                            </UniForm.Group>
                        </div>
                        <div className='login-form-field-container'>
                            <UniForm.Group className="mb-3" controlId="formPassword">
                                <UniForm.Label>Password</UniForm.Label>
                                <div className='password-input-group'>
                                    <UniForm.Control className='password-input-field' value={password} onChange={enterPassword} type={showPassword ? 'text': "password"} placeholder="Enter password" />
                                    <a onClick={togglePasswordVisibility}>
                                        {showPassword ? <EyeSlashFill color='#212529' /> : <EyeFill color='#212529'/>}
                                    </a>
                                </div>
                            </UniForm.Group>
                        </div>
                        <UniButton disabled={disabled} custombutton='confirm' onClick={submitLogin}>Login</UniButton>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default LoginPage