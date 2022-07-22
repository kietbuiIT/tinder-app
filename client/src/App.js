import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OnBoarding from './pages/OnBoarding'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import PageUploadImages from "./pages/PageUploadImages";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
    const [cookies] = useCookies(['user'])

    const authToken = cookies.AuthToken

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                {authToken && <Route path="/dashboard" element={<Dashboard/>}/>}
                {authToken && <Route path="/onboarding" element={<OnBoarding/>}/>}
                {authToken && <Route path="/uploadimage" element={<PageUploadImages/>} />}
                <Route path="/forgot" element = {<ForgotPassword/>}/>
                {/*<Route path="/updatepassword" element = {<UpdatePassword/>}/>*/}
                <Route path="/admin" element = {<AdminDashboard/>}/>

            </Routes>
        </BrowserRouter>
    )
}

export default App
