import React, { useEffect, useState } from 'react'

import About from '../components/About'
import ExploreMore from '../components/ExploreMore'
import HeroSec from '../components/HeroSec'
import Navbar from '../components/Navbar'
import BackdropLayout from '../components/ui/BackdropLayout'
import Footer from '../components/Footer'
import Banner from '../components/Banner'
import Cases from '../components/Cases'
import WorkBefore from '../components/WorkBefore'
import Reviews from '../components/Reviews'
import { useTranslation } from 'react-i18next'
import Result from '../components/Result'
import VideoPlayer from '../components/Video'
import UpdateAbout from '../components/ui/UpdateAbout'
import Button from '../components/ui/Button'
import { auth, db } from '../config/firebaseConfig'
import Loading from './Loading'
import { doc, getDoc } from 'firebase/firestore'
import EduSection from '../components/EduSection'
import { useDocName } from '../hooks/useDocName'

const Home = () => {
    const [editAboutHero, setEditAboutHero] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [heroAboutData, setHeroAboutData] = useState({})
    const { setDocName } = useDocName()
    const {
        i18n: { dir, language },
    } = useTranslation()
    const getHeroAboutData = async () => {
        setLoading(true)
        try {
            const collectionName = language
            const docSnapShot = await getDoc(
                doc(db, collectionName, 'hero_about')
            )
            setHeroAboutData({ ...docSnapShot.data() })
            setDocName(
                docSnapShot.data().name + '! ' + docSnapShot.data().degree
            )
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const subscribe = auth.onAuthStateChanged((user) => {
            setLoading(false)
            if (user) {
                setUser(user)
            }
        })
        return () => subscribe()
    }, [])
    useEffect(() => {
        getHeroAboutData()
    }, [language])

    if (loading) return <Loading />
    return (
        <>
            <BackdropLayout />
            <main
                dir={dir()}
                className={`z-50 max-w-[1800px] mx-auto ${language === 'ar' && 'font-sans'
                    }`}
            >
                <Navbar user={user} />
                <HeroSec heroAboutData={heroAboutData} />
                <ExploreMore user={user} setEditAboutHero={setEditAboutHero} />
                {user && editAboutHero && (
                    <UpdateAbout
                        setEditAboutHero={setEditAboutHero}
                        heroAboutData={heroAboutData}
                        editAboutHero={editAboutHero}
                        getHeroAboutData={getHeroAboutData}
                    />
                )}
                <About heroAboutData={heroAboutData} />
                <WorkBefore />
                <Cases user={user} />
                <EduSection user={user} />
                <Result user={user} />
                <VideoPlayer user={user} />
                <Reviews user={user} />
                {/* <Banner heroAboutData={heroAboutData} /> */}
                <Footer />
            </main>
        </>
    )
}

export default Home
