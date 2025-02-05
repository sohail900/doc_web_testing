import React, { useState } from 'react'
import { Camera, CircleX, Loader } from 'lucide-react'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { db, storage } from '../../config/firebaseConfig'

const AddResult = ({ setEditAboutHero, getAllImage }) => {
    const [imagePreview, setImagePreview] = useState({
        before: null,
        after: null,
    })
    const [imageFile, setImageFile] = useState({ before: null, after: null })
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        if (file) {
            const reader = new FileReader()
            setImageFile({ ...imageFile, [name]: file })
            reader.onloadend = () => {
                setImagePreview({ ...imagePreview, [name]: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!imageFile.before || !imageFile.after) {
                throw new Error('Please upload both images')
            }
            const beforeRef = ref(storage, `results/${imageFile.before.name}`)
            const afterRef = ref(storage, `results/${imageFile.after.name}`)
            await uploadBytes(beforeRef, imageFile.before)
            await uploadBytes(afterRef, imageFile.after)
            const beforeImageUrl = await getDownloadURL(beforeRef)
            const afterImageUrl = await getDownloadURL(afterRef)
            const finalData = {
                before: beforeImageUrl,
                after: afterImageUrl,
            }
            const casesCollectionRef = collection(db, 'results')
            await addDoc(casesCollectionRef, finalData)
            await getAllImage()
            toast.success(t('result_success_message'))
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return toast.error(error.message)
            }
            toast.error('Failed to add result')
        } finally {
            setLoading(false)
            setImageFile({ before: null, after: null })
            setImagePreview({ before: null, after: null })
        }
    }
    return (
        <div className='fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full  py-3 px-5 bg-white  overflow-y-auto z-10'>
            <CircleX
                className='text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer '
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className='space-y-6' onSubmit={handleOnSubmit}>
                <h2 className='text-xl font-semibold'>
                    {t('add_results.title')}
                </h2>

                {/* Image Upload Section */}
                <div className='flex gap-2 w-full'>
                    <div className='flex flex-1 flex-col items-center'>
                        <label
                            htmlFor='after_image'
                            className='w-full cursor-pointer group '
                        >
                            <div className='w-full h-60 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative'>
                                {imagePreview.after ? (
                                    <img
                                        src={imagePreview.after}
                                        alt='After'
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <Camera className='w-8 h-8 text-gray-400' />
                                )}
                                <div className='absolute inset-0 bg-black/40 bg-opacity-40  opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                    <span className='text-white text-sm'>
                                        {t('about_hero.photo')}
                                    </span>
                                </div>
                            </div>
                        </label>
                        <input
                            type='file'
                            name='after'
                            required
                            id='after_image'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                        <span className='text-base text-black/80 font-medium mt-2'>
                            {t('add_results.after')}
                        </span>
                    </div>
                    <div className='flex flex-1 flex-col items-center'>
                        <label
                            htmlFor='before_image'
                            className='w-full cursor-pointer group '
                        >
                            <div className='w-full h-60 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative'>
                                {imagePreview.before ? (
                                    <img
                                        src={imagePreview.before}
                                        alt='Before'
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    <Camera className='w-8 h-8 text-gray-400' />
                                )}
                                <div className='absolute inset-0 bg-black/40 bg-opacity-40  opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                    <span className='text-white text-sm'>
                                        {t('about_hero.photo')}
                                    </span>
                                </div>
                            </div>
                        </label>
                        <input
                            type='file'
                            id='before_image'
                            required
                            name='before'
                            className='hidden'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                        <span className='text-base text-black/80 font-medium mt-2'>
                            {t('add_results.before')}
                        </span>
                    </div>
                </div>
                <Button
                    type='submit'
                    disabled={loading || !imageFile.after || !imageFile.before}
                    className='disabled:bg-gray-500'
                >
                    {' '}
                    {loading ? (
                        <Loader
                            size={22}
                            className=' animate-spin text-white mx-auto'
                        />
                    ) : (
                        t('add_results.button')
                    )}
                </Button>
            </form>
        </div>
    )
}

export default AddResult
