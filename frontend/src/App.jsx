import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoute from './components/common/PublicRoute';

// 비로그인
import Login from './components/common/Login.jsx';

// 멤버
import MemberSignUp from './pages/member/MemberSignUp';
import MemberMainProduct from './components/member/MemberMainProduct';
import MemberCartPage from './pages/member/MemberCartPage';
import MemberMain from './pages/member/MemberMain';
import MemberMyPage from './pages/member/MemberMyPage';
import MemberPaymentPage from './pages/member/MemberPaymentPage';
import MemberProductDetail from './pages/member/MemberProductDetail';

// 어드민
import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminMember from "./pages/admin/AdminMember.jsx";
import AdminMemberList from "./pages/admin/AdminMemberList.jsx";
import AdminPaymentList from "./pages/admin/AdminPaymentList.jsx";
import AdminProduct from "./pages/admin/AdminProduct.jsx";
import AdminProductCreate from "./pages/admin/AdminProductCreate.jsx";
import AdminProductList from "./pages/admin/AdminProductList.jsx";
import AdminNoticeCreate from "./pages/admin/AdminNoticeCreate.jsx";
import AdminNoticeList from "./pages/admin/AdminNoticeList.jsx";
import AdminPayment from "./pages/admin/AdminPayment.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 비로그인 라우트 */}
        <Route path="/login" element={<PublicRoute><Login isAdmin={false} /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><Login isAdmin={true} /></PublicRoute>} />

        {/* 멤버 라우트 */}
        <Route path='/mypage' element={<PublicRoute><MemberMyPage /></PublicRoute>} />
        <Route path='/cart' element={<PublicRoute><MemberCartPage /></PublicRoute>} />
        <Route path='/payment' element={<PublicRoute><MemberPaymentPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><MemberSignUp /></PublicRoute>} />
        <Route path='/' element={<PublicRoute><MemberMain /></PublicRoute>} >
          <Route index element={<MemberMainProduct />} />
          <Route path='search' element={<MemberMainProduct />} />
          <Route path='product/:no' element={<MemberProductDetail />} />
        </Route>

        {/* 어드민 라우트 */}
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/admin/member" element={<AdminMemberList />} />
        <Route path="/admin/member/:no" element={<AdminMember />} />
        <Route path="/admin/product" element={<AdminProductList />} />
        <Route path="/admin/product/create" element={<AdminProductCreate />} />
        <Route path="/admin/product/:no" element={<AdminProduct />} />
        <Route path="/admin/payment" element={<AdminPaymentList />} />
        <Route path="/admin/payment/:orderNo" element={<AdminPayment />} />
        <Route path="/admin/notice/create" element={<AdminNoticeCreate />} />
        <Route path="admin/notice" element={<AdminNoticeList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
