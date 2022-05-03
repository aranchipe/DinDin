import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Main from './pages/Main'
import { getItem } from './utils/storage'


function ProtectedRoutes({ redirectTo }) {
    const token = getItem('token')

    return token ? <Outlet /> : <Navigate to={redirectTo} />
}

function MainRoutes() {
    return (
        <Routes>
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/login' element={<SignIn />} />

            <Route element={<ProtectedRoutes redirectTo="/" />}>
                <Route path='/main' element={<Main />} />
            </Route>
        </Routes>
    )
}

export default MainRoutes;