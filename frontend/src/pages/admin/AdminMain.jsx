import axios from "/src/utils/axiosConfig.js";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import "/src/styles/pages/admin/AdminLayout.css"
import "/src/styles/pages/admin/AdminMain.css"
import AdminTable from "../../components/admin/AdminTable.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";

const AdminMain = () => {
    const [payments, setPayments] = useState([]);
    const [members, setMembers] = useState([]);
    const nav = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchPayments();
        fetchMembers();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get('/api/admin/payment-main');
            setPayments(res.data.payments);
        } catch (err) {
            console.error("failed to fetch payment", err);
        }

    }
    const fetchMembers = async () => {
        try {
            const res = await axios.get('/api/admin/member-main');
            setMembers(res.data);
        } catch (err) {
            console.error("failed to fetch member", err);
        }

    }


    const membersColumns = [
        {header: '아이디', accessor: 'id'},
        {header: '이름', accessor: 'name'},
        {header: '전화번호', accessor: 'phone'},
        {header: '주소', accessor: 'addr'},
        {header: '가입일시', accessor: 'regDate'},
    ]

    const paymentsColumns = [
        {header: '주문번호', accessor: 'transactionId'},
        {header: '주문자명', accessor: 'memberName'},
        {header: '전화번호', accessor: 'memberPhone'},
        {header: '결제방법', accessor: 'method'},
        {header: '총주문액', accessor: 'price'},
        {header: '주문일시', accessor: 'regDate'},
        {header: '주문상태', accessor: 'status'},
    ]

    const formattedPayments = payments.map((payment) => ({
        ...payment,
        price : payment.price.toLocaleString(),
        regDate: dayjs(payment.regDate).format("YYYY-MM-DD HH:mm (ddd)"),
    }))

    const formattedMembers = members.map((member) => ({
        ...member,
        regDate: dayjs(member.regDate).format("YYYY-MM-DD (ddd)"),
    }))

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-state-area">
                    <div className="title-area">
                        <span>전체 주문통계</span>
                        <button>주문전체보기</button>
                    </div>
                    <div className="order-state">
                        <span>전체주문 현황</span>
                    </div>
                    <div className="claim-state">
                        <span>클래임 현황</span>
                    </div>
                </div>
                <div className="admin-order-list">
                    <div className="title-area">
                        <span>최근 주문내역</span>
                        <button>주문전체보기</button>
                    </div>
                    <AdminTable columns={paymentsColumns} data={formattedPayments}/>
                </div>
                <div className="admin-member-list">
                    <div className="title-area">
                        <span>최근 회원가입</span>
                        <button onClick={() => nav("/admin/member")}>회원전체보기</button>
                    </div>
                    <AdminTable columns={membersColumns} data={formattedMembers} onRowClick={(member, nav)=>{
                        nav(`/admin/member/${member.no}`, {state:{member}});
                    }}/>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;