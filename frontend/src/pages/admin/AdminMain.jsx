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
    const [paymentStats, setPaymentStats] = useState({
        total: 0,
        totalPrice: 0,
        canceled: 0,
        refunded: 0,
        returned: 0,
        exchanged: 0,
    });
    const nav = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchPayments();
        fetchMembers();
        fetchPaymentStats();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get('/api/admin/payment-main');
            setPayments(res.data.payments);
        } catch (err) {
            console.error("failed to fetch payment", err);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await axios.get('/api/admin/member-main');
            setMembers(res.data);
        } catch (err) {
            console.error("failed to fetch member", err);
        }
    };

    const fetchPaymentStats = async () => {
        try {
            const res = await axios.get('/api/admin/payment-stats');
            console.log(res);
            setPaymentStats(res.data);
        } catch (err) {
            console.error("Failed to fetch payment statistics", err)
        }
    };


    const membersColumns = [
        {header: '아이디', accessor: 'id'},
        {header: '이름', accessor: 'name'},
        {header: '전화번호', accessor: 'phone'},
        {header: '주소', accessor: 'addr'},
        {header: '가입일시', accessor: 'regDate'},
    ];

    const paymentsColumns = [
        {header: '주문번호', accessor: 'transactionId'},
        {header: '주문자명', accessor: 'memberName'},
        {header: '전화번호', accessor: 'memberPhone'},
        {header: '결제방법', accessor: 'method'},
        {header: '총주문액', accessor: 'price'},
        {header: '주문일시', accessor: 'regDate'},
        {header: '주문상태', accessor: 'status'},
    ];

    const formattedPayments = payments.map((payment) => ({
        ...payment,
        price: payment.price.toLocaleString(),
        regDate: dayjs(payment.regDate).format("YYYY-MM-DD HH:mm (ddd)"),
    }));

    const formattedMembers = members.map((member) => ({
        ...member,
        regDate: dayjs(member.regDate).format("YYYY-MM-DD (ddd)"),
    }));

    const formattedPrice = (totalPrice) => {
        if (totalPrice >= 1e8) {
            return `${(totalPrice / 1e8).toFixed(1)}억`;
        } else if (totalPrice >= 1e4) {
            return `${(totalPrice / 1e4).toFixed(1)}만`;
        } else {
            return `${totalPrice}`;
        }
    }

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
                    <div className="stats">
                        <div className="total-state">
                            <span>전체주문 현황</span>
                            <table>
                                <thead>
                                <tr>
                                    <th>총 주문건수</th>
                                    <th>총 매출</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{paymentStats.total}</td>
                                    <td>{formattedPrice(paymentStats.totalPrice)}</td>
                                </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="claim-state">
                            <span>클래임 현황</span>
                            <table>
                                <thead>
                                <tr>
                                    <th>취소</th>
                                    <th>환불</th>
                                    <th>반품</th>
                                    <th>교환</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{paymentStats.canceled}</td>
                                    <td>{paymentStats.refunded}</td>
                                    <td>{paymentStats.returned}</td>
                                    <td>{paymentStats.exchanged}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
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
                    <AdminTable columns={membersColumns} data={formattedMembers} onRowClick={(member, nav) => {
                        nav(`/admin/member/${member.no}`, {state: {member}});
                    }}/>
                </div>
            </div>
        </div>
    );
};

export default AdminMain;