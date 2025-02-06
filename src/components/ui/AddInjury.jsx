import { useEffect, useState, useRef } from 'react'
import { Camera, CircleX, Info, Loader } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db, storage } from '../../config/firebaseConfig'

const AddInjury = ({
    setEditAboutHero,
    language,
    getAllInjuries,
    editAboutHero,
}) => {
    const [imagePreview, setImagePreview] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isSurgery, setIsSurgery] = useState(false)
    const [formData, setFormData] = useState({
        injuryTitle: '',
        description: '',
        surgeryDetails: '',
        healingMethods: '',
    })
    const updateAboutRef = useRef(null)
    const { t } = useTranslation()

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
            if (
                !imageFile ||
                !formData.injuryTitle ||
                !formData.description ||
                isSurgery === null
            ) {
                return toast.error('All fields are required.')
            }
            let imageUrl = ''

            if (imageFile) {
                const imageRef = ref(storage, `cases/${imageFile.name}`)
                await uploadBytes(imageRef, imageFile)
                imageUrl = await getDownloadURL(imageRef)
            }
            const finalData = {
                ...formData,
                isSurgery: isSurgery,
                imageUrl,
                createdAt: serverTimestamp(),
            }
            const languageDocRef = doc(db, language, 'ed-section')
            const casesCollectionRef = collection(languageDocRef, 'injuries')
            await addDoc(casesCollectionRef, finalData)
            toast.success(t('injury_success_message'))
            setFormData({
                injuryTitle: '',
                description: '',
                surgeryDetails: '',
                healingMethods: '',
            })
            setImagePreview(null)
            setImageFile(null)
            await getAllInjuries()
        } catch (error) {
            console.error('Error uploading case:', error)
            toast.error('Please try again.')
        } finally {
            setLoading(false)
        }
    }
    const onClickEvent = (e) => {
        if (
            updateAboutRef.current &&
            !updateAboutRef.current.contains(e.target)
        ) {
            setEditAboutHero(false) // Close when clicking outside
        }
    }

    useEffect(() => {
        if (editAboutHero) {
            document.addEventListener('click', onClickEvent)
        } else {
            document.removeEventListener('click', onClickEvent)
        }
        return () => document.removeEventListener('click', onClickEvent)
    }, [editAboutHero])
    return (
        <div
            className='fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full py-3 px-5 bg-white overflow-y-auto z-10'
            ref={updateAboutRef}
        >
            <CircleX
                className='text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer active:scale-90'
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className='space-y-6' onSubmit={handleSubmit}>
                <h2 className='text-xl font-semibold'>
                    {t('add_injuries.title')}
                </h2>
                <p className='mt-2 mb-2 rounded-lg py-2 px-2 gap-2 bg-primary/10 font-medium border border-primary text-black flex text-sm'>
                    <Info size={30} /> {t('note')}
                </p>
                <div className='flex flex-col items-center'>
                    <label
                        htmlFor='profile-image'
                        className='w-[60%] cursor-pointer group'
                    >
                        <div className='w-full h-60 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative'>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt='Case'
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <Camera className='w-8 h-8 text-gray-400' />
                            )}
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
                </div>

                <InputField
                    title={t('add_injuries.injuryTitle')}
                    type='text'
                    placeholder='Injury'
                    id='injuryTitle'
                    required
                    name='injuryTitle'
                    value={formData.injuryTitle}
                    onChange={handleInputChange}
                />

                <h3 className='text-primary/80 font-medium'>
                    {t('cases_edit.description')}
                </h3>
                <textarea
                    className='py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30'
                    rows='4'
                    placeholder='Enter your description'
                    name='description'
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                />

                <h3 className='text-lg  text-primary'>
                    {t('add_injuries.surgery')}
                </h3>
                <div className='flex gap-4'>
                    <Button
                        type='button'
                        onClick={() => setIsSurgery(true)}
                        className={`${
                            isSurgery === true ? 'bg-primary' : 'bg-gray-500'
                        }`}
                    >
                        {t('add_injuries.yes')}
                    </Button>
                    <Button
                        type='button'
                        onClick={() => setIsSurgery(false)}
                        className={`${
                            isSurgery === false ? 'bg-primary' : 'bg-gray-500'
                        }`}
                    >
                        {t('add_injuries.no')}
                    </Button>
                </div>

                {isSurgery === true && (
                    <textarea
                        className='mt-2 py-3 px-3 w-full rounded-lg bg-black/5 text-black'
                        rows='3'
                        placeholder='List surgeries done'
                        name='surgeryDetails'
                        required
                        value={formData.surgeryDetails}
                        onChange={handleInputChange}
                    />
                )}
                {isSurgery === false && (
                    <textarea
                        className='mt-2 py-3 px-3 w-full rounded-lg bg-black/5 text-black'
                        rows='3'
                        placeholder='How did you heal?'
                        name='healingMethods'
                        required
                        value={formData.healingMethods}
                        onChange={handleInputChange}
                    />
                )}

                <Button
                    type='submit'
                    disabled={
                        loading ||
                        !imageFile ||
                        !formData.injuryTitle ||
                        !formData.description ||
                        isSurgery === null
                    }
                    className='disabled:bg-gray-500'
                >
                    {loading ? (
                        <Loader
                            size={22}
                            className='animate-spin text-white mx-auto'
                        />
                    ) : (
                        t('add_injuries.button')
                    )}
                </Button>
            </form>
        </div>
    )
}

export default AddInjury
