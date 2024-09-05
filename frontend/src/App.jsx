import './App.css'
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';


function App() {

  return (
    <div className='App'>
      <Routes>
        {/* 메인 및 다른 경로 설정 */}
        {/* <Route path='/*' element={<Main />} /> */}
        {/* <Route path='/admin/*' element={<Admin />} /> */}

        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>

    </div>
  )
}

export default App
