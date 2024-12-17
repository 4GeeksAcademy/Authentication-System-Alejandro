import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { Private } from "./pages/Private.jsx";
import { Error404 } from "./pages/Error404.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isValidToken, setIsValidToken] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    useEffect(() => {
        const validateToken = async () => {
            if(token){
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/private`, {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    })
                    if(response.ok){
                        setIsValidToken(true)
                    } else {
                        setIsValidToken(false)
                        localStorage.removeItem('token')
                        setToken(null)
                    }
                } catch (error) {
                    console.error("Error validating token:", error);
                    setIsTokenValid(false);
                    localStorage.removeItem("token");
                    setToken(null);
                }
            }
            setIsLoading(false)
        }

        validateToken()
    }, [token])

    if(isLoading){
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <h2>Loading...</h2>
            </div>
        )
    }

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup" />
                        {isValidToken
                        ? <Route element={<Private />} path="/private" />
                        : <Route path='*' element={<Error404 />} />}
                        <Route path='*' element={<Error404 />} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
