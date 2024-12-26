import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"


function App() {

  return (
 <>
 <Navbar/>
  <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/signup' element={<SignupPage/>}/>
    <Route path='/login  /' element={<LoginPage/>}/>
  </Routes>
 </>
  )
}

export default App
