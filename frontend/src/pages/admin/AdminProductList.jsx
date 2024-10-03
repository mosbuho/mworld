import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import axios from "/src/utils/axiosConfig.js";
import AdminTable from "../../components/admin/AdminTable.jsx";
import {useNavigate} from "react-router-dom";
import AdminPagination from "../../components/admin/AdminPagination.jsx";
import AdminSearch from "../../components/admin/AdminSearch.jsx";
import "/src/styles/pages/admin/AdminProductList.css"
import AdminHeader from "../../components/admin/AdminHeader.jsx";

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('title');
    const [q, setQ] = useState('');
    const nav = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
        fetchProducts(1);
    }, []);

    const fetchProducts = async (page) => {
        if (pageDataCache[`${f}_${page}`]) {
            setProducts(pageDataCache[`${f}_${page}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/product', {
                params: {page, size: 20, f, q}
            });
            const {products: fetchedProducts, totalCount} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${page}`]: fetchedProducts,
            }));

            setProducts(fetchedProducts);
            setPageCount(Math.ceil(totalCount / 20));
        } catch (err) {
            console.error("failed to load product-list", err);
        }
    };

    const handlePageClick = (selectedPage) => {
        const newPage = selectedPage.selected + 1;
        setCurrentPage(selectedPage.selected);
        fetchProducts(newPage);
    };

    const handleSearch = () => {
        setCurrentPage(0);
        setPageDataCache({});
        fetchProducts(1);
    };

    const handleRowClick = (product, nav) => {
        nav(`/admin/product/${product.no}`, {state: {product}});
    };

    const columns = [
        {header: '번호', accessor: 'no'},
        {header: '상품명', accessor: 'title'},
        {header: '카테고리', accessor: 'category'},
        {header: '재고', accessor: 'quantity'},
        {header: '가격', accessor: 'price'},
    ]

    const options = [
        {value: 'TITLE', label: '상품명'},
    ]

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
                <div className="admin-product-filter">
                    <button onClick={() => nav('/admin/product/create')}>상품등록</button>
                </div>
                <AdminTable columns={columns} data={products} onRowClick={handleRowClick}/>
                <AdminPagination pageCount={pageCount} handlePageClick={handlePageClick} currentPage={currentPage}/>
            </div>
        </div>
    );
};

export default AdminProductList;