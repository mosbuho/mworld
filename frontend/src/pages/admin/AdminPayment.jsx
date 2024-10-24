import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../utils/axiosConfig.js";
import dayjs from "dayjs";
import "/src/styles/pages/admin/AdminPayment.css";

const AdminPayment = () => {
    const [paymentInfo, setPaymentInfo] = useState({});
    const [productList, setProductList] = useState([]);
    const {no} = useParams();
    const nav = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get(`/api/admin/payment/${no}`);
            setPaymentInfo(res.data.paymentInfo);
            setProductList(res.data.productList);
        } catch (err) {
            console.error("failed to fetch payment", err);
        }
    };

    const handleUpdate = async () => {
        if (window.confirm("주문상태를 변경하시겠습니까?")) {
            try {
                const res = await axios.put(`/api/admin/payment/${paymentInfo.no}`, null, {
                    params: {status: paymentInfo.status},
                });
                alert(res.data);
            } catch (err) {
                console.error("Failed to update payment status", err);
                alert("주문상태 변경에 실패했습니다.");
            }
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = Number(e.target.value);
        setPaymentInfo((prev) => ({
            ...prev,
            status: newStatus,
        }));
    };

    const selectColumns = [
        {header: '결제대기', accessor: 0},
        {header: '결제완료', accessor: 1},
        {header: '취소', accessor: 2},
        {header: '환불', accessor: 3},
        {header: '반품', accessor: 4},
        {header: '교환', accessor: 5},
    ];

    const methodFormatter = (method) => {
        switch (method) {
            case 0:
                return "계좌이체";
            case 1:
                return "카드결제";
            default:
                return "기타";
        }
    };

    const formattedPayment = {
        ...paymentInfo,
        price: paymentInfo.price ? paymentInfo.price.toLocaleString() : '0',
        regDate: paymentInfo.regDate ? dayjs(paymentInfo.regDate).format("YYYY-MM-DD HH:mm (ddd)") : '',
    };

    const totalQuantity = productList.reduce((acc, product) => acc + product.quantity, 0);
    const ProductTotalPrice = productList.reduce((acc, product) => acc + product.productPrice * product.quantity, 0);

    if (!paymentInfo || !productList) {
        return <div>Loading...</div>; // 로딩 중 표시
    }
    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-payment-detail">
                    <div className="admin-payment-title">주문 상세내역</div>
                    <div className="admin-payment-detail-header">
                        <div className="payment-detail-title"><span>주문번호</span>{formattedPayment.transactionId}</div>
                        <div className="payment-detail-title">
                            <span>주문일시</span>{formattedPayment.regDate}</div>
                        <div className="payment-detail-title">
                            <span>주문상태</span>
                            <select
                                value={formattedPayment.status}
                                onChange={handleStatusChange}
                            >
                                {selectColumns.map((column) => (
                                    <option
                                        key={column.accessor}
                                        value={column.accessor}
                                    >
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
                                    <td>{row.quantity * row.productPrice}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>합계</td>
                                    <td>{totalQuantity}</td>
                                    <td>{ProductTotalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="payment-detail-info">
                        <div className="payment-detail-row-title">결제정보</div>
                        <div className="payment-detail-row">
                            <div>상품 금액</div>
                            <div>{ProductTotalPrice.toLocaleString()}원</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>결제 금액</div>
                            <div>{formattedPayment.price}원</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>결제 방법</div>
                            <div>{methodFormatter(formattedPayment.method)}</div>
                        </div>
                    </div>
                    <div className="payment-detail-addr">
                        <div className="payment-detail-row-title">배송정보</div>
                        <div className="payment-detail-row">
                            <div>이름</div>
                            <div>{formattedPayment.memberName}</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>전화번호</div>
                            <div>{formattedPayment.memberPhone}</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>주소</div>
                            <div>{formattedPayment.addr}</div>
                        </div>
                        <div className="payment-detail-row">
                            <div>상세주소</div>
                            <div>{formattedPayment.detailAddr}</div>
                        </div>
                    </div>
                    <div className="btn-area">
                        <button type="button" className="update-btn" onClick={handleUpdate}>저장</button>
                        <button type="button" onClick={() => nav(-1)}>뒤로</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPayment;
