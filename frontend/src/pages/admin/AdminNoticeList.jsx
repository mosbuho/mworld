import axios from "../../utils/axiosConfig.js";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import "/src/styles/pages/admin/AdminNoticeList.css";

const AdminNoticeList = () => {
    const [notice, setNotice] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('TITLE');
    const [q, setQ] = useState('');

    const navigate = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchNotice(1);
    }, []);

    const fetchNotice = async (page) => {
        const cacheKey = `${f}_${q}_${page}`;

        if (pageDataCache[cacheKey]) {
            setNotice(pageDataCache[cacheKey]);
            return;
        }

        try {
            const response = await axios.get('/api/notice', {
                params: {
                    page, size: 20, f, q
                }
            });

            let { notices: fetchedNotice, totalCount } = response.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [cacheKey]: fetchedNotice
            }));

            setNotice(fetchedNotice);

            setPageCount(Math.ceil(totalCount / 20));
        } catch (err) {
            console.error("Failed to fetch noticeList", err);
        }
    };

    const handlePageClick = (selectedItem) => {
        const newPage = selectedItem.selected + 1;
        setCurrentPage(selectedItem.selected);
        fetchNotice(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchNotice(1);
    };

    const handleRowClick = (notice, navigate) => {
        navigate(`/api/notice/${notice.no}`, {state: {notice}});
    };

    const columns = [
        {header: '번호', accessor: 'no'},
        {header: '제목', accessor: 'title'},
        {header: '작성일', accessor: 'regDate'},
    ];

    const options = [
        {value: 'TITLE', label: '제목'},
        {value: 'CONTENT', label: '내용'},
    ]

    const formattedNotice = notice.map(notice => ({
        ...notice,
        regDate: dayjs(notice.regDate).format("YYYY-MM-DD"),
    }));

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div>
                    <AdminSearch
                        f={f}
                        setF={setF}
                        q={q}
                        setQ={setQ}
                        onSearch={handleSearch}
                        options={options}
                    />
                </div>
                <div className="admin-notice-filter">
                    <button onClick={() => {
                        navigate('/admin/notice/create')
                    }}>작성
                    </button>
                </div>
                <AdminTable columns={columns} data={formattedNotice} onRowClick={handleRowClick}/>
                <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
            </div>
        </div>
    );
};

export default AdminNoticeList;