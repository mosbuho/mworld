import '/src/styles/components/member/MainProduct.css'
import { useEffect, useState } from 'react';

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
  const [products, setProducts] = useState([]);         //상품 목록 상태
  const [page, setPage] = useState(1);                  //페이지 번호 상태
  const [isFetching, setIsFetching] = useState(false);  //데이터를 불러오는 중인지 상태
  const [hasMore, setHasMore] = useState(true);         //다음 페이지가 있는지 상태
  const pageSize = 10;

  useEffect(() => {
    loadMoreProducts();
  }, [])

  useEffect(() => {
    if (!isFetching) return;
    loadMoreProducts();
  }, [isFetching]);

  const loadMoreProducts = () => {
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const newProducts = mockData.slice(startIndex, endIndex);

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        const updatedProducts = newProducts.map((product, index) => ({
          ...product,
          id: product.id + (page * pageSize) + index,
        }))

        setProducts((prev) => [...prev, ...updatedProducts]);
        setPage((prev) => prev + 1);
      }
      setIsFetching(false);
    }, 1000);
  }

  const handleScroll = () => {
    if (
      !hasMore ||
      isFetching ||
      window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500
    ) {
      return;
    }
    setIsFetching(true);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.imgSrc} alt={product.name} className="product-image" />
          <div className="product-info">
            <span className="product-label">{product.label}</span>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">
              <span className="discount">{product.discount}</span>
              <span className="price">{product.price}</span>
              <span className="original-price">{product.originalPrice}</span>
            </p>
            <div className="product-tags">
              {product.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <button className="cart-button">🛒</button>
        </div>
      ))

      }
    </div>
  )
}

export default MainProduct;