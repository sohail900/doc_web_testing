import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from './ui/Button'
import { auth } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'

const LoginCom = () => {
    const { t } = useTranslation()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleOnSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            )
            navigate('/')
            toast.success('Logged in successfully')
        } catch (error) {
            console.log(error)
            toast.error('Failed to login')
        } finally {
            setLoading(false)
        }
    }
    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    return (
        <section className='w-full h-[calc(100vh-3.5rem)] grid place-items-center px-6 md:px-main_padding'>
            <form
                className='w-full sm:w-[370px] h-[400px] rounded-xl py-8 px-5 bg-primary/5 backdrop-blur-xl flex flex-col justify-between'
                onSubmit={handleOnSubmit}
            >
                <h1 className='text-center text-xl text-primary font-medium '>
                    {t('login.title')}
                </h1>
                <div className='w-full'>
                    <label
                        htmlFor='email'
                        className='text-primary/80 font-medium'
                    >
                        {t('login.email')}
                    </label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder={t('login.email')}
                        value={formData.email}
                        onChange={onChangeHandler}
                        dir='ltr'
                        className='mt-1 mb-3 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                    />
                    <label
                        htmlFor='password'
                        className='text-primary/80 font-medium'
                    >
                        {t('login.password')}
                    </label>
                    <input
                        type='password'
                        name='password'
                        dir='ltr'
                        id='password'
                        value={formData.password}
                        onChange={onChangeHandler}
                        placeholder={t('login.password')}
                        className='mt-1 mb-4 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                    />
                </div>
                <Button>
                    {loading ? (
                        <Loader
                            size={22}
                            className=' animate-spin text-white mx-auto'
                        />
                    ) : (
                        t('login.login')
                    )}
                </Button>
            </form>
        </section>
    )
}

export default LoginCom
