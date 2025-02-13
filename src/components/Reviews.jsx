import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddReviews from './ui/AddReviews'
import Button from './ui/Button'
import { Loader, Trash2 } from 'lucide-react'
import { db } from '../config/firebaseConfig'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Reviews = ({ user }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const [showReviews, setShowReviews] = useState(false)
    const [patientReviews, setPatientReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const getAllReviews = async () => {
        setLoading(true)
        try {
            const languageDocRef = doc(db, language, 'reviews')
            const snapShot = await getDocs(
                collection(languageDocRef, 'allReviews')
            )
            setPatientReviews(
                snapShot.docs.map((doc) => ({ ...doc.data(), key: doc.id }))
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllReviews()
    }, [language])

    const handleDelete = async (caseId) => {
        try {
            const reviewDoc = doc(
                db,
                language,
                'reviews',
                'allReviews',
                caseId
            )
            await deleteDoc(reviewDoc)
            setPatientReviews(patientReviews.filter((item) => item.key !== caseId))
            toast.success(t('review_delete_message'))
        } catch (error) {
            console.error('Error deleting case:', error)
            toast.error('Error deleting case')
        }
    }

    return (
        <>
            <section
                className='px-6 md:px-main_padding mt-20 mb-16'
                id='happyPatient'
            >
                <h1 className='text-4xl font-medium mb-5 text-center'>
                    {t('reviews.title')}{' '}
                    <span className='text-primary'>
                        {t('reviews.title_with_primary')}
                    </span>
                </h1>
                {user && (
                    <div className='w-fit mx-auto'>
                        <Button
                            className='px-4 mt-2'
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowReviews(true)
                            }}
                        >
                            {t('add_reviews.button')}
                        </Button>
                    </div>
                )}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-10 mt-6'>
                    {loading ? (
                        <Loader
                            size={33}
                            className='mx-auto mt-6 text-primary animate-spin'
                        />
                    ) : patientReviews.length === 0 ? (
                        <p className='text-base mt-4 text-primary float-left'>
                            {t('no_reviews')}
                        </p>
                    ) : (
                        patientReviews.map((elem) => {
                            const { key, name, imageUrl, description, role } =
                                elem
                            return (
                                <div
                                    className='w-full relative rounded-xl py-4 px-6 bg-white flex flex-col justify-between'
                                    key={key}
                                >
                                    <p className='text-base text-black/80'>
                                        {description}
                                    </p>
                                    <h1 className='text-xl font-medium mt-3'>
                                        {name}
                                        <span className='block text-primary text-base'>
                                            {role}
                                        </span>
                                    </h1>
                                    <div className='w-16  h-16 overflow-hidden rounded-full bg-white border-[5px] border-white grid place-items-center absolute -bottom-5 rtl:left-5 ltr:right-5'>
                                        <img
                                            src={imageUrl}
                                            alt='profile'
                                            className='w-full h-full object-cover rounded-full'
                                        />
                                    </div>
                                    {user && (
                                        <div className='absolute top-0 -right-0 size-10 rounded-xl bg-white grid place-items-center'>
                                            <Trash2
                                                className=' text-red-600 cursor-pointer'
                                                onClick={() =>
                                                    handleDelete(key)
                                                }
                                                size={23}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </section>
            {user && showReviews && (
                <AddReviews
                    setEditAboutHero={setShowReviews}
                    language={language}
                    editAboutHero={showReviews}
                    getAllReviews={getAllReviews}
                />
            )}
        </>
    )
}

export default Reviews
