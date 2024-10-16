import '/src/styles/pages/member/ProductDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isBelowMin, setIsBelowMin] = useState(false);


  useEffect(() => {
    const fetchProduct = async () => {
      try {

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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
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
            content: '이 제품은 신선한 우유를 멸균 처리하여 안전하게 제공됩니다. 매일 아침 신선하게 받아보세요!',
            minimumOrder: 5,
          },
        ];

        const productId = parseInt(id);
        const foundProduct = mockData.find((item) => item.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
          setQuantity(foundProduct.minimumOrder);
        } else {
          setError('상품을 찾을 수 없습니다.');
        }
      } catch (error) {
        setError('상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>상품 정보를 불러오는 중입니다...</div>
  }

  // 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
    setIsBelowMin(false);
  }

  // 수량 감소 함수
  const decreaseQuantity = () => {
    if (quantity > product.minimumOrder) {
      setQuantity(prev => prev - 1);
      setIsBelowMin(false);
    } else {
      setIsBelowMin(true);
    }
  }

  if (loading) {
    return <div className="loading-spinner">상품 정보를 불러오는 중입니다...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR') + '원';
  }

  const getPriceNumber = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  }

  const priceNumber = getPriceNumber(product.price);
  const totalPrice = priceNumber * quantity;

  const handleQuickPurchase = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.imgSrc} alt={product.name} className="detail-image" />
        </div>
        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-label">{product.label}</p>
          <p className="product-price">
            <span className="price">{product.price}</span>
          </p>
          <div className="product-tags">
            {product.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          <div className="quantity-selector">
            <button onClick={decreaseQuantity} className="quantity-button" disabled={quantity <= product.minimumOrder}>-</button>
            <span className="quantity">{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-button">+</button>
            <span className='detail-total-price'>{formatPrice(totalPrice)}</span>
          </div>

          {isBelowMin && (
            <p className="min-order-warning">
              최소 주문 수량은 {product.minimumOrder}개입니다.
            </p>
          )}

          <div className='button-group'>
            <button className="detail-cart-button" disabled={quantity < product.minimumOrder}>장바구니에 담기</button>
            <button className='quick-purchase-button' onClick={handleQuickPurchase} disabled={quantity < product.minimumOrder}>바로결제</button>
          </div>

          <div className='shipping-info'>
            <h2>배송 정보</h2>
            <ul>
              <li><strong>배송방법</strong> <span>자체배송</span></li>
              <li><strong>배송비</strong> <span>무료</span></li>
              <li><strong>배송기간</strong> <span>1~2일</span></li>
              <li><strong>최소주문수량</strong> <span>10개</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='product-content'>
        <h2>상품 내용</h2>
        <p>{product.content}</p>
      </div>

      <div className="product-information-notice">
        <h2>상품정보제공고시</h2>

        <h3>받으신 상품에 문제가 있는 경우</h3>
        <ul>
          <li>상품 수령일 포함 7일 이내에 교환 및 환불을 요청할 수 있습니다.</li>
          <li>상품의 정확한 상태를 확인할 수 있도록 사진을 함께 보내주시면 더 빠른 상담이 가능합니다.</li>
          <li>상품 손상 정도에 따라 부분 환불, 환불, 재배송 처리 해 드립니다.</li>
          <li>냉장, 냉동 및 농·수·축산의 식품 특성 상 날씨와 수령시간, 배송에 따라 상품이 녹거나 어는 상품 변질이 있을 수 있으나 이는 제품 하자가 아니므로 교환 및 반품이 불가합니다.</li>
          <li>진공 포장된 제품은 배송 시 흔들림에 의해 진공 풀림 현상이 있을 수 있습니다. 제품 품질에는 전혀 이상이 없으므로 진공 풀림의 이유로 교환/반품/환불 되지 않으니 구매에 착오 없으시길 바랍니다.</li>
        </ul>

        <h3>단순 변심, 주문 착오</h3>

        <h4>냉장/냉동 및 농·수·축산</h4>
        <ul>
          <li>상품 특성 상 재 판매가 어렵기 때문에 반짝배송 / 택배 구분 없이 단순 변심 및 주문 착오 시 교환/반품/환불이 어려운 점 양해 부탁 드립니다.</li>
        </ul>

        <h4>상온</h4>
        <ul>
          <li>상품 수령일 포함 7일 이내에 교환 및 환불을 요청할 수 있습니다.</li>
          <li>파손의 우려가 있는 상품의 경우 교환 및 환불의 제한이 있습니다.</li>
          <li>단순 변심 및 주문 착오 시 배송 상품의 교환 또는 환불 요청의 경우 고객님께서 배송비를 부담하셔야 합니다.</li>
        </ul>

        <h3>교환/반품/환불 처리가 제한되는 경우</h3>
        <ul>
          <li>고객님의 부주의로 인한 보관 상 발생한 변질, 파손의 경우</li>
          <li>당사와 협의 없이 임의로 반송한 경우</li>
          <li>포장을 개봉하였거나 포장이 훼손되어 상품 가치가 상실된 경우</li>
        </ul>

        <h3>환불 처리</h3>
        <p>취소 신청 후 실제 입금 시까지 결제 수단 별 소요 시간입니다.</p>
        <ul>
          <li>신용카드 : 영업일 기준 3~5일 이내 카드사 승인 취소</li>
          <li>실시간 계좌 이체 : 영업일 기준 1~2일 이내 결제한 계좌로 입금 처리</li>
          <li>무통장 입금 : 영업일 기준 15일 이내 환불 요청 계좌로 처리</li>
          <li>예치금 : 영업일 기준 3~5일 이내 결제한 계정의 예치금으로 환급 처리</li>
        </ul>
      </div>
    </div>
  )
}

export default ProductDetail;