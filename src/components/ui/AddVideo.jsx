import React, { useEffect, useState, useRef } from 'react'
import { Video, CircleX, Loader } from 'lucide-react'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { db, storage } from '../../config/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify'
import { addDoc, collection } from 'firebase/firestore'

const AddVideo = ({ setEditAboutHero }) => {
    const [videoPreview, setVideoPreview] = useState(null)
    const [videoFile, setVideoFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const fileInputRef = useRef(null) // Ref to access the file input element

    const handleVideoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type.startsWith('video/')) {
                setVideoFile(file)
                const videoUrl = URL.createObjectURL(file)
                setVideoPreview(videoUrl)
            } else {
                alert('Please upload a video file')
                e.target.value = null
            }
        }
    }
    useEffect(() => {
        return () => {
            if (videoPreview) {
                URL.revokeObjectURL(videoPreview)
            }
        }
    }, [videoPreview])

    const handleOnSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (!videoFile) {
                throw new Error('Failed to upload video')
            }
            const videoRef = ref(storage, `videos/${videoFile.name}`)
            await uploadBytes(videoRef, videoFile)
            const videoUrl = await getDownloadURL(videoRef)
            const casesCollectionRef = collection(db, 'videos')
            await addDoc(casesCollectionRef, { videoUrl })
            toast.success(t('video_success_message'))
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return toast.error(error.message)
            }
            toast.error('Failed to add video')
        } finally {
            setLoading(false)
            setVideoFile(null)
            setVideoPreview(null)
            fileInputRef.current.value = null // Reset the file input element
        }
    }

    return (
        <div className='fixed top-0 ltr:right-0 rtl:left-0 w-full sm:w-[500px] h-full  py-3 px-5 bg-white  overflow-y-auto z-10'>
            <CircleX
                className='text-black absolute top-5 ltr:right-5 rtl:left-5 cursor-pointer'
                size={25}
                onClick={() => setEditAboutHero(false)}
            />
            <form className='space-y-6' onSubmit={handleOnSubmit}>
                <h2 className='text-xl font-semibold'>
                    {t('add_videos.title')}
                </h2>

                {/* Video Upload Section */}
                <div className='w-full'>
                    <div className='flex flex-col items-center'>
                        <label
                            htmlFor='video_upload'
                            className='w-full cursor-pointer group'
                        >
                            <div className='w-full h-80 border-2 mx-auto rounded-lg overflow-hidden flex items-center justify-center border-dotted border-primary relative'>
                                {videoPreview ? (
                                    <video
                                        src={videoPreview}
                                        className='w-full h-full object-cover'
                                        controls
                                    >
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                ) : (
                                    <Video className='w-8 h-8 text-gray-400' />
                                )}
                                <div className='absolute inset-0 bg-black/40 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                    <span className='text-white text-sm'></span>
                                </div>
                            </div>
                        </label>
                        <input
                            type='file'
                            id='video_upload'
                            name='video'
                            required
                            className='hidden'
                            accept='video/*'
                            onChange={handleVideoChange}
                            ref={fileInputRef} // Assign the ref to the input element
                        />
                        <span className='text-base text-black/80 font-medium mt-2'>
                            {t('add_videos.video')}
                        </span>
                    </div>
                </div>
                <Button
                    type='submit'
                    disabled={loading || !videoFile}
                    className='disabled:bg-gray-500'
                >
                    {loading ? (
                        <Loader
                            size={22}
                            className=' animate-spin text-white mx-auto'
                        />
                    ) : (
                        t('add_videos.upload')
                    )}
                </Button>
            </form>
        </div>
    )
}

export default AddVideo
