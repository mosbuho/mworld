import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';
import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminMemberList from "./pages/admin/AdminMemberList.jsx";
import AdminMember from "./pages/admin/AdminMember.jsx";
import './App.css'
import Login from './components/Login';
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';


import MemberLogin from './pages/member/MemberLogin';
import OAuthCallback from './utils/OAuthCallback';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        {/* <Route path="/" element={<MemberMain />} /> */}

        {/* 비로그인 라우트 */}
        <Route path="/login" element={<PublicRoute><MemberLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
                                      
        {/* 어드민 라우트 */}
        <Route path="/admin" element={<AdminMain/>}/>
        <Route path="/admin/member" element={<AdminMemberList/>}/>
        <Route path="/admin/member/:no" element={<AdminMember/>}/>

        {/* OAuth 콜백 처리 경로 */}
        <Route path="/oauth/callback/:provider" element={<OAuthCallback/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
