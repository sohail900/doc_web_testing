import { useEffect, useState, useRef } from 'react'
import { Camera, CircleX, FileText, Info, LinkIcon, Loader, Video } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db, storage } from '../../config/firebaseConfig'

const uploadFile = async (file, path) => {
    if (!file) return ''
    const fileRef = ref(storage, `${path}/${file.name}`)
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
}

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
    const [healingVideoUrl, setHealingVideoUrl] = useState('')
    const [recoveryVideoUrl, setRecoveryVideoUrl] = useState('')
    const [healingVideoType, setHealingVideoType] = useState('file') // 'file' or 'url'
    const [recoveryVideoType, setRecoveryVideoType] = useState('file') // 'file' or 'url'
    const [loading, setLoading] = useState(false)
    const [pdfFile, setPdfFile] = useState(null)
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
        }, pdfUrl: ''
    })
    const updateAboutRef = useRef(null)
    const { t } = useTranslation()

    const handlePdfChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error('Please upload only PDF files')
                return
            }
            setPdfFile(file)
        }
    }


    const handleVideoChange = (e, type) => {
        const file = e.target.files[0]
        if (file) {
            if (type === 'healing') {
                setHealingVideoFile(file)
                setHealingVideoUrl('')
            } else {
                setRecoveryVideoFile(file)
                setRecoveryVideoUrl('')
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


    const handleUrlChange = (e, type) => {
        const url = e.target.value
        if (type === 'healing') {
            setHealingVideoUrl(url)
            setHealingVideoFile(null)
        } else {
            setRecoveryVideoUrl(url)
            setRecoveryVideoFile(null)
        }
    }
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

    const toggleVideoInputType = (type) => {
        if (type === 'healing') {
            setHealingVideoType(prev => prev === 'file' ? 'url' : 'file')
            setHealingVideoFile(null)
            setHealingVideoUrl('')
        } else {
            setRecoveryVideoType(prev => prev === 'file' ? 'url' : 'file')
            setRecoveryVideoFile(null)
            setRecoveryVideoUrl('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!imageFile || !formData.injuryTitle || !formData.description || recoveryVideoType == "url" && !recoveryVideoUrl || !recoveryVideoType == "file" && !recoveryVideoFile || !healingVideoType == "url" && !healingVideoType || !healingVideoType == "file" && !healingVideoType) {
                return toast.error('Required fields are missing.')
            }

            // Upload image
            const imageUrl = await uploadFile(imageFile, 'cases/images')

            // Handle healing video
            let finalHealingVideoUrl = ''
            if (healingVideoType === 'file' && healingVideoFile) {
                finalHealingVideoUrl = await uploadFile(healingVideoFile, 'cases/healing-videos')
            } else if (healingVideoType === 'url' && healingVideoUrl) {
                finalHealingVideoUrl = healingVideoUrl
            }

            // Handle recovery video
            let finalRecoveryVideoUrl = ''
            if (recoveryVideoType === 'file' && recoveryVideoFile) {
                finalRecoveryVideoUrl = await uploadFile(recoveryVideoFile, 'cases/recovery-videos')
            } else if (recoveryVideoType === 'url' && recoveryVideoUrl) {
                finalRecoveryVideoUrl = recoveryVideoUrl
            }
            let pdfUrl = ''
            if (pdfFile) {
                pdfUrl = await uploadFile(pdfFile, 'cases/pdfs')
            }
            const finalData = {
                ...formData,
                imageUrl,
                videoUrls: {
                    healingProcess: finalHealingVideoUrl,
                    recovery: finalRecoveryVideoUrl
                },
                pdfUrl,
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
                }, pdfUrl: ""
            })
            setImagePreview(null)
            setImageFile(null)
            setHealingVideoFile(null)
            setRecoveryVideoFile(null)
            setHealingVideoUrl('')
            setRecoveryVideoUrl('')

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
            <form className="space-y-2" onSubmit={handleSubmit}>
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
                    id="injuryTitle"
                    placeholder={t('placeholders.injury_title')}
                    required
                    name="injuryTitle"
                    value={formData.injuryTitle}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">{t("description")}</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    name="description"
                    placeholder={t('placeholders.description')}
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                />

                {/* Additional Fields */}
                <h3 className="text-primary/80 font-medium">{t("preventive")}</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder={t('placeholders.preventive')}
                    name="preventiveMeasures"
                    value={formData.preventiveMeasures}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">{t("healing")}</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder={t('placeholders.healing')}
                    name="healingProcess"
                    value={formData.healingProcess}
                    onChange={handleInputChange}
                />

                {/* Healing Video Upload */}
                {/* Healing Video Section */}
                <div className="space-y-2">
                    <h3 className="text-primary/80 font-medium">{t("healing_video")}</h3>
                    <div className="flex gap-2 pb-2">
                        <Button
                            type="button"
                            dir="ltr"
                            onClick={() => toggleVideoInputType('healing')}
                            className={`flex items-center justify-center flex-1 ${healingVideoType === 'file' ? 'bg-primary' : 'bg-gray-400'}`}
                        >
                            <Video className="w-4 h-4 mr-2" />
                            {t("import_video")}
                        </Button>
                        <Button
                            dir="ltr"
                            type="button"
                            onClick={() => toggleVideoInputType('healing')}
                            className={`flex items-center justify-center flex-1 ${healingVideoType === 'url' ? 'bg-primary' : 'bg-gray-400'}`}
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {t("video_url")}
                        </Button>
                    </div>
                    {healingVideoType === 'file' ? (
                        <label className="flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                            <Video className="w-6 h-6 text-gray-400" />
                            <span className="text-gray-500">
                                {healingVideoFile ? healingVideoFile.name : t("placeholders.upload_healing_process")}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="video/*"
                                onChange={(e) => handleVideoChange(e, 'healing')}
                            />
                        </label>
                    ) : (
                        <input
                            type="url"
                            className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                            placeholder={t('placeholders.healing_url')}
                            value={healingVideoUrl}
                            onChange={(e) => handleUrlChange(e, 'healing')}
                        />
                    )}
                </div>

                <h3 className="text-primary/80 font-medium">{t("treatment")}</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    placeholder={t('placeholders.treatment')}

                    name="treatmentPreparation"
                    value={formData.treatmentPreparation}
                    onChange={handleInputChange}
                />

                <h3 className="text-primary/80 font-medium">{t("recovery")}</h3>
                <textarea
                    className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                    rows="4"
                    name="recoveryGuidelines"
                    placeholder={t('placeholders.recovery')}
                    value={formData.recoveryGuidelines}
                    onChange={handleInputChange}
                />

                {/* Recovery Video Upload */}
                <div className="space-y-2">
                    <h3 className="text-primary/80 font-medium">{t("recovery_video")}</h3>
                    <div className="flex gap-2 pb-2">
                        <Button
                            type="button"
                            dir="ltr"
                            onClick={() => toggleVideoInputType('recovery')}
                            className={`flex-1 flex justify-center items-center ${recoveryVideoType === 'file' ? 'bg-primary' : 'bg-gray-400'}`}
                        >
                            <Video className="w-4 h-4 mr-2" />
                            {t("import_video")}
                        </Button>
                        <Button
                            type="button"
                            dir="ltr"
                            onClick={() => toggleVideoInputType('recovery')}
                            className={`flex-1 flex justify-center items-center ${recoveryVideoType === 'url' ? 'bg-primary' : 'bg-gray-400'}`}
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {t("video_url")}
                        </Button>
                    </div>
                    {recoveryVideoType === 'file' ? (
                        <label className="flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                            <Video className="w-6 h-6 text-gray-400" />
                            <span className="text-gray-500">
                                {recoveryVideoFile ? recoveryVideoFile.name : t("placeholders.upload_recovery_video")}
                            </span>
                            <input
                                type="file"
                                className="hidden"

                                accept="video/*"
                                onChange={(e) => handleVideoChange(e, 'recovery')}
                            />
                        </label>
                    ) : (
                        <input
                            type="url"
                            className="py-3 px-3 w-full rounded-lg bg-black/5 text-black focus-within:outline-primary/30"
                            placeholder={t('placeholders.recovery_url')}
                            value={recoveryVideoUrl}
                            onChange={(e) => handleUrlChange(e, 'recovery')}
                        />
                    )}
                </div>
                {/* Add PDF upload section before the submit button */}
                <div className="space-y-2 py-2">
                    <h3 className="text-primary/80 font-medium">{t("attachment")} (PDF)</h3>
                    <label className="flex items-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-primary cursor-pointer">
                        <FileText className="w-6 h-6 text-gray-400" />
                        <span className="text-gray-500">
                            {pdfFile ? pdfFile.name : t("placeholders.upload_pdf")}
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handlePdfChange}
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
