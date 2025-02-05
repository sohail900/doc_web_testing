import { useTranslation } from 'react-i18next'

const HeroSec = ({ heroAboutData }) => {
    const { t } = useTranslation()
    return (
        <section
            className='w-full h-[calc(100vh-3.5rem)] flex flex-col justify-center px-6 md:px-main_padding '
            id='#'
        >
            <h1 className='text-5xl md:text-7xl font-medium mb-2'>
                {heroAboutData.name}
            </h1>
            <h2 className='text-base font-medium text-black/80 mb-5'>
                {heroAboutData.degree}
            </h2>

            <p className='text-base text-black/80  font-medium md:w-[50%] leading-relaxed'>
                {heroAboutData.heroDesc}
            </p>
            {/* <button className='font-medium mt-8 text-white w-fit rounded-full bg-primary py-3 px-5 flex items-center gap-2 group'>
                {t('makeAppointment')}
                <ArrowRight className='transition-all duration-500 ease-linear group-hover:translate-x-2' />
            </button> */}
        </section>
    )
}

export default HeroSec
