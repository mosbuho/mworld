import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useState} from "react";

const AdminPayment = () => {
    const [payments, setPayments] = useState([]);
    return(
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">

            </div>
        </div>
    );
};

export default AdminPayment;