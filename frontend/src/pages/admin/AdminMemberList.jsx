import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import AdminTable from "../../components/admin/AdminTable.jsx";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminPagination from "../../components/admin/AdminPagination.jsx";

const AdminMemberList = () => {
    const [members, setMembers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('title');
    const [q, setQ] = useState('');

    useEffect(() => {

    });

    const fetchMembers = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setMembers(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }
        try {
            const res = await axios.get('http://localhost:8080/api/member/admin', {
                    params: {page, size: 20, f, q}
                }
            );

            const {members: fetchedMembers, totalCount} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${q}_${page}`]: fetchedMembers,
            }));

            setMembers(fetchedMembers);
            setPageCount(Math.ceil(totalCount / 20));

        } catch (err) {
            console.error("failed to fetch member", err);
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
    }

    const handleRowClick = (member, nav) => {
        nav(`/admin/member/${member.no}`, {state: {member}});
    }

    const columns = [
        {header : '아이디', accessor: 'ID'},
        {header : '이름', accessor: 'NAME'},
        {header : '전화번호', accessor: 'PHONE'},
        {header : '가입일시', accessor: 'REGDATE'},
    ];
    
    const options = [
        { value : 'ID', label: '아이디' },
        { value : 'ID', label: '이름' },
        { value : 'ID', label: '전화번호' },
    ];

    const formattedMembers = members.map((member) => ({
        ...member,
        REGDATE: dayjs(member.regDate).format("YYYY-MM-DD (ddd)"),
    }));


    return (
        <div className="admin-main">
            <h1>회원리스트</h1>
            <AdminSidebar/>
            <div className="member-list">
                <AdminSearch f={f} setF={setF} q={q} setQ={setQ} onSearch={handleSearch} options={options} />
                <AdminTable columns={columns} data={formattedMembers} onRowClick={handleRowClick} />
                <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage} />
            </div>
        </div>

    );
};

export default AdminMemberList;