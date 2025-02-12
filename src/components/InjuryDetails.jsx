import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc, collection } from 'firebase/firestore'
import Loading from '../pages/Loading'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import { db } from '../config/firebaseConfig'
import { ArrowLeft, Play, Pause } from 'lucide-react'

const VideoPlayer = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const videoRef = useRef(null)

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    return (
        <div className="relative w-full mb-6 group rounded-lg overflow-hidden h-[300px]">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-cover"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            />
            <button
                className={`h-full absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying && !isHovering ? 'opacity-0' : 'opacity-100'
                    } group-hover:opacity-100`}
                onClick={togglePlay}
            >
                {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                ) : (
                    <Play className="w-12 h-12 text-white" />
                )}
            </button>

        </div>
    )
}

const InjuryDetails = () => {
    const { id } = useParams()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const [injury, setInjury] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInjuryDetails = async () => {
            try {
                const languageDocRef = doc(db, language, 'ed-section')
                const casesCollectionRef = collection(
                    languageDocRef,
                    'injuries'
                )
                const injuryDocRef = doc(casesCollectionRef, id)
                const injurySnap = await getDoc(injuryDocRef)

                if (injurySnap.exists()) {
                    setInjury(injurySnap.data())
                } else {
                    console.error('No such document!')
                }
            } catch (error) {
                console.error('Error fetching injury details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchInjuryDetails()
    }, [id, language])

    if (loading) return <Loading />
    if (!injury)
        return (
            <p className="mt-5 mx-auto text-primary text-xl font-medium">
                No data found.
            </p>
        )

    return (
        <>
            <Navbar />
            <div className="w-full px-6 md:px-main_padding">
                <div className="w-full md:max-w-2xl mx-auto p-5 bg-white shadow-lg rounded-lg">
                    <Link to="/">
                        <ArrowLeft size={22} className="hover:text-primary" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-4 mt-3 text-primary">
                        {injury.injuryTitle}
                    </h1>

                    {injury.imageUrl && (
                        <img
                            src={injury.imageUrl}
                            alt={injury.injuryTitle}
                            className="w-full h-64 object-cover rounded-md mb-4"
                        />
                    )}

                    <div className="space-y-4">
                        <section>
                            <h2 className="text-xl font-semibold text-primary">{t("description")}</h2>
                            <p className="text-gray-700">{injury.description}</p>
                        </section>

                        {injury.preventiveMeasures && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary">{t("preventive")}</h2>
                                <p className="text-gray-700">{injury.preventiveMeasures}</p>
                            </section>
                        )}

                        {injury.healingProcess && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary">{t("healing")}</h2>
                                <p className="text-gray-700">{injury.healingProcess}</p>
                            </section>
                        )}

                        {injury.videoUrls?.healingProcess && (
                            <VideoPlayer
                                url={injury.videoUrls.healingProcess}
                            />
                        )}

                        {injury.treatmentPreparation && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary">{t("treatment")}</h2>
                                <p className="text-gray-700">{injury.treatmentPreparation}</p>
                            </section>
                        )}

                        {injury.recoveryGuidelines && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary">{t("recovery")}</h2>
                                <p className="text-gray-700">{injury.recoveryGuidelines}</p>
                            </section>
                        )}

                        {injury.videoUrls?.recovery && (
                            <VideoPlayer
                                url={injury.videoUrls.recovery}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default InjuryDetails
