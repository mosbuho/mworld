import '/src/styles/components/member/MainProduct.css'
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

// 예시 상품 데이터
const mockData = [
  {
    id: 1,
    name: '아이러브밀크 멸균우유 (0.035) 1L/PK',
    price: '1,540원',
    originalPrice: '1,690원',
    discount: '8%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['유우 1위'],
    label: '유우 1위',
  },
  {
    id: 2,
    name: 'CJ 크레잇 냉동 육질탄탄베이컨 1kg/EA',
    price: '17,990원',
    originalPrice: '21,990원',
    discount: '18%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['햄-소시지-베이컨 2위'],
    label: '회원전용특별가',
  },
  {
    id: 3,
    name: '모짜렐라 피자치즈 2.5kg/EA',
    price: '17,990원',
    originalPrice: '21,990원',
    discount: '18%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['모짜렐라 1위'],
    label: '파격특가',
  },
  {
    id: 4,
    name: '밀락골드 무가당 휘핑크림 1L/EA',
    price: '5,290원',
    originalPrice: '5,640원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['쿠킹크림 1위'],
    label: '회원전용특별가',
  },
  {
    id: 5,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 6,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 7,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 8,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 9,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 10,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 11,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 12,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 13,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 14,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 15,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 16,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 17,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 18,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 19,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 20,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 21,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 22,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
  {
    id: 23,
    name: '디벨라 파스타 스파게티니 500g/EA',
    price: '1,650원',
    originalPrice: '1,760원',
    discount: '6%',
    imgSrc: 'https://via.placeholder.com/150', // 상품 이미지 경로
    tags: ['파스타 1위'],
    label: '회원전용특별가',
  },
];

const MainProduct = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);         // 표시할 상품 목록
  const [page, setPage] = useState(1);                  // 페이지 번호 상태
  const [isFetching, setIsFetching] = useState(false);  // 데이터 로딩 상태
  const [hasMore, setHasMore] = useState(true);         // 더 불러올 데이터가 있는지 여부
  const [searchQuery, setSearchQuery] = useState('');   // 검색어 상태
  const [filteredData, setFilteredData] = useState([]); // 필터링된 전체 데이터
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

    // 검색어에 따라 상품 필터링
    const filtered = query
      ? mockData.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      : mockData;

    setFilteredData(filtered);
  }, [location.search]);

  // filteredData 변경 시 상품 목록과 페이지 번호 초기화, 로딩 시작
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setIsFetching(true); // 로딩 시작
  }, [filteredData]);

  // isFetching이 true일 때 상품 로드
  useEffect(() => {
    if (!isFetching) return;
    loadMoreProducts();
  }, [isFetching]);

  const loadMoreProducts = () => {
    console.log('loadMoreProducts called with page:', page);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const newProducts = filteredData.slice(startIndex, endIndex);

    if (newProducts.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => [...prev, ...newProducts]);
      setPage((prevPage) => prevPage + 1);
    }
    setIsFetching(false);
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
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <img src={product.imgSrc} alt={product.name} className="product-image" />
              <div className="product-info">
                <span className="product-label">{product.label}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  <span className="price">{product.price}</span>
                </p>
                <div className="product-tags">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
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