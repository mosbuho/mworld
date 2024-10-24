import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import axios from "../../utils/axiosConfig.js";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import "/src/styles/pages/admin/AdminPaymentList.css"

const AdminPaymentList = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('TRANSACTIONID');
    const [q, setQ] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(-1);

    dayjs.locale("ko");

    useEffect(() => {
        fetchPaymentList(1, selectedStatus);
    }, [])

    const fetchPaymentList = async (page, status) => {
        if (pageDataCache[`${f}_${q}_${status}_${page}`]) {
            setPaymentList(pageDataCache[`${f}_${q}_${status}_${page}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/payment', {
                params: {page, size: 20, f, q, status}
            });
            const {paymentList: fetchedPaymentList, totalCount, totalPages} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${q}_${status}_${page}`]: fetchedPaymentList,
            }))
            setPaymentList(fetchedPaymentList);
            setPageCount(totalPages);

        } catch (err) {
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = parseInt(e.target.value, 10);
        setSelectedStatus(newStatus);
        setCurrentPage(0);
        setPageDataCache({});
        fetchPaymentList(1, newStatus);
    };

    const handlePageClick = (selectedPage) => {
        const newPage = selectedPage.selected + 1;
        setCurrentPage(selectedPage.selected);
        fetchPaymentList(newPage, selectedStatus);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchPaymentList(1, selectedStatus);
    };
    const handleRowClick = (payment, nav) => {
        nav(`/admin/payment/${payment.no}`);
    };

    const getTotalPrice = () => {
        return paymentList.reduce((total, payment) => total + payment.price, 0);
    };


    const columns = [
        {header: '주문번호', accessor: 'transactionId'},
        {header: '주문자명', accessor: 'memberName'},
        {header: '전화번호', accessor: 'memberPhone'},
        {header: '결제방법', accessor: 'method'},
        {header: '총주문액', accessor: 'price'},
        {header: '주문상태', accessor: 'status'},
        {header: '주문일시', accessor: 'regDate'},
    ];

    const options = [
        {value: 'TRANSACTIONID', label: '주문번호'},
        {value: 'MEMBERNAME', label: '주문자명'},
        {value: 'MEMBERPHONE', label: '전화번호'},
    ]

    const selectColumns = [
        { header: '전체', accessor: -1 },
        { header: '결제대기', accessor: 0 },
        { header: '결제완료', accessor: 1 },
        { header: '취소', accessor: 2 },
        { header: '환불', accessor: 3 },
        { header: '반품', accessor: 4 },
        { header: '교환', accessor: 5 },
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
    const statusFormatter =(status)=>{
        switch (status){
            case 0:
                return "결제대기"
            case 1:
                return "결제완료"
            case 2:
                return "취소"
            case 3:
                return "환불"
            case 4:
                return "반품"
            case 5:
                return "교환"
        }
    };

    const formattedPaymentList = paymentList.map((payment) => ({
        ...payment,
        price: payment.price.toLocaleString(),
        regDate: dayjs(payment.regDate).format("YYYY-MM-DD HH:mm (ddd)"),
        method: methodFormatter(payment.method),
        status: statusFormatter(payment.status),
    }));

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <AdminSearch
                    f={f}
                    setF={setF}
                    q={q}
                    setQ={setQ}
                    onSearch={handleSearch}
                    options={options}
                />
                <div className="admin-payment-list">
                    <div className="status-select">
                        <span>주문상태</span>
                        {selectColumns.map((column) => (
                            <label key={column.accessor}>
                                <input
                                    type="radio"
                                    name="paymentStatus"
                                    value={column.accessor}
                                    checked={selectedStatus === column.accessor}
                                    onChange={handleStatusChange}
                                />
                                {column.header}
                            </label>
                        ))}
                    </div>
                    <div className="admin-search-result"><span>주문목록</span>{paymentList.length}건 (총
                        주문액 {getTotalPrice().toLocaleString()}원)
                    </div>
                    <AdminTable columns={columns} data={formattedPaymentList} onRowClick={handleRowClick}/>
                    <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentList;