import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoute from './components/common/PublicRoute';
import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminMember from "./pages/admin/AdminMember.jsx";
import AdminMemberList from "./pages/admin/AdminMemberList.jsx";
import AdminLogin from './pages/AdminLogin';
import SignUp from './pages/SignUp';
import MemberMain from './pages/member/MemberMain.jsx';

import MemberLogin from './pages/member/MemberLogin';
import OAuthCallback from './utils/OAuthCallback';

import ProductDetail from './pages/member/ProductDetail.jsx';
import MainProduct from './components/member/MainProduct.jsx';

import AdminProductList from "./pages/admin/AdminProductList.jsx";
import AdminProductCreate from "./pages/admin/AdminProductCreate.jsx";
import AdminProduct from "./pages/admin/AdminProduct.jsx";

import AdminNoticeCreate from "./pages/admin/AdminNoticeCreate.jsx";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />

        {/* 비로그인 라우트 */}
        <Route path='/' element={<PublicRoute><MemberMain /></PublicRoute>} >
          <Route index element={<MainProduct />} />
          <Route path='search' element={<MainProduct />} />
          <Route path='product/:id' element={<ProductDetail />} />
        </Route>
        <Route path="/login" element={<PublicRoute><MemberLogin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

        {/* 어드민 라우트 */}
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/admin/member" element={<AdminMemberList />} />
        <Route path="/admin/member/:no" element={<AdminMember />} />
        <Route path="/admin/product" element={<AdminProductList />} />
        <Route path="/admin/product/create" element={<AdminProductCreate />} />
        <Route path="/admin/product/:no" element={<AdminProduct/>} />

        <Route path="/notice/create" element={<AdminNoticeCreate/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
