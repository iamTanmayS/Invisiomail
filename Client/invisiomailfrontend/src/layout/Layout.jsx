import {Outlet} from "react-router-dom"
// import Navbar from "../components/Navbar"
import { Footer } from "../components/Footer"
import Navbar from "../components/Navbar/Navbar"

export const Layout = () => 
{


    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>

    )
}
