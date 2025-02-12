import { useEffect, useState, useRef } from 'react'
import { Camera, CircleX, Info, Loader, Video } from 'lucide-react'
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
    const [healingVideoFile, setHealingVideoFile] = useState(null)
    const [recoveryVideoFile, setRecoveryVideoFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        injuryTitle: '',
        description: '',
        preventiveMeasures: '',
        healingProcess: '',
        treatmentPreparation: '',
        recoveryGuidelines: '',
        videoUrls: {
            healingProcess: '',
            recovery: ''
        }
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

    const handleVideoChange = (e, type) => {
        const file = e.target.files[0]
        if (file) {
            if (type === 'healing') {
                setHealingVideoFile(file)
            } else {
                setRecoveryVideoFile(file)
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const uploadFile = async (file, path) => {
        if (!file) return ''
        const fileRef = ref(storage, `${path}/${file.name}`)
        await uploadBytes(fileRef, file)
        return await getDownloadURL(fileRef)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!imageFile || !formData.injuryTitle || !formData.description) {
                return toast.error('Required fields are missing.')
            }

            // Upload image and videos
            const [imageUrl, healingVideoUrl, recoveryVideoUrl] = await Promise.all([
                uploadFile(imageFile, 'cases/images'),
                uploadFile(healingVideoFile, 'cases/healing-videos'),
                uploadFile(recoveryVideoFile, 'cases/recovery-videos')
            ])

            const finalData = {
                ...formData,
                imageUrl,
                videoUrls: {
                    healingProcess: healingVideoUrl,
                    recovery: recoveryVideoUrl
                },
                createdAt: serverTimestamp(),
            }

            const languageDocRef = doc(db, language, 'ed-section')
            const casesCollectionRef = collection(languageDocRef, 'injuries')
            await addDoc(casesCollectionRef, finalData)

            toast.success(t('injury_success_message'))

            // Reset form
            setFormData({
                injuryTitle: '',
                description: '',
                preventiveMeasures: '',
                healingProcess: '',
                treatmentPreparation: '',
                recoveryGuidelines: '',
                videoUrls: {
                    healingProcess: '',
                    recovery: ''
                }
            })
            setImagePreview(null)
            setImageFile(null)
            setHealingVideoFile(null)
            setRecoveryVideoFile(null)

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
            setEditAboutHero(false)
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
            className="fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full py-3 px-5 bg-white overflow-y-auto z-10"
            ref={updateAboutRef}
        >
            <CircleX
                className="text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer active:scale-90"
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold">
                    {t('add_injuries.title')}
                </h2>
                <p className="mt-2 mb-2 rounded-lg py-2 px-2 gap-2 bg-primary/10 font-medium border border-primary text-black flex text-sm">
                    <Info size={30} /> {t('note')}
                </p>

                {/* Image Upload Section */}
                <div className="flex flex-col items-center">
                    <label
                        htmlFor="profile-image"
                        className="w-[60%] cursor-pointer group"
                    >
                        <div className="w-full h-60 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Case"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Camera className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                    </label>
                    <input
                        type="file"
                        id="profile-image"
                        required
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Basic Information */}
                <InputField
                    title={t('add_injuries.injuryTitle')}
                    type="text"
                    placeholder="Injury Title"
                    id="injuryTitle"
                    required
                    name="injuryTitle"
                    value={formData.injuryTitle}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">Description</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder="Describe how the injury occurs"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                />

                {/* Additional Fields */}
                <h3 className="text-primary/80 font-medium">Preventive Measures</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder="Provide details on preventive measures"
                    name="preventiveMeasures"
                    value={formData.preventiveMeasures}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">Healing Process</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder="Explain how the injury heals"
                    name="healingProcess"
                    value={formData.healingProcess}
                    onChange={handleInputChange}
                />

                {/* Healing Video Upload */}
                <div className="space-y-2">
                    <h3 className="text-primary/80 font-medium">Healing Process Video (Optional)</h3>
                    <label className="flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                        <Video className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-500">
                            {healingVideoFile ? healingVideoFile.name : 'Upload healing process video'}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => handleVideoChange(e, 'healing')}
                        />
                    </label>
                </div>

                <h3 className="text-primary/80 font-medium">Treatment Preparation</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder="Include preparation steps for treatment"
                    name="treatmentPreparation"
                    value={formData.treatmentPreparation}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">Recovery Guidelines</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder="Provide recovery guidelines"
                    name="recoveryGuidelines"
                    value={formData.recoveryGuidelines}
                    onChange={handleInputChange}
                />

                {/* Recovery Video Upload */}
                <div className="space-y-2">
                    <h3 className="text-primary/80 font-medium">Recovery Video (Optional)</h3>
                    <label className="flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                        <Video className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-500">
                            {recoveryVideoFile ? recoveryVideoFile.name : 'Upload recovery video'}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={(e) => handleVideoChange(e, 'recovery')}
                        />
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={loading || !imageFile || !formData.injuryTitle || !formData.description}
                    className="disabled:bg-gray-500"
                >
                    {loading ? (
                        <Loader
                            size={22}
                            className="animate-spin text-white mx-auto"
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
