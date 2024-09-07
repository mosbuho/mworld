import axios from "/src/utils/axiosConfig.js";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";

const AdminMemberList = () => {
    const [members, setMembers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('title');
    const [q, setQ] = useState('');
    const [startDate, setStartDate] = useState('');  // 시작일 추가
    const [endDate, setEndDate] = useState('');      // 종료일 추가

    dayjs.locale("ko");

    useEffect(() => {
        fetchMembers(1)
    }, []);

    const fetchMembers = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}_${startDate}_${endDate}`]) {
            setMembers(pageDataCache[`${f}_${q}_${page}_${startDate}_${endDate}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/member-list', {
                params: {page, size: 20, f, q, startDate, endDate} // 기간 추가
            });

            const {members: fetchedMembers, totalCount} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${q}_${page}_${startDate}_${endDate}`]: fetchedMembers,
            }));

            setMembers(fetchedMembers);
            setPageCount(Math.ceil(totalCount / 20));

        } catch (err) {
            console.error("failed to fetch member-list ", err);
        }
    };

    const handlePageClick = (selectedPage) => {
        const newPage = selectedPage.selected + 1;
        setCurrentPage(selectedPage.selected);
        fetchMembers(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchMembers(1);
    };

    const handleRowClick = (member, nav) => {
        nav(`/admin/member/${member.no}`, {state: {member}});
    };

    const columns = [
        {header: '아이디', accessor: 'id'},
        {header: '이름', accessor: 'name'},
        {header: '전화번호', accessor: 'phone'},
        {header: '가입일시', accessor: 'regDate'},
    ];

    const options = [
        {value: 'ID', label: '아이디'},
        {value: 'NAME', label: '이름'},
        {value: 'PHONE', label: '전화번호'},
    ];

    const formattedMembers = members.map((member) => ({
        ...member,
        regDate: dayjs(member.regDate).format("YYYY-MM-DD (ddd)"),
    }));


    return (
        <div className="admin-member-list">
            <h1>회원리스트</h1>
            <AdminSidebar/>
            <div className="member-list">
                <AdminSearch
                    f={f}
                    setF={setF}
                    q={q}
                    setQ={setQ}
                    onSearch={handleSearch}
                    options={options}
                    startDate={startDate} // 시작일 전달
                    setStartDate={setStartDate}
                    endDate={endDate} // 종료일 전달
                    setEndDate={setEndDate}
                />
                <AdminTable columns={columns} data={formattedMembers} onRowClick={handleRowClick}/>
                <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
            </div>
        </div>
    );
};

export default AdminMemberList;
