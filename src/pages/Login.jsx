import React, { useEffect } from 'react'

import Navbar from '../components/Navbar'
import BackdropLayout from '../components/ui/BackdropLayout'
import Footer from '../components/Footer'
import { useTranslation } from 'react-i18next'
import LoginCom from '../components/LoginCom'
import { auth } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const {
        i18n: { dir, language },
    } = useTranslation()
    const navigate = useNavigate()
    useEffect(() => {
        const subscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/')
            }
        })
        return () => subscribe()
    }, [])
    return (
        <>
            <BackdropLayout />
            <main
                dir={dir()}
                className={`z-50 max-w-[1800px] mx-auto ${
                    language === 'ar' && 'font-sans'
                }`}
            >
                <Navbar />
                <LoginCom />
                <Footer />
            </main>
        </>
    )
}

export default Login
