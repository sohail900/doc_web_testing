import React from 'react'
import { useTranslation } from 'react-i18next'

const ExploreMore = () => {
    const { t } = useTranslation()
    return (
        <section className='w-full flex justify-center items-center gap-2 flex-col mb-20'>
            <img src='/assets/explore_more.png' alt='explore-more' width={20} />
            <h2 className='font-medium text-sm'>{t('explore_more')}</h2>
        </section>
    )
}

export default ExploreMore
