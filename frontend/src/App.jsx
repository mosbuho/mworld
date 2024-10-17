import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoute from './components/common/PublicRoute';
import OAuthCallback from './utils/OAuthCallback';

import MemberSignUp from './pages/member/MemberSignUp';
import MemberMainProduct from './components/member/MemberMainProduct';
import MemberCartPage from './pages/member/MemberCartPage';
import MemberMain from './pages/member/MemberMain';
import MemberMyPage from './pages/member/MemberMyPage';
import MemberPaymentPage from './pages/member/MemberPaymentPage';
import MemberProductDetail from './pages/member/MemberProductDetail';
import Login from '/src/components/Login.jsx';

import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminMember from "./pages/admin/AdminMember.jsx";
import AdminMemberList from "./pages/admin/AdminMemberList.jsx";
import AdminPaymentList from "./pages/admin/AdminPaymentList.jsx";
import AdminProduct from "./pages/admin/AdminProduct.jsx";
import AdminProductCreate from "./pages/admin/AdminProductCreate.jsx";
import AdminProductList from "./pages/admin/AdminProductList.jsx";
import AdminLogin from './pages/admin/AdminLogin';
import AdminNoticeCreate from "./pages/admin/AdminNoticeCreate.jsx";
import AdminPayment from "./pages/admin/AdminPayment.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />

        {/* 비로그인 라우트 */}
        <Route path='/' element={<PublicRoute><MemberMain /></PublicRoute>} >
          <Route index element={<MemberMainProduct />} />
          <Route path='search' element={<MemberMainProduct />} />
          <Route path='product/:id' element={<MemberProductDetail />} />
        </Route>
        <Route path='/mypage' element={<PublicRoute><MemberMyPage /></PublicRoute>} />
        <Route path='/cart' element={<PublicRoute><MemberCartPage /></PublicRoute>} />
        <Route path='/payment' element={<PublicRoute><MemberPaymentPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><MemberSignUp /></PublicRoute>} />

        {/* 어드민 라우트 */}
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/admin/member" element={<AdminMemberList />} />
        <Route path="/admin/member/:no" element={<AdminMember />} />
        <Route path="/admin/product" element={<AdminProductList />} />
        <Route path="/admin/product/create" element={<AdminProductCreate />} />
        <Route path="/admin/product/:no" element={<AdminProduct />} />
        <Route path="/notice/create" element={<AdminNoticeCreate />} />
        <Route path="/admin/product/:no" element={<AdminProduct />} />
        <Route path="/admin/payment" element={<AdminPaymentList />} />
        <Route path="/admin/payment/:orderNo" element={<AdminPayment/>} />
        <Route path="/admin/notice/create" element={<AdminNoticeCreate />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
