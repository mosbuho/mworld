import '/src/styles/pages/member/ProductDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from "/src/utils/axiosConfig.js";
import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const ProductDetail = () => {
  const { no } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isBelowMin, setIsBelowMin] = useState(false);


  useEffect(() => {
    fetchProduct();
  }, [no]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/member/product/${no}`);
      const foundProduct = response.data;

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('상품을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('상품을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>상품 정보를 불러오는 중입니다...</div>
  }

  const getEditorStateFromRaw = (rawContent) => {
    const contentState = convertFromRaw(JSON.parse(rawContent));
    return EditorState.createWithContent(contentState);
  };

  // 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
    setIsBelowMin(false);
  }

  // 수량 감소 함수
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
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
    return price.toLocaleString() + '원';
  }

  const totalPrice = product.price * quantity;

  const handleQuickPurchase = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <div className="product-detail-container">
        <div className="product-image-section">
          <img src={product.titleImg} alt={product.title} className="detail-image" />
        </div>
        <div className="product-info-section">
          <h1 className="product-name">{product.title}</h1>
          <p className="product-price">
            <span className="price">{product.price.toLocaleString()}원</span>
          </p>
          <div className="quantity-selector">
            <button onClick={decreaseQuantity} className="quantity-button" disabled={quantity <= product.minimumOrder}>-</button>
            <span className="quantity">{quantity}</span>
            <button onClick={increaseQuantity} className="quantity-button">+</button>
            <span className='detail-total-price'>{formatPrice(totalPrice)}</span>
          </div>

          {isBelowMin && (
            <p className="min-order-warning">
              최소 주문 수량은 1개입니다.
            </p>
          )}

          <div className='button-group'>
            <button className="detail-cart-button" >장바구니에 담기</button>
            <button className='quick-purchase-button' onClick={handleQuickPurchase} disabled={totalPrice < 100000}>바로결제</button>
          </div>

          <div className='shipping-info'>
            <h2>배송 정보</h2>
            <ul>
              <li><strong>배송방법</strong> <span>자체배송</span></li>
              <li><strong>배송비</strong> <span>무료</span></li>
              <li><strong>배송기간</strong> <span>1~2일</span></li>
              <li><strong>최소주문금액</strong> <span>100,000원</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='product-content'>
        <h2>상품 내용</h2>
        <div className="product-content">
          <Editor
              editorState={getEditorStateFromRaw(product.content)}
              readOnly={true}
              toolbarHidden={true}
          />
        </div>
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