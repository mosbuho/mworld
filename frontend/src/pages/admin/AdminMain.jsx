import {useEffect, useState} from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";

const AdminMain = () => {
    const [payments, setPayments] = useState([]);
    const [members, setMembers] = useState([]);

    dayjs.locale("ko");

    const fetchPayments = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/payment/admin/main');
            setPayments(res.data);
        } catch (err) {
            console.error("failed to fetch payment", err);
        }
    }

    const fetchMembers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/member/admin/main');
            setMembers(res.data);
        } catch (err) {
            console.error("failed to fetch member", err);
        }
    }

    useEffect(() => {
        fetchPayments();
        fetchMembers();
    }, []);

    return (
        <div className="admin-main">
            <h1>관리자 메인</h1>
            <AdminSidebar/>
            <div className="order-list">
                <span>최근주문내역</span>
                <button>주문전체보기</button>
                <table>
                    <thead>
                    <tr>
                        <th>주문번호</th>
                        <th>주문자명</th>
                        <th>전화번호</th>
                        <th>결제방법</th>
                        <th>총주문액</th>
                        <th>주문일시</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.no}>
                            <td>{payment.transactionId}</td>
                            <td>{payment.member.name}</td>
                            <td>{payment.member.phone}</td>
                            <td>카드or계좌이체</td>
                            <td>{payment.price}</td>
                            <td>{dayjs(payment.regDate).format("YYYY-MM-DD HH:mm (ddd)")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="member-list">
                <span>최근회원가입</span>
                <button>회원전체보기</button>
                <table>
                    <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>주소</th>
                        <th>가입일시</th>
                    </tr>
                    </thead>
                    <tbody>
                    {members.map((member) => (
                        <tr key={member.no}>
                            <td>{member.id}</td>
                            <td>{member.name}</td>
                            <td>{member.phone}</td>
                            <td>{member.addr}</td>
                            <td>{dayjs(member.regDate).format("YYYY-MM-DD (ddd)")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminMain;