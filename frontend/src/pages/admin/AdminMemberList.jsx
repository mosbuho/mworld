import axios from "/src/utils/axiosConfig.js";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import AdminTable from "../../components/admin/AdminTable.jsx";
import AdminHeader from "../../components/admin/AdminHeader.jsx";

const AdminMemberList = () => {
    const [members, setMembers] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('ID');
    const [q, setQ] = useState('');

    dayjs.locale("ko");

    useEffect(() => {
        fetchMembers(1)
    }, []);

    const fetchMembers = async (page) => {
        if (pageDataCache[`${f}_${q}_${page}`]) {
            setMembers(pageDataCache[`${f}_${q}_${page}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/member', {
                params: {page, size: 20, f, q}
            });

            const {members: fetchedMembers, totalCount, totalPages} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${q}_${page}`]: fetchedMembers,
            }));

            setMembers(fetchedMembers);
            setPageCount(totalPages);

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
        {header: '주소', accessor: 'addr'},
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
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-member-list">
                    <AdminSearch
                        f={f}
                        setF={setF}
                        q={q}
                        setQ={setQ}
                        onSearch={handleSearch}
                        options={options}
                    />
                    <AdminTable columns={columns} data={formattedMembers} onRowClick={handleRowClick}/>
                    <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
                </div>
            </div>
        </div>
    );
};

export default AdminMemberList;
