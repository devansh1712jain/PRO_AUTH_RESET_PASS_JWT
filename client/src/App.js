import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Username from './components/Username'
import Password from './components/Password'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import Register from './components/Register'
import Reset from './components/Reset'
import Pagenotfound from './components/Pagenotfound'

/**Auth middlewear */
import { AuthorizUser, ProtectRoute } from './middlewear/auth'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Username></Username>
    },
    {
        path: '/register',
        element: <Register></Register>
    },   
    {
        path: '/password',
        element:  <ProtectRoute><Password/></ProtectRoute>
    },   
    {
        path: '/profile',
        element: <AuthorizUser><Profile /></AuthorizUser>
    },   
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },   
    {
        path: '/reset',
        element: <Reset></Reset>
    },   
    {
        path: '/pagenotfound',
        element: <Pagenotfound></Pagenotfound>
    }
])

function App() {
  return (
    <main>
        <RouterProvider router={router}></RouterProvider>
    </main>
  )
}

export default App