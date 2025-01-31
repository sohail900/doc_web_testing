import React, { useState } from 'react'
import { Camera, CircleX, Info, Loader } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../../config/firebaseConfig'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'

const AddReviews = ({ setEditAboutHero, language, getAllReviews }) => {
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        description: '',
    })
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            setImageFile(file)
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            let imageUrl = ''
            if (imageFile) {
                const imageRef = ref(storage, `reviews/${imageFile.name}`)
                await uploadBytes(imageRef, imageFile)
                imageUrl = await getDownloadURL(imageRef)
            }
            const finalData = {
                ...formData,
                imageUrl,
                createdAt: serverTimestamp(),
            }
            const collectionName = language
            const docRef = doc(db, collectionName, 'reviews')
            const collectionRef = collection(docRef, 'allReviews')
            await addDoc(collectionRef, finalData)
            await getAllReviews()
            toast.success('Successfully update data')
        } catch (error) {
            console.error('Error uploading data:', error)
            toast.error('Failed to update data')
        } finally {
            setLoading(false)
            setImageFile(null)
            setFormData({ name: '', role: '', description: '' })
        }
    }
    return (
        <div className='fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full  py-3 px-5 bg-white  overflow-y-auto z-10'>
            <CircleX
                className='text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer '
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className='space-y-6' onSubmit={handleSubmit}>
                <h2 className='text-xl font-semibold'>
                    {t('add_reviews.title')}
                </h2>
                <p className='mt-2 mb-2 rounded-lg py-2 px-2 gap-2 bg-primary/10 font-medium border border-primary text-black flex text-sm'>
                    <Info size={30} /> {t('note')}
                </p>
                {/* Image Upload Section */}
                <div className='flex flex-col items-center'>
                    <label
                        htmlFor='profile-image'
                        className='w-[60%]  cursor-pointer group '
                    >
                        <div className='w-full h-60 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative'>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt='Profile'
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
                        id='profile-image'
                        required
                        className='hidden'
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    <span className='text-base text-black/50 mt-2'>
                        {t('about_hero.tap_to_edit')}
                    </span>
                </div>

                {/* Form Fields */}
                <div className='space-y-4'>
                    <div>
                        <InputField
                            title={t('about_hero.name')}
                            type='text'
                            placeholder='DR JENNY DEO'
                            id='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            name='name'
                        />
                    </div>

                    <div>
                        <InputField
                            title={t('add_reviews.role')}
                            type='text'
                            placeholder='Psychology'
                            id='role'
                            value={formData.role}
                            onChange={handleInputChange}
                            name='role'
                        />
                    </div>
                    <div>
                        <label
                            className='text-primary/80 font-medium'
                            htmlFor='description'
                        >
                            {t('add_reviews.description')}
                        </label>
                        <textarea
                            className='mt-1 mb-2 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                            name='description'
                            id='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            rows='4'
                            placeholder='Enter your description'
                        />
                    </div>

                    <Button>
                        {loading ? (
                            <Loader
                                size={22}
                                className=' animate-spin text-white mx-auto'
                            />
                        ) : (
                            t('add_reviews.button')
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddReviews
