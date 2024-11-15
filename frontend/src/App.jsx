import { lazy, Suspense } from 'react'
import './App.css'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import AuthContextProvider from './context/AuthContextProvider'
import MatchPage from './components/matchCard/MatchPage'
import ChatPage from './components/chatPage/ChatPage'
import { SocketProvider } from './context/SocketContext'

const Login = lazy(()=>import('./components/Login/Login'))
const Register = lazy(()=>import('./components/Register/Register'))
const Home = lazy(()=>import('./pages/Home'))
const ProfileUpdate = lazy(()=>import('./components/ProfileUpdate/ProfileUpdate'));
const Profile = lazy(()=>import('./components/Profile/Profile'))
const SearchPage = lazy(()=>import('./components/searchPage/SearchPage'));




function App() {

  const router = createBrowserRouter([
    {path:'/',element:<Home/>},
    {path:'/login',element:<Login/>},
    {path:'/register',element:<Register/>},
    {path:'/profile/edit',element:<ProfileUpdate/>},
    {path:'/profile/:userId',element:<Profile/>},
    {path:'/matches',element:<MatchPage/>},
    {path:'/chat',element:<ChatPage/>},
    {path:'/chat/:receiverId',element:<ChatPage/>},
    {path:'/search',element:<SearchPage/>}






  ])

  return (
   <>
  <Suspense fallback = <div>Loading...</div>>
  <SocketProvider>
  <AuthContextProvider>
  
  <RouterProvider router={router}/>
  
  </AuthContextProvider>
  </SocketProvider>
  </Suspense>
   </>
  )
}

export default App
