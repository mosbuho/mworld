import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import axios from "../../utils/axiosConfig.js";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";
import AdminPagination from "../../components/admin/AdminPagination.jsx";

const AdminPaymentList = () => {
    const [paymentList, setPaymentList] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('TRANSACTIONID');
    const [q, setQ] = useState('');

    dayjs.locale("ko");

    useEffect(() => {
        fetchPaymentList(1);
    }, [])

    const fetchPaymentList = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setPaymentList(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/payment', {
                params: {page, size: 20, f, q}
            });
            const {paymentList: fetchedPaymentList, totalCount, totalPages} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${q}_${page}`]: fetchedPaymentList,
            }))
            setPaymentList(fetchedPaymentList);
            setPageCount(totalPages);

        } catch (err) {
            console.error("failed to fetch payment", err);
        }
    };

    const handlePageClick = (selectedPage) => {
        const newPage = selectedPage.selected + 1;
        setCurrentPage(selectedPage.selected);
        fetchPaymentList(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchPaymentList(1);
    };

    const handleRowClick = (payment, nav) => {
        nav(`/admin/payment/${payment.transactionId}`);
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

    const formattedPaymentList = paymentList.map((payment) => ({
        ...payment,
        price: payment.price.toLocaleString(),
        regDate: dayjs(payment.regDate).format("YYYY-MM-DD HH:mm (ddd)"),
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
                <AdminTable columns={columns} data={formattedPaymentList} onRowClick={handleRowClick}/>
                <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
            </div>
        </div>
    );
};

export default AdminPaymentList;