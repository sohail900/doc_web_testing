import { Globe, Menu, X } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { auth } from '../config/firebaseConfig'

const Navbar = ({ user }) => {
    const {
        t,
        i18n: { changeLanguage, language },
    } = useTranslation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    const navItems = [
        { href: '#', label: t('navbar.home') },
        { href: '#about', label: t('navbar.about') },
        { href: '#work', label: t('navbar.work') },
        { href: '#case', label: t('navbar.case') },
        { href: '#edu', label: t('edu_section.show_btn') },
        { href: '#happyPatient', label: t('navbar.happyPatient') },
    ]

    const logoutHandler = async () => {
        await auth.signOut()
        window.location.reload()
    }

    return (
        <nav className='px-6 md:px-main_padding h-14 flex items-center  justify-between relative'>
            <h1 className='text-2xl text-primary font-semibold'>
                <Link to='/'>{t('navbar.logo')}</Link>
            </h1>

            <div
                className={`lg:hidden fixed top-0 ${isMenuOpen ? 'left-0' : '-left-full'
                    } w-full text-center sm:w-64 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50`}
            >
                <div className='p-4'>
                    <button
                        className='text-primary mb-4 float-left'
                        onClick={toggleMenu}
                        aria-label='Close menu'
                    >
                        <X size={24} />
                    </button>
                    <ul className='flex flex-col gap-4'>
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className='text-black text-base focus-within:font-medium'
                                    onClick={toggleMenu}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        <li className='mx-auto'>
                            <button
                                className='py-2 px-6 rounded-full bg-primary text-white transition-all duration-200 ease-linear flex items-center group gap-2 hover:opacity-70 active:scale-95'
                                onClick={() =>
                                    changeLanguage(language === 'en' ? 'ar' : 'en')
                                }
                            >
                                <span >
                                    {' '}
                                    {language === 'en' ? t('language') : t('language')}
                                </span>
                                <Globe
                                    className='transition-transform duration-[2000ms] ease-in-out group-hover:rotate-[360deg]'
                                    size={20}
                                />
                            </button>

                        </li>
                        <li>                            <button
                            onClick={logoutHandler}
                            className='py-2 px-6 rounded-full bg-primary text-white transition-all duration-200 ease-linear hover:opacity-70 active:scale-95'
                        >
                            {t('navbar.logout')}
                        </button></li>

                    </ul>
                </div>
            </div>
            <ul className='flex items-center gap-2 lg:gap-8 text-black text-base'>
                {navItems.map((item) => (
                    <li key={item.href}>
                        <a
                            href={item.href}
                            className='max-lg:hidden focus-within:font-medium'
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
                {user && (
                    <li className="max-lg:hidden">
                        <button
                            onClick={logoutHandler}
                            className='py-2 px-6 rounded-full bg-primary text-white transition-all duration-200 ease-linear hover:opacity-70 active:scale-95 -mr-5'
                        >
                            {t('navbar.logout')}
                        </button>
                    </li>
                )}
                <li className='max-lg:hidden'>
                    <button
                        className='py-2 px-6 rounded-full bg-primary text-white transition-all duration-200 ease-linear flex items-center group gap-2 hover:opacity-70 active:scale-95'
                        onClick={() =>
                            changeLanguage(language === 'en' ? 'ar' : 'en')
                        }
                    >
                        <span className='max-sm:hidden'>
                            {' '}
                            {language === 'en' ? t('language') : t('language')}
                        </span>
                        <Globe
                            className='transition-transform duration-[2000ms] ease-in-out group-hover:rotate-[360deg]'
                            size={20}
                        />
                    </button>
                </li>
                <li className='lg:hidden'>
                    <button
                        className='py-2 px-6 rounded-full bg-primary text-white transition-all duration-200 ease-linear flex items-center group gap-2 hover:opacity-70 active:scale-95'
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
