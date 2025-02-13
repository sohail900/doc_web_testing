import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const About = ({ heroAboutData }) => {
    const { t } = useTranslation()
    return (
        <section
            className='w-full md:max-w-7xl mx-auto px-6 py-16 flex  md:items-center max-md:flex-col gap-12'
            id='about'
        >
            {/* Left side - Image and social icons */}
            <div className='md:w-1/2 relative sm:flex sm:justify-center max-sm:mx-auto'>
                <div className='relative max-sm:w-full'>
                    {/* White background rectangle */}

                    {/* Doctor image */}
                    <div className='bg-white rounded-3xl w-[200px] h-[300px] sm:w-[400px] sm:h-[500px] shadow-lg relative overflow-hidden'>
                        <img
                            src={
                                heroAboutData.imageUrl ??
                                `/assets/about_man.png`
                            }
                            alt='Doctor profile'
                            className='w-full h-full  object-cover '
                        />
                    </div>

                    {/* Social media sidebar */}
                    <div className='absolute -right-6 top-8 flex flex-col items-center gap-6 bg-white p-3 rounded-full shadow-md max-sm:hidden'>
                        <div className='flex flex-col gap-6'>
                            <a
                                href='http://facebook.com'
                                target='_blank'
                                className='hover:text-primary transition-colors'
                            >
                                <img
                                    src='/assets/facebook.svg'
                                    alt='Facebook'
                                    className='w-5 h-5'
                                />
                            </a>
                            <a
                                href='http://x.com'
                                target='_blank'
                                className='hover:text-primary transition-colors'
                            >
                                <img
                                    src='/assets/twitter.svg'
                                    alt='Twitter'
                                    className='w-5 h-5'
                                />
                            </a>
                            <a
                                href='http://youtube.com'
                                target='_blank'
                                className='hover:text-primary transition-colors'
                            >
                                <img
                                    src='/assets/youtube.svg'
                                    alt='YouTube'
                                    className='w-5 h-5'
                                />
                            </a>
                        </div>

                        <div className='w-[2px] h-16 bg-primary/20 rounded-full' />

                        <button className='bg-primary p-2 rounded-full text-white hover:bg-primary/90 transition-colors'>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side - Content */}
            <div className='md:w-1/2 space-y-6'>
                <div>
                    <h1 className='text-4xl font-medium'>
                        {t('about.title')}{' '}
                        <span className='text-primary'>
                            {t('about.mini_title')}
                        </span>
                    </h1>
                    <h2 className='text-2xl font-medium mt-4'>
                        {heroAboutData.name}
                    </h2>
                    <p className='text-gray-500 mt-1'>{heroAboutData.degree}</p>
                </div>      <p className='text-gray-600 leading-relaxed text-ellipsis line-clamp-6'>
                    {heroAboutData.aboutDesc}
                </p>
                <span>
                    <ol
                        className={`text-gray-600 leading-relaxed text-ellipsis line-clamp-6 ltr:pl-5 rtl:pr-5 list-disc mt-2`}
                    >
                        <li>
                            <p>{t("experience.experience1.title")}</p>
                        </li>
                        <li>
                            <p>{t("experience.experience2.title")}</p>
                        </li>
                    </ol>
                </span>


                <div className='flex gap-6 mt-8 max-sm:flex-wrap'>
                    <div className='flex-1 bg-primary text-white rounded-2xl p-6 text-center'>
                        <h3 className='text-4xl font-medium mb-2'>
                            {heroAboutData.experience}+
                        </h3>
                        <p className='text-sm'> {t('about.experience')}</p>
                    </div>
                    <div className='flex-1 bg-primary text-white rounded-2xl p-6 text-center'>
                        <h3 className='text-4xl font-medium mb-2'>
                            {heroAboutData.cases}+
                        </h3>
                        <p className='text-sm'> {t('about.cases')}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
