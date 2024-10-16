import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import dayjs from "dayjs";
import "/src/styles/pages/admin/AdminPayment.css";

const AdminPayment = () => {
    const [paymentInfo, setPaymentInfo] = useState({});
    const [productList, setProductList] = useState([]);
    const {orderNo} = useParams();

    dayjs.locale("ko");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`/api/admin/payment/${orderNo}`);
            setPaymentInfo(res.data.paymentInfo);
            setProductList(res.data.productList);
        } catch (err) {
            console.error("failed to fetch payment", err);
        }
    };

    const selectColumns = [
        {header: '결제대기', accessor: 'UNPAYMENT'},
        {header: '결제완료', accessor: 'PAYMENTED'},
        {header: '취소', accessor: 'CANCELED'},
        {header: '환불', accessor: 'REFUNDED'},
        {header: '반품', accessor: 'RETURNED'},
        {header: '교환', accessor: 'EXCHANGED'},
    ];

    const getTotalPrice = () => {
        return productList.reduce((total, product) => total + product.price, 0);
    };

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-payment-detail">
                    <div className="admin-payment-title">주문 상세내역</div>
                    <div className="admin-payment-detail-header">
                        <div className="payment-detail-title"><span>주문번호</span>{paymentInfo.transactionId}</div>
                        <div className="payment-detail-title">
                            <span>주문일시</span>{dayjs(paymentInfo.regDate).format("YYYY-MM-DD HH:mm (ddd)")}</div>
                        <div className="payment-detail-title">
                            <span>주문상태</span>
                            <select defaultValue={paymentInfo.status}>
                                {selectColumns.map((column) => (
                                    <option key={column.accessor} value={column.accessor}>
                                        {column.header}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="payment-detail-list">
                        <div className="payment-detail-row-title">주문상품</div>
                        <table>
                            <thead>
                            <tr>
                                <th>상품명</th>
                                <th>수량</th>
                                <th>가격</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productList.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{row.productTitle}</td>
                                    <td>{row.quantity}</td>
                                    <td>{row.price}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="payment-detail-info">
                        <div className="payment-detail-row-title">결제정보</div>
                        <div className="payment-detail-row">
                            <div>결제금액</div>
                            <div>{getTotalPrice().toLocaleString()}원</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>결제방법</div>
                            <div>{paymentInfo.method}</div>
                        </div>
                    </div>
                    <div className="payment-detail-addr">
                        <div className="payment-detail-row-title">배송정보</div>
                        <div className="payment-detail-row">
                            <div>이름</div>
                            <div>{paymentInfo.memberName}</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>전화번호</div>
                            <div>{paymentInfo.memberPhone}</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>주소</div>
                            <div>{paymentInfo.addr}</div>
                        </div>
                    </div>
                    <div className="btn-area">
                        <button type="button" className="update-btn" >저장</button>
                        <button type="button" onClick={() => nav(-1)}>뒤로</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayment;
