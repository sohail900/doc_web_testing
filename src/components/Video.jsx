import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Loader } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AddVideo from './ui/AddVideo'
import Button from './ui/Button'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

const VideoPlayer = ({ user }) => {
    const [showAddVideo, setShowAddVideo] = useState(false)
    const [videoList, setVideoList] = useState([])
    const [currentVideo, setCurrentVideo] = useState('')
    const [isPlaying, setIsPlaying] = useState(false)
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const videoRef = useRef(null)

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const getAllVideos = async () => {
        setLoading(true)
        try {
            const snapShot = await getDocs(collection(db, 'videos'))
            const docs = snapShot.docs
            setVideoList(
                snapShot.docs.map((doc) => ({ ...doc.data(), key: doc.id }))
            )
            setCurrentVideo(docs[0].data().videoUrl)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getAllVideos()
    }, [])
    return (
        <>
            <section className='mt-20 mb-8 md:px-4 max-md:px-6'>
                <h1 className='text-4xl font-medium text-center mb-5 leading-relaxed'>
                    {t('video_sec.title')}{' '}
                    <span className='text-primary'>
                        {t('video_sec.title_with_primary')}
                    </span>
                </h1>
                <p className='text-center text-base sm:w-[50%] mx-auto'>
                    {t('video_sec.para')}
                </p>
                {user && (
                    <div className='w-fit mx-auto'>
                        <Button
                            className='px-4 mt-2'
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowAddVideo(true)
                            }}
                        >
                            {t('add_videos.upload')}
                        </Button>
                    </div>
                )}
                {loading ? (
                    <Loader
                        size={33}
                        className='mx-auto mt-6 text-primary animate-spin'
                    />
                ) : (
                    <div className='flex flex-col items-center mt-10'>
                        {/* Main Video */}
                        <div className='relative w-full md:w-[600px] h-[500px]'>
                            <video
                                ref={videoRef}
                                src={currentVideo}
                                className='w-full h-full rounded-lg shadow-lg'
                                controls={false} // No default controls
                                autoPlay={false} // No auto play
                            ></video>
                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlayPause}
                                className='absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 p-3 rounded-full text-white'
                            >
                                {isPlaying ? (
                                    <Pause size={24} />
                                ) : (
                                    <Play size={24} />
                                )}
                            </button>
                        </div>

                        {/* Video Thumbnails */}
                        <div className='flex gap-3 mt-5'>
                            {videoList.map((video) => (
                                <div
                                    key={video.key}
                                    className={`w-24 h-16 cursor-pointer rounded-md overflow-hidden ${
                                        currentVideo === video.videoUrl
                                            ? 'border border-primary'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setCurrentVideo(video.videoUrl)
                                    }}
                                >
                                    <video
                                        src={video.videoUrl}
                                        muted
                                        autoPlay={false}
                                        className='w-full h-full object-cover'
                                    ></video>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            {user && showAddVideo && (
                <AddVideo
                    setEditAboutHero={setShowAddVideo}
                    editAboutHero={showAddVideo}
                />
            )}
        </>
    )
}

export default VideoPlayer
