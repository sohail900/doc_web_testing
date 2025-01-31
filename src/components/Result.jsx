import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react'
import AddResult from './ui/AddResult'
import Button from './ui/Button'
import { db } from '../config/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const Result = ({ user }) => {
    const [showResults, setShowResults] = useState(false)
    const [resultData, setResultData] = useState([])
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const swiperRef = useRef(null) // Store Swiper instance

    const getAllImage = async () => {
        setLoading(true)
        try {
            const snapShot = await getDocs(collection(db, 'results'))
            setResultData(
                snapShot.docs.map((doc) => ({ ...doc.data(), key: doc.id }))
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllImage()
    }, [])
    return (
        <>
            <section className='mt-20 mb-8 md:px-4 max-md:px-6'>
                <h1 className='text-4xl font-medium text-center mb-5 leading-relaxed'>
                    {t('result.title')}{' '}
                    <span className='text-primary'>
                        {t('result.title_with_primary')}
                    </span>
                </h1>
                <p className='text-center text-base sm:w-[50%] mx-auto'>
                    {t('result.para')}
                </p>
                {user && (
                    <div className='w-fit mx-auto'>
                        <Button
                            className='px-4 mt-2'
                            onClick={() => setShowResults(true)}
                        >
                            {t('add_results.button')}
                        </Button>
                    </div>
                )}
                <div className='mt-10 px-2 relative w-full md:w-[640px] mx-auto rounded-xl py-2'>
                    {loading ? (
                        <Loader
                            size={33}
                            className='mx-auto mt-6 text-primary animate-spin'
                        />
                    ) : (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            pagination={{ clickable: true }}
                            spaceBetween={30}
                            slidesPerView={1}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            dir='ltr'
                        >
                            {resultData.map(({ before, after, key }, _) => (
                                <SwiperSlide key={key}>
                                    <div className='w-full h-full mx-auto flex'>
                                        <div className='relative'>
                                            <button className='absolute left-5 bottom-4 w-fit text-base py-1 px-4 rounded-full bg-primary text-white'>
                                                After
                                            </button>
                                            <img
                                                src={after}
                                                className='w-full h-full'
                                            />
                                        </div>
                                        <div className='relative'>
                                            <img
                                                src={before}
                                                className='w-full h-full'
                                            />
                                            <button className='absolute right-5 bottom-4 w-fit text-base py-1 px-4 rounded-full bg-primary text-white'>
                                                Before
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
                <div className='flex justify-center gap-2 items-center'>
                    <div
                        onClick={() => swiperRef.current?.slidePrev()}
                        className='size-12 grid text-primary place-items-center border bg-black/20 rounded-full cursor-pointer active:scale-90 '
                    >
                        <ArrowLeft size={22} />
                    </div>
                    <div
                        onClick={() => swiperRef.current?.slideNext()}
                        className='size-12 text-primary grid place-items-center border bg-black/20 rounded-full cursor-pointer active:scale-90 '
                    >
                        <ArrowRight size={22} />
                    </div>
                </div>
            </section>
            {user && showResults && (
                <AddResult
                    setEditAboutHero={setShowResults}
                    getAllImage={getAllImage}
                />
            )}
        </>
    )
}

export default Result
