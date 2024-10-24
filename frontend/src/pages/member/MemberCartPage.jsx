import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import '/src/styles/pages/member/MemberCartPage.css';

const CartPage = () => {
  // 임시 장바구니 데이터
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: '디벨라 파스타 스파게티니 500g/EA',
      price: 1650,
      quantity: 2,
      image: 'https://via.placeholder.com/150',
      checked: true,
    },
    {
      id: 2,
      name: '밀락골드 무가당 휘핑크림 1L/PK',
      price: 3000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      checked: true,
    },
    {
      id: 3,
      name: '밀락골드 무가당 휘핑크림 1L/PK',
      price: 50000,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
      checked: true,
    },
    // 추가적인 상품들...
  ]);

  const [isAllChecked, setIsAllChecked] = useState(true);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(1);
  const navigate = useNavigate();

  // 전체 선택 토글 함수
  const toggleSelectAll = () => {
    const newCheckedStatus = !isAllChecked;
    setIsAllChecked(newCheckedStatus);
    setCartItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: newCheckedStatus }))
    );
  };

  // 개별 아이템 선택 토글 함수
  const toggleItemCheck = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 선택된 아이템 삭제 함수
  const removeSelectedItems = () => {
    setCartItems((prevItems) => prevItems.filter((item) => !item.checked));
    setIsAllChecked(false);
  };

  useEffect(() => {
    const allChecked = cartItems.length > 0 && cartItems.every((item) => item.checked);
    setIsAllChecked(allChecked);
  }, [cartItems]);

  // 수량 조절 모달 열기
  const openQuantityModal = (item) => {
    setSelectedItem(item);
    setTempQuantity(item.quantity);
    setQuantityModalOpen(true);
  };

  // 수량 조절 모달 닫기
  const closeQuantityModal = () => {
    setQuantityModalOpen(false);
    setSelectedItem(null);
  };

  // 수량 업데이트 함수
  const updateQuantity = () => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItem.id ? { ...item, quantity: tempQuantity } : item
      )
    );
    closeQuantityModal();
  };

  // 수량 증가 함수
  const increaseTempQuantity = () => {
    setTempQuantity((prevQuantity) => prevQuantity + 1);
  };

  // 수량 감소 함수
  const decreaseTempQuantity = () => {
    setTempQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // 상품 삭제 함수
  const removeItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  // 총 가격 계산 함수
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => item.checked)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 선택된 상품 개수 계산
  const selectedItemCount = cartItems.filter((item) => item.checked).length;
  // 최소 주문 금액
  const MIN_ORDER_AMOUNT = 100000;

  const handleOrder = () => {
    const selectedItems = cartItems.filter((item) => item.checked);
    navigate('/payment', { state: { selectedItems } });
  }

  return (
    <div className="cart-page">
      <MemberHeader />

      <div className="cart-container">
        <div className="cart-header">
          <h2>장바구니</h2>
          <div className="cart-progress">
            <div className="progress-step completed">1</div>
            <div className="progress-step">2</div>
            <div className="progress-step">3</div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            {/* 왼쪽 영역: 전체 선택 및 상품 리스트 */}
            <div className="cart-left">
              {/* 전체 선택 및 선택 삭제 */}
              <div className="cart-actions">
                <div className="select-all">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={toggleSelectAll}
                    id="select-all"
                  />
                  <label htmlFor="select-all">전체 선택</label>
                </div>
                <button className="delete-selected" onClick={removeSelectedItems}>
                  선택 삭제
                </button>
              </div>

              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <input
                      type="checkbox"
                      className="cart-item-checkbox"
                      checked={item.checked}
                      onChange={() => toggleItemCheck(item.id)}
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <button
                        className="quantity-button"
                        onClick={() => openQuantityModal(item)}
                      >
                        수량조절
                      </button>
                    </div>
                    <div className="cart-item-price">
                      <span className="current-price">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                      <span className="quantity-text">수량: {item.quantity}</span>
                    </div>
                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 영역: 요약 정보 */}
            <div className="cart-summary">
              <h3>최종 결제 금액</h3>
              <div className="summary-details">
                <p>
                  주문금액{' '}
                  <span>{calculateTotalPrice().toLocaleString()}원</span>
                </p>
              </div>
              <div className="summary-total">
                <p>
                  총 결제 예정 금액{' '}
                  <span>{calculateTotalPrice().toLocaleString()}원</span>
                </p>
              </div>
              <button
                className="order-button"
                disabled={calculateTotalPrice() < MIN_ORDER_AMOUNT || selectedItemCount === 0}
                onClick={handleOrder}
              >
                주문하기 ({selectedItemCount}개)
              </button>
              {calculateTotalPrice() < MIN_ORDER_AMOUNT && selectedItemCount > 0 && (
                <p className="min-order-message">
                  최소 주문 금액은 {MIN_ORDER_AMOUNT.toLocaleString()}원입니다.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="empty-cart">장바구니에 상품이 없습니다.</p>
        )}
      </div>

      {quantityModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={closeQuantityModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>수량 조절</h2>
            <p>{selectedItem.name}</p>
            <div className="modal-quantity-control">
              <button onClick={decreaseTempQuantity}>-</button>
              <span>{tempQuantity}</span>
              <button onClick={increaseTempQuantity}>+</button>
            </div>
            <button className="modal-confirm-button" onClick={updateQuantity}>
              확인
            </button>
            <button className="modal-close-button" onClick={closeQuantityModal}>
              닫기
            </button>
          </div>
        </div>
      )}

      <MemberFooter />
    </div>
  );
};

export default CartPage;