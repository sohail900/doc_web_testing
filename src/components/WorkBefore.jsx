import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const WorkBefore = () => {
    const [contentSlider, setContentSlider] = useState(0)
    const { t } = useTranslation()
    const hospitalsData = [
        {
            id: 1,
            name: t('experience.experience1.title'),
            image: '/assets/hospitals/kingFaisalHospital.jpg',
            experience: t('experience.experience1.experience'),
        },
        {
            id: 2,
            name: t('experience.experience2.title'),
            image: '/assets/hospitals/mohKingHospital.jpg',
            experience: t('experience.experience2.experience'),
        },
        {
            id: 3,
            name: t('experience.experience3.title'),
            image: '/assets/hospitals/solimanHospital.jpg',
            experience: t('experience.experience3.experience'),
        },
    ]

    const increments = () => {
        setContentSlider((prev) =>
            prev < hospitalsData.length - 1 ? prev + 1 : prev
        )
    }
    const decrements = () => {
        setContentSlider((prev) => (prev > 0 ? prev - 1 : prev))
    }

    return (
        <section className='mt-20 px-4 max-md:px-6' id='work'>
            <h1 className='w-fit text-lg py-2 px-6 rounded-full bg-primary text-white mx-auto mb-3'>
                {t('experience.show_btn')}
            </h1>
            <h1 className='text-4xl font-medium text-center mb-5'>
                {t('experience.title')}{' '}
                <span className='text-primary'>
                    {t('experience.title_with_primary')}
                </span>
            </h1>
            {/* hopsitals */}
            <div className='flex justify-center max-sm:flex-col max-sm:gap-2 md:items-center mt-8 w-full md:w-[80%] lg:w-[60%] mx-auto'>
                <div className='flex-1 md:h-[340px] flex justify-between flex-col bg-[#F1F5FF] py-4 px-4 rounded-2xl  md:rounded-l-2xl relative'>
                    <div>
                        <h1 className='text-xl font-medium mb-2'>
                            {hospitalsData[contentSlider].name}
                        </h1>
                        <p className='text-base leading-relaxed'>
                            {hospitalsData[contentSlider].experience}
                        </p>
                    </div>
                    <div className='mt-4 flex items-center gap-2 sm:absolute sm:bottom-24'>
                        <button
                            className='size-8 rounded-full grid place-items-center border border-primary text-primary disabled:border-gray-500 disabled:text-gray-500 rtl:order-2'
                            disabled={contentSlider === 0}
                            onClick={decrements}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className='size-8 rounded-full grid place-items-center border border-primary text-primary disabled:border-gray-500 disabled:text-gray-500 rtl:order-1'
                            disabled={
                                contentSlider === hospitalsData.length - 1
                            }
                            onClick={increments}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className='py-2 px-4 w-full rounded-xl bg-white flex justify-between items-center mt-4'>
                        <h1> {t('experience.hospitals')}</h1>
                        <p className='size-10 grid place-items-center rounded-full text-primary border border-primary'>
                            {contentSlider + 1}
                        </p>
                    </div>
                </div>
                <div className='flex-1 md:h-[350px] rounded-2xl overflow-hidden'>
                    <img
                        src={hospitalsData[contentSlider].image}
                        alt='hospitals'
                        className='w-full h-full object-cover'
                    />
                    <p>{hospitalsData[0].paragraph}</p>
                </div>
            </div>
        </section>
    )
}

export default WorkBefore
