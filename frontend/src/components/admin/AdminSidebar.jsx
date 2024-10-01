import {useNavigate, useLocation} from 'react-router-dom';
import "/src/styles/components/admin/AdminSidebar.css"

const AdminSidebar = () => {
    const nav = useNavigate();
    const location = useLocation();

    const sections = {
        member: '회원관리',
        product: '상품관리',
        payment: '주문관리',
        notice: '공지사항'
    };

    const getClassName = (keyword) => {
        return location.pathname.includes(keyword) ? "active" : "";
    };

    return (
        <nav className="admin-sidebar">
            <ul>
                <li className={location.pathname.endsWith('admin') ? "active" : ""}
                    onClick={() => nav('/admin')}>메인화면
                </li>
                {Object.keys(sections).map(section => (
                    <li key={section} className={getClassName(section)} onClick={() => nav(`/admin/${section}`)}>
                        {sections[section]}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AdminSidebar;