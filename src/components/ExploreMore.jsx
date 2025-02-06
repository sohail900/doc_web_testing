import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './ui/Button'

const ExploreMore = ({ setEditAboutHero, user }) => {
    const { t } = useTranslation()
    return (
        <section className='w-full flex justify-center items-center gap-2 flex-col mb-20'>
            <img src='/assets/explore_more.png' alt='explore-more' width={20} />
            <h2 className='font-medium text-sm'>{t('explore_more')}</h2>
            {user && (
                <div className='px-main_padding w-fit mt-2'>
                    <Button
                        className='px-4'
                        onClick={(e) => {
                            e.stopPropagation()
                            setEditAboutHero((pre) => !pre)
                        }}
                    >
                        {t('edit_hero_about')}
                    </Button>
                </div>
            )}
        </section>
    )
}

export default ExploreMore
