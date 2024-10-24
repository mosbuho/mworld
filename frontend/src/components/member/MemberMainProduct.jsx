import '/src/styles/components/member/MainProduct.css'
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "/src/utils/axiosConfig.js";

const MainProduct = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);         // 표시할 상품 목록
  const [page, setPage] = useState(1);                  // 페이지 번호 상태
  const [isFetching, setIsFetching] = useState(false);  // 데이터 로딩 상태
  const [hasMore, setHasMore] = useState(true);         // 더 불러올 데이터가 있는지 여부
  const [searchQuery, setSearchQuery] = useState('');   // 검색어 상태
  const pageSize = 10;                                  // 한 페이지에 표시할 상품 수
  const navigate = useNavigate();

  // 최신 상태 값을 유지하기 위한 useRef 훅
  const hasMoreRef = useRef(hasMore);
  const isFetchingRef = useRef(isFetching);

  useEffect(() => {
    hasMoreRef.current = hasMore;
    isFetchingRef.current = isFetching;
  }, [hasMore, isFetching]);

  // 검색어 변경 시 필터링된 데이터 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);

    // 새 검색어가 들어오면 초기화
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, query);
  }, [location.search]);

  // isFetching이 true일 때 상품 로드
  useEffect(() => {
    if (!isFetching) return;
    fetchProducts(page, searchQuery); // 최신 page와 searchQuery 전달
  }, [isFetching]);


  // 서버로부터 상품 데이터를 가져오는 함수
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

  // 스크롤 이벤트 핸들러
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

  // 스크롤 이벤트 리스너 등록 (한 번만 실행)
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