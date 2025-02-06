import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { doc, getDoc, collection } from 'firebase/firestore'
import Loading from '../pages/Loading'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import { db } from '../config/firebaseConfig'
import { ArrowLeft } from 'lucide-react'

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
            <p className='mt-5 mx-auto text-primary text-xl font-medium'>
                No data found.
            </p>
        )

    return (
        <>
            <Navbar />
            <div className='w-full px-6 md:px-main_padding'>
                <div className='w-full md:max-w-2xl mx-auto p-5 bg-white shadow-lg rounded-lg'>
                    <Link to='/'>
                        <ArrowLeft size={22} className=' hover:text-primary' />
                    </Link>
                    <h1 className='text-2xl font-bold mb-4 mt-3 text-primary'>
                        {injury.injuryTitle}
                    </h1>
                    {injury.imageUrl && (
                        <img
                            src={injury.imageUrl}
                            alt={injury.injuryTitle}
                            className='w-full h-64 object-cover rounded-md mb-4'
                        />
                    )}
                    <p className='text-gray-700 mb-4'>{injury.description}</p>

                    {injury.isSurgery === 'yes' ? (
                        <div>
                            <h2 className='text-xl font-semibold mt-4'>
                                {t('add_injuries.surgery')}
                            </h2>
                            <p className='text-gray-600 '>
                                {injury.surgeryDetails ||
                                    'No details available'}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2 className='text-xl font-semibold mt-4 text-primary'>
                                {t('add_injuries.how_to_heal')}
                            </h2>
                            <p className='text-gray-600'>
                                {injury.healingMethods ||
                                    'No details available'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default InjuryDetails
