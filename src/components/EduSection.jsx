import { useEffect, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import { Loader, Trash2 } from 'lucide-react'
import Button from './ui/Button'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { toast } from 'react-toastify'
import AddInjury from './ui/AddInjury'
import { Link } from 'react-router-dom'

const EduSection = ({ user }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const [showAddInjury, setShowAddInjury] = useState(false)

    const [allInjuries, setAllInjuries] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllInjuries = async () => {
        setLoading(true)
        try {
            const languageDocRef = doc(db, language, 'ed-section')
            const snapShot = await getDocs(
                collection(languageDocRef, 'injuries')
            )
            setAllInjuries(
                snapShot.docs.map((doc) => ({ ...doc.data(), key: doc.id }))
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllInjuries()
    }, [language])
    const handleDelete = async (caseId) => {
        try {
            const injuryDocRef = doc(
                db,
                language,
                'ed-section',
                'injuries',
                caseId
            )
            await deleteDoc(injuryDocRef)
            setAllInjuries(allInjuries.filter((item) => item.key !== caseId))
            toast.success(t('injury_delete_message'))
        } catch (error) {
            console.error('Error deleting case:', error)
            toast.error('Error deleting case')
        }
    }
    return (
        <>
            <section className='mt-20 mb-2 md:px-4 max-md:px-6' id='edu'>
                <h1 className='w-fit text-lg py-2 px-6 rounded-full bg-primary text-white mx-auto mb-3'>
                    {t('edu_section.show_btn')}
                </h1>
                <h1 className='text-4xl font-medium text-center mb-5 leading-relaxed'>
                    {t('edu_section.title')}{' '}
                    <span className='text-primary block'>
                        {' '}
                        {t('edu_section.title_with_primary')}
                    </span>
                </h1>
                {user && (
                    <div className='w-fit mx-auto mb-4'>
                        <Button
                            className='px-4 mt-2'
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowAddInjury(true)
                            }}
                        >
                            {t('add_injuries.button')}
                        </Button>
                    </div>
                )}
                {/* Swiper Slider */}
                {loading ? (
                    <Loader
                        size={33}
                        className='mx-auto mt-6 text-primary animate-spin'
                    />
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        navigation
                        spaceBetween={30}
                        slidesPerView={1}
                        dir='ltr'
                        breakpoints={{
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 35,
                            },
                            900: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                            },
                            442: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                        }}
                        className=' mt-8'
                    >
                        {allInjuries.map((caseItem) => (
                            <SwiperSlide key={caseItem.key} className='py-2 '>
                                <div className='relative flex flex-col bg-white rounded-xl shadow-lg sm:h-[350px] overflow-hidden'>
                                    {user && (
                                        <div className='absolute right-5 top-3 size-10 rounded-xl bg-white grid place-items-center'>
                                            <Trash2
                                                className=' text-red-600 cursor-pointer'
                                                onClick={() =>
                                                    handleDelete(caseItem.key)
                                                }
                                                size={23}
                                            />
                                        </div>
                                    )}
                                    {/* Image Section */}
                                    <div className='h-1/2'>
                                        <img
                                            src={caseItem.imageUrl}
                                            alt={'case image'}
                                            loading='lazy'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    {/* Content Section */}
                                    <div className='h-1/2 flex flex-col justify-center px-6 py-2'>
                                        <Link
                                            to={`/injury-details/${caseItem.key}`}
                                            className='text-xl font-semibold text-black hover:underline hover:text-primary w-fit'
                                        >
                                            {caseItem.injuryTitle}
                                        </Link>

                                        <p
                                            className={`text-gray-600 mt-2 text-ellipsis line-clamp-3`}
                                        >
                                            {caseItem.description}{' '}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>
            {user && showAddInjury && (
                <AddInjury
                    setEditAboutHero={setShowAddInjury}
                    language={language}
                    editAboutHero={showAddInjury}
                    getAllInjuries={getAllInjuries}
                />
            )}
        </>
    )
}

export default EduSection
