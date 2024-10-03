import "/src/styles/components/admin/AdminHeader.css"
import {useNavigate} from "react-router-dom";

const AdminHeader = () => {
    const nav = useNavigate();
    return (
        <div className="admin-header">
            <div className="title" onClick={()=>nav("/admin")}>관리자페이지</div>
            <div className="logout-btn">로그아웃</div>
        </div>
    );
}

export default AdminHeader;