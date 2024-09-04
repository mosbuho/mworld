import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css'

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
        {/* <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} /> */}

        {/* OAuth 콜백 처리 경로 */}
        <Route path="/oauth/callback/:provider" element={<OAuthCallback/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
