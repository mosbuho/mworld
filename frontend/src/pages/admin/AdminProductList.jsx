import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import axios from "axios";
import AdminTable from "../../components/admin/AdminTable.jsx";
import {useNavigate} from "react-router-dom";

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageDataCache, setPageDataCache] = useState({});
    const [f, setF] = useState('title');
    const [q, setQ] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const nav = useNavigate();

    dayjs.locale("ko");

    useEffect(() => {
    }, []);

    const fetchProducts = async (page) => {
        if (pageDataCache[`${f}_${page}_${startDate}_${endDate}`]) {
            setProducts(pageDataCache[`${f}_${page}_${startDate}_${endDate}`]);
            return;
        }
        try {
            const res = await axios.get('/api/admin/products-list', {
                params: {page, size: 20, f, q, startDate, endDate}
            });
            const {products: fetchedProducts, totalCount} = res.data;
            setPageDataCache(prevCache => ({
                ...prevCache,
                [`${f}_${page}_${startDate}_${endDate}`]: fetchedProducts,
            }));

            setProducts(fetchedProducts);
            setPageCount(Math.ceil(totalCount / 20));
        } catch (err) {
            console.error("failed to load products-list", err);
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
        nav(`/admin/products/${product.no}`, {state: {product}});
    };

    const columns = [
        {header: '번호', accessor: 'no'},
        {header: '이미지', accessor: 'titleImg'},
        {header: '상품명', accessor: 'title'},
        // {header : '카테고리', accessor: 'category'},
        {header: '재고', accessor: 'quantity'},
        {header: '가격', accessor: 'price'},
    ]

    const options = [
        {value: 'ID', label: 'ID'},
        {value: 'TITLE', label: '상품명'},
        {value: 'PHONE', label: 'PHONE'},
    ]

    return (
        <div className="admin-product-list">
            <h1>상품리스트</h1>
            <AdminSidebar/>
            <button onClick={() => nav('/admin/product/create')}>상품등록</button>
            <div className="product-list">
                <AdminTable columns={columns} data={products} onRowClick={handleRowClick}/>
            </div>
        </div>
    );
};

export default AdminProductList;