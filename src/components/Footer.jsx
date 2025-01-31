import React from 'react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { t } = useTranslation()
    return (
        <footer className='bg-[#12171F] text-gray-300 pt-12'>
            <div className='w-full md:max-w-7xl mx-auto px-6'>
                <div className='max-sm:flex max-sm:flex-wrap  sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8'>
                    {/* Logo Section */}
                    <div className='space-y-4 '>
                        <h2 className='text-white text-4xl font-medium'>
                            {t('footer.logo')}
                        </h2>
                        <p className='text-[0.95rem] text-gray-300  leading-relaxed'>
                            {t('footer.para')}
                        </p>
                    </div>

                    {/* Discover Section */}
                    <div className='space-y-3 '>
                        <h3 className='text-white text-xl font-medium'>
                            {t('footer.discover.title')}
                        </h3>
                        <ul className='space-y-2'>
                            <li>
                                <a
                                    href='#'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.discover.home')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#about'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.discover.about')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#case'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.discover.case')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='#work'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.discover.case')}
                                </a>
                            </li>
                            {/* <li>
                                <a
                                    href='#'
                                    className='hover:text-white transition-colors'
                                >
                                    Blogs
                                </a>
                            </li> */}
                            <li>
                                <a
                                    href='#happyPatient'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.discover.happyPatient')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials Section */}
                    <div className='space-y-3 '>
                        <h3 className='text-white text-xl font-medium'>
                            {t('footer.social.title')}
                        </h3>
                        <ul className='space-y-2'>
                            <li>
                                <a
                                    href='http://facebook.com'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.social.facebook')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='http://x.com'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.social.twitter')}
                                </a>
                            </li>
                            <li>
                                <a
                                    href='http://youtube.com'
                                    className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '
                                >
                                    {t('footer.social.youtube')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className='space-y-4 '>
                        <h3 className='text-white text-xl font-medium'>
                            {t('footer.contact.title')}
                        </h3>
                        <ul className='space-y-2 '>
                            <li className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '>
                                info@gmail.com
                            </li>
                            <li className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '>
                                +1 923478474771
                            </li>
                            <li className='hover:text-white transition-colors text-[0.95rem] text-gray-300 '>
                                {' '}
                                {t('footer.contact.location')}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className='mt-12 py-2 border-t border-gray-700'>
                    <p className='text-center text-sm text-gray-500'>
                        {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
