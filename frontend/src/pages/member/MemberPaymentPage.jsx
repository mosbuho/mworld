import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MemberHeader from '../../components/member/MemberHeader';
import MemberFooter from '../../components/member/MemberFooter';
import DaumPost from "../../components/common/DaumPost.jsx";
import '/src/styles/pages/member/PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  // Mock 사용자 데이터
  const userInfo = {
    name: '홍길동',
    phone: '01012345678',
    email: 'hong@example.com',
    address: '서울특별시 강남구 테헤란로 123',
    addressDetail: '123동 123호',
  };

  const [paymentMethod, setPaymentMethod] = useState('bank'); // 'card'
  const [customerName, setCustomerName] = useState(userInfo.name);
  const [customerPhone, setCustomerPhone] = useState(userInfo.phone);
  const [customerEmail, setCustomerEmail] = useState(userInfo.email);
  const [customerAddress, setCustomerAddress] = useState(userInfo.address);
  const [customerAddressDetail, setCustomerAddressDetail] = useState(userInfo.addressDetail);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [totalPrice, setTotalPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    // 총 주문 금액 계산
    const price = selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotalPrice(price);
  }, [selectedItems]);

  useEffect(() => {
    // 결제 방법에 따른 최종 금액 계산
    if (paymentMethod === 'card') {
      const feeAmount = Math.floor(totalPrice * 0.03);
      setFee(feeAmount);
      setFinalPrice(totalPrice + feeAmount);
    } else {
      setFee(0);
      setFinalPrice(totalPrice);
    }
  }, [paymentMethod, totalPrice]);

  // 유효성 검사 함수
  const validate = () => {
    const newErrors = {};

    if (!customerName.trim()) newErrors.customerName = '이름을 입력해주세요.';
    if (!customerPhone.trim()) {
      newErrors.customerPhone = '연락처를 입력해주세요.';
    } else if (!/^\d{10,11}$/.test(customerPhone)) {
      newErrors.customerPhone = '유효한 연락처를 입력해주세요.';
    }
    if (!customerEmail.trim()) {
      newErrors.customerEmail = '이메일을 입력해주세요.';
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(customerEmail)
    ) {
      newErrors.customerEmail = '유효한 이메일 주소를 입력해주세요.';
    }
    if (!customerAddress.trim()) newErrors.customerAddress = '주소를 입력해주세요.';
    if (!agreeTerms) {
      newErrors.agreeTerms = '구매 조건 및 결제 진행에 동의해야 합니다.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 결제 처리 함수
  const handlePayment = async () => {
    if (!validate()) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('결제가 완료되었습니다.');
    } catch (error) {
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <MemberHeader />

      <div className="payment-container">
        <div className="payment-header">
          <h2>결제하기</h2>
          <div className="payment-progress">
            <div className="progress-step completed">1</div>
            <div className="progress-step completed">2</div>
            <div className="progress-step">3</div>
          </div>
        </div>

        <div className="payment-content">
          <div className="payment-left">
            <div className="order-summary">
              <h3>주문 상품</h3>
              <div className="order-items">
                {selectedItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      <p>수량: {item.quantity}</p>
                    </div>
                    <div className="order-item-price">
                      <span className="current-price">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="payment-right">
            <div className="payment-info">
              <div className="buyer-info">
                <h3>주문 고객 정보</h3>
                <div className="input-group">
                  <label htmlFor="customerName">이름</label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    maxLength={50}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {errors.customerName && (
                    <span className="error-message">{errors.customerName}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="customerPhone">연락처</label>
                  <input
                    type="text"
                    id="customerPhone"
                    value={customerPhone}
                    maxLength={11}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  {errors.customerPhone && (
                    <span className="error-message">{errors.customerPhone}</span>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="customerEmail">이메일</label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={customerEmail}
                    maxLength={100}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled
                  />
                  {errors.customerEmail && (
                    <span className="error-message">{errors.customerEmail}</span>
                  )}
                </div>
                <div className="input-group address-group">
                  <label htmlFor="customerAddress">배송지 주소</label>
                  <div className='address-search'>
                    <input
                      type="text"
                      id="customerAddress"
                      value={customerAddress}
                      maxLength={100}
                      disabled
                    />
                    <DaumPost setAddress={setCustomerAddress} />
                  </div>
                  <input type="text"
                    id='customerAddressDetail'
                    value={customerAddressDetail}
                    maxLength={100}
                    onChange={(e) => setCustomerAddressDetail(e.target.value)}
                    placeholder='상세 주소를 입력해주세요.'
                  />

                  {errors.customerAddress && (
                    <span className="error-message">{errors.customerAddress}</span>
                  )}
                </div>
              </div>

              <div className="payment-summary">
                <h3>결제 방법 선택</h3>
                <div className="payment-method">
                  <label className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                    />
                    계좌 입금
                  </label>
                  <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    카드 결제
                  </label>
                </div>

                <h3>결제 금액</h3>
                <div className="summary-details">
                  <p>
                    상품 금액 <span>{totalPrice.toLocaleString()}원</span>
                  </p>
                  {paymentMethod === 'card' && (
                    <p>
                      카드 수수료 (3%) <span>{fee.toLocaleString()}원</span>
                    </p>
                  )}
                </div>
                <div className="summary-total">
                  <p>
                    총 결제 금액{' '}
                    <span className="final-price">{finalPrice.toLocaleString()}원</span>
                  </p>
                </div>

                <div className="agree-terms">
                  <label>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms(!agreeTerms)}
                    />
                    구매 조건 및 결제 진행에 동의합니다.
                  </label>
                  {errors.agreeTerms && (
                    <span className="error-message">{errors.agreeTerms}</span>
                  )}
                </div>

                <button
                  className="order-button"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? '결제 처리 중...' : '결제하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MemberFooter />
    </div>
  );
};

export default PaymentPage;
