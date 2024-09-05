import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminMemberList from "./pages/admin/AdminMemberList.jsx";
import AdminMember from "./pages/admin/AdminMember.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin" element={<AdminMain/>}/>
                <Route path="/admin/member" element={<AdminMemberList/>}/>
                <Route path="/admin/member/:no" element={<AdminMember/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
