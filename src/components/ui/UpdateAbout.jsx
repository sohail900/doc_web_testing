import React, { useState } from 'react'
import { Camera, CircleX, Info, Loader } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { db, storage } from '../../config/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { toast } from 'react-toastify'

const UpdateAbout = ({ setEditAboutHero, heroAboutData, getHeroAboutData }) => {
    const [imagePreview, setImagePreview] = useState(heroAboutData.imageUrl)
    const [imageFile, setImageFile] = useState(null)
    const [formData, setFormData] = useState({
        name: heroAboutData.name,
        degree: heroAboutData.degree,
        heroDesc: heroAboutData.heroDesc,
        aboutDesc: heroAboutData.aboutDesc,
        experience: heroAboutData.experience,
        cases: heroAboutData.cases,
    })
    const [loading, setLoading] = useState(false)
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
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
                const imageRef = ref(storage, `hero/${imageFile.name}`)
                await uploadBytes(imageRef, imageFile)
                imageUrl = await getDownloadURL(imageRef)
            } else {
                imageUrl = heroAboutData.imageUrl
            }
            const finalData = {
                ...formData,
                imageUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }
            const collectionName = language
            const docRef = doc(db, collectionName, 'hero_about')
            const snapShot = await getDoc(docRef)
            if (snapShot.exists()) {
                await updateDoc(docRef, {
                    ...finalData,
                    updatedAt: serverTimestamp(),
                })
            } else {
                await setDoc(docRef, finalData)
            }
            toast.success('Successfully update data')
            await getHeroAboutData()
        } catch (error) {
            console.error('Error uploading data:', error)
            toast.error('Failed to update data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full py-3 px-5 bg-white overflow-y-auto z-10'>
            <CircleX
                className='text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer'
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className='space-y-6' onSubmit={handleSubmit}>
                <h2 className='text-xl font-semibold'>
                    {t('about_hero.title')}
                </h2>

                <p className='mt-2 mb-2 rounded-lg py-2 px-2 gap-2 bg-primary/10 font-medium border border-primary text-black flex text-sm'>
                    <Info size={30} /> {t('note')}
                </p>

                {/* Image Upload Section */}
                <div className='flex flex-col items-center'>
                    <label
                        htmlFor='profile-image'
                        className='w-[60%] cursor-pointer group'
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
                            <div className='absolute inset-0 bg-black/40 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                <span className='text-white text-sm'>
                                    {t('about_hero.photo')}
                                </span>
                            </div>
                        </div>
                    </label>
                    <input
                        type='file'
                        required
                        id='profile-image'
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
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <InputField
                            title={t('about_hero.degree')}
                            type='text'
                            placeholder='MBBS/Dip in Psychology'
                            id='degree'
                            name='degree'
                            required
                            value={formData.degree}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-primary/80 font-medium'>
                            {t('about_hero.hero_desc')}
                        </label>
                        <textarea
                            className='mt-1 mb-2 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                            rows='2'
                            placeholder='Enter your hero description'
                            name='heroDesc'
                            required
                            value={formData.heroDesc}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='text-primary/80 font-medium'>
                            {t('about_hero.about_desc')}
                        </label>
                        <textarea
                            className='mt-1 mb-2 py-3 px-3 w-full rounded-lg border-none bg-black/5 text-black focus-within:outline-primary/30'
                            rows='4'
                            placeholder='Enter your description'
                            name='aboutDesc'
                            required
                            value={formData.aboutDesc}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex gap-4'>
                        <div>
                            <InputField
                                title={t('about_hero.experience')}
                                type='number'
                                placeholder='30'
                                id='experience'
                                name='experience'
                                required
                                value={formData.experience}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <InputField
                                title={t('about_hero.cases')}
                                type='number'
                                placeholder='10'
                                id='cases'
                                name='cases'
                                required
                                value={formData.cases}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <Button disabled={loading}>
                        {loading ? (
                            <Loader
                                size={22}
                                className=' animate-spin text-white mx-auto'
                            />
                        ) : (
                            t('about_hero.update_btn')
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default UpdateAbout
