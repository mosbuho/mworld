import '/src/styles/components/member/MainProduct.css'
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "/src/utils/axiosConfig.js";

const MainProduct = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 10;
  const navigate = useNavigate();

  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetching);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    isFetchingRef.current = isFetching;
  }, [hasMore, isFetching]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);

    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, query);
  }, [location.search]);

  useEffect(() => {
    if (!isFetching) return;
    fetchProducts(page, searchQuery);
  }, [isFetching]);


  const fetchProducts = async (page, query = '') => {
    console.log('Fetching products for page:', page);
    try {
      const response = await axios.get('/api/member/product', {
        params: { page, size: pageSize, f: 'title', q: query },
      });

      const { products: newProducts, totalPages } = response.data;

      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setPage(page + 1);
      setHasMore(page < totalPages);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
    }
  };

  const handleScroll = () => {
    if (
      !hasMoreRef.current ||
      isFetchingRef.current ||
      window.innerHeight + window.pageYOffset < document.documentElement.scrollHeight - 500
    ) {
      return;
    }
    setIsFetching(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="main-product-container">
      {searchQuery && (
        <h2 className="search-result">
          '<strong>{searchQuery}</strong>'에 대한 검색 결과
        </h2>
      )}
      {products.length > 0 ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.no} className="product-card" onClick={() => navigate(`/product/${product.no}`)}>
              <img src={product.titleImg} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-price">
                  <span className="price">{product.price}</span>
                </p>
              </div>
              <button className="cart-button">🛒</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">상품이 존재하지 않습니다.</p>
      )}
    </div>
  );
};

export default MainProduct;