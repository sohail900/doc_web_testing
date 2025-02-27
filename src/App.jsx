import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Loading from './pages/Loading'
import InjuryDetails from './components/InjuryDetails'
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const App = () => {
    return (
        <>
            <BrowserRouter>
                <ToastContainer />
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route
                            path='/injury-details/:id'
                            element={<InjuryDetails />}
                        />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
