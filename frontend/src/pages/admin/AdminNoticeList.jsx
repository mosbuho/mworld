import axios from "axios";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";
import React, {useState, useEffect} from 'react';  // useState와 useEffect 추가
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

const AdminNoticeList = () => {
    const [notice, setNotice] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('NO');
    const [q, setQ] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const navigate = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchNotice(1);
    }, []);

    const fetchNotice = async (page) => {
        const cacheKey = `${f}_${q}_${page}_${startDate}-${endDate}`;
        if (pageDataCache[cacheKey]) {
            setNotice(pageDataCache[cacheKey]);
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/notice', {
                params: {
                    page, size: 30, f, q
                }
            });

            const {notices: fetchedNotice, totalCount} = response.data;

            // totalCount가 유효한 숫자인지 확인하고 설정
            const validTotalCount = totalCount ? totalCount : 0;

            setPageDataCache(prevCache => ({
                ...prevCache,
                [cacheKey]: fetchedNotice
            }));

            setNotice(fetchedNotice);
            setPageCount(Math.ceil(validTotalCount / 30));  // totalCount가 undefined일 경우 0으로 처리
        } catch (error) {
            console.error("Error fetching notices:", error);
            setNotice([]);  // API 호출 실패 시 빈 배열로 설정
            setPageCount(1);  // 기본 페이지 수 설정
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
        navigate(`/notice/${notice.no}`, {state: {notice}});
    };

    const columns = [
        {header: '번호', accessor: 'no'},
        {header: '제목', accessor: 'title'},
        {header: '작성일', accessor: 'regDate'},
    ];

    const options = [
        {value: 'no', label: '번호'},
        {value: 'title', label: '제목'},
    ];

    const formattedNotice = notice ? notice.map(item => ({
        ...item,
        regDate: dayjs(item.regDate).format("YYYY-MM-DD"),  // regDate 필드를 dayjs로 변환
    })) : [];

    return (
        <div>
            <div>
                <div>
                    {/*<AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />*/}
                    <button onClick={() => {
                        navigate('/notice/create')
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