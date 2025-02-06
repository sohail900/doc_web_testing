import { useEffect, useState } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import AddCase from './ui/AddCase'
import { Loader, Trash2 } from 'lucide-react'
import Button from './ui/Button'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'
import { toast } from 'react-toastify'

const Cases = ({ user }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const [showAddCase, setShowAddCase] = useState(false)
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllCases = async () => {
        setLoading(true)
        try {
            const languageDocRef = doc(db, language, 'cases')
            const snapShot = await getDocs(
                collection(languageDocRef, 'allCases')
            )
            setCases(
                snapShot.docs.map((doc) => ({ ...doc.data(), key: doc.id }))
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllCases()
    }, [language])
    const handleDelete = async (caseId) => {
        try {
            const caseDocRef = doc(db, language, 'cases', 'allCases', caseId)
            await deleteDoc(caseDocRef)
            setCases(cases.filter((item) => item.key !== caseId))
            toast.success(t('delete_case_message'))
        } catch (error) {
            console.error('Error deleting case:', error)
            toast.error('Error deleting case')
        }
    }
    return (
        <>
            <section className='mt-10 mb-2 md:px-4 max-md:px-6' id='case'>
                <h1 className='w-fit text-lg py-2 px-6 rounded-full bg-primary text-white mx-auto mb-3'>
                    {t('cases.show_btn')}
                </h1>
                <h1 className='text-4xl font-medium text-center mb-5 leading-relaxed'>
                    {t('cases.title')}{' '}
                    <span className='text-primary'>
                        {' '}
                        {t('cases.title_with_primary')}
                    </span>
                </h1>
                <p className='text-center text-base sm:w-[50%] mx-auto'>
                    {' '}
                    {t('cases.para')}
                </p>
                {user && (
                    <div className='w-fit mx-auto'>
                        <Button
                            className='px-4 mt-2'
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowAddCase(true)
                            }}
                        >
                            {t('cases_edit.button')}
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
                        {cases.map((caseItem) => (
                            <SwiperSlide key={caseItem.key}>
                                <div className='relative flex flex-col bg-white rounded-xl shadow-lg sm:h-[350px] overflow-hidden cursor-pointer'>
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
                                        <h3 className='text-xl font-semibold text-blue-600'>
                                            {caseItem.caseTitle}
                                        </h3>
                                        <p className='text-gray-600 mt-2'>
                                            {caseItem.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>
            {user && showAddCase && (
                <AddCase
                    setEditAboutHero={setShowAddCase}
                    showAddCase={showAddCase}
                    language={language}
                    getAllCases={getAllCases}
                />
            )}
        </>
    )
}

export default Cases
