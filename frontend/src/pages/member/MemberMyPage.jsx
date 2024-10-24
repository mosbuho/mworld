import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/member/MemberMyPage.css';
import MemberFooter from '../../components/member/MemberFooter';
import MemberHeader from '../../components/member/MemberHeader';
import DaumPost from "../../components/common/DaumPost.jsx";

const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 추가된 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [editValue, setEditValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [detailAddress, setDetailAddress] = useState('');
  const [pendingChanges, setPendingChanges] = useState({});

  // 비밀번호 변경 모달 관련 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  // 이메일 인증 관련 상태
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [timer, setTimer] = useState(300); // 5분(300초)

  useEffect(() => {
    // 임시 사용자 정보
    const mockUserInfo = {
      id: 'testuser',
      name: '홍길동',
      phone: '010-1234-5678',
      addr: '서울특별시 강남구 역삼동 123-45',
      email: 'testuser@example.com',
      reg_date: '2023-01-15',
      provider: 'Local',
      password: 'password123!',
    };

    // 임시 결제 내역
    const mockOrderHistory = [
      {
        orderId: 'ORD123456',
        date: '2024-09-01',
        items: [
          { name: '디벨라 파스타 스파게티니 500g/EA', quantity: 5, price: 1650 },
          { name: '밀락골드 무가당 휘핑크림 1L/PK', quantity: 2, price: 3000 },
        ],
        total: 14250,
        status: '배송 중',
      },
      {
        orderId: 'ORD123457',
        date: '2024-08-25',
        items: [
          { name: '아이러브밀크 멸균우유 1L/PK', quantity: 5, price: 1540 },
        ],
        total: 7700,
        status: '배송 완료',
      },
      // 추가적인 결제 내역...
    ];

    setUserInfo(mockUserInfo);
    setOrderHistory(mockOrderHistory);
  }, []);

  useEffect(() => {
    const isLoggedIn = true;
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // 타이머 관리
  useEffect(() => {
    let countdown;
    if (isVerificationCodeSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsVerificationCodeSent(false);
      alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }

    return () => clearInterval(countdown);
  }, [isVerificationCodeSent, timer]);

  if (!userInfo) {
    return <div className='loading-spinner'>사용자 정보를 불러오는 중...</div>;
  }

  // 주문 상세 모달 열기
  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // 주문 상세 모달 닫기
  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // 정보 수정 모달 열기
  const openEditModal = (field) => {
    setFieldToEdit(field);
    setEditValue(userInfo[field]);
    setIsEditModalOpen(true);
    setErrors({});
    setVerificationCode('');
    setDetailAddress('');
    setIsVerificationCodeSent(false);
    setTimer(300);
  };

  // 정보 수정 모달 닫기
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFieldToEdit('');
    setEditValue('');
    setErrors({});
    setVerificationCode('');
    setDetailAddress('');
    setIsVerificationCodeSent(false);
    setTimer(300);
  };

  // 수정 값 변경 핸들러
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // 상세 주소 변경 핸들러
  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  // 인증번호 입력 변경 핸들러
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 인증번호 전송 버튼 클릭 핸들러
  const handleSendVerificationCode = () => {
    setIsVerificationCodeSent(true);
    setVerificationCode('');
    setTimer(300);
  };

  // 수정 값 저장 핸들러
  const handleSave = () => {
    // 유효성 검사
    if (fieldToEdit === 'phone') {
      const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(editValue)) {
        setErrors({ phone: '전화번호 형식이 올바르지 않습니다.' });
        return;
      }
    }

    if (fieldToEdit === 'email') {
      if (!verificationCode) {
        setErrors({ verificationCode: '인증번호를 입력해주세요.' });
        return;
      }
      if (verificationCode !== '123456') {
        setErrors({ verificationCode: '인증번호가 올바르지 않습니다.' });
        return;
      }
    }

    if (fieldToEdit === 'addr') {
      if (!editValue) {
        setErrors({ addr: '주소를 입력해주세요.' });
        return;
      }
      if (!detailAddress) {
        setErrors({ detailAddress: '상세 주소를 입력해주세요.' });
        return;
      }
      // 주소와 상세 주소를 합침
      const fullAddress = `${editValue} ${detailAddress}`;
      setPendingChanges((prevChanges) => ({
        ...prevChanges,
        addr: fullAddress,
      }));
      closeEditModal();
      return;
    }

    // 변경 사항을 pendingChanges에 저장
    setPendingChanges((prevChanges) => ({
      ...prevChanges,
      [fieldToEdit]: editValue,
    }));
    closeEditModal();
  };

  // 주소 선택 시 호출되는 콜백 함수
  const handleAddressSelect = (address) => {
    setEditValue(address);
  };

  // DaumPost에서 사용하는 setAddress 함수
  const setAddress = (address) => {
    setEditValue(address);
  };

  // 변경사항 적용 함수
  const applyChanges = () => {
    const confirmed = window.confirm('정말 변경하시겠습니까?');
    if (confirmed) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        ...pendingChanges,
      }));
      setPendingChanges({});
    }
  };

  // 비밀번호 변경 모달 열기
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordErrors({});
  };

  // 비밀번호 변경 모달 닫기
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordErrors({});
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = () => {
    const errors = {};

    // 현재 비밀번호 확인 
    if (currentPassword !== userInfo.password) {
      errors.currentPassword = '현재 비밀번호가 올바르지 않습니다.';
    }

    // 새 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,20}$/;
    if (!passwordRegex.test(newPassword)) {
      errors.newPassword = '비밀번호는 8~20자의 영문, 숫자, 특수문자 조합이어야 합니다.';
    }

    // 새 비밀번호와 확인 비밀번호 일치 여부 확인
    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // 비밀번호 변경 로직 (서버와 통신하여 변경)
    alert('비밀번호가 성공적으로 변경되었습니다.');
    closePasswordModal();
  };

  return (
    <div className='my-page-container'>
      <MemberHeader />
      <main className='my-page-content'>
        {/* 탭 네비게이션 */}
        <div className='tab-navigation'>
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            내 정보
          </button>
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            결제 내역
          </button>
        </div>

        {/* 내 정보 섹션 */}
        {activeTab === 'info' && (
          <div className='my-info'>
            <div className='info-card'>
              <h2 className='section-title'>내 정보</h2>
              <div className='profile-details'>
                {/* 아이디 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>아이디</span>
                    <span className='info-value'>{userInfo.id}</span>
                  </div>
                </div>
                {/* 이름 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>이름</span>
                    <span
                      className={`info-value ${pendingChanges['name'] ? 'modified' : ''
                        }`}
                    >
                      {pendingChanges['name'] || userInfo['name']}
                    </span>
                  </div>
                  <span className='info-edit' onClick={() => openEditModal('name')}>
                    수정
                  </span>
                </div>
                {/* 이메일 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>이메일</span>
                    <span
                      className={`info-value ${pendingChanges['email'] ? 'modified' : ''
                        }`}
                    >
                      {pendingChanges['email'] || userInfo['email']}
                    </span>
                  </div>
                  <span className='info-edit' onClick={() => openEditModal('email')}>
                    수정
                  </span>
                </div>
                {/* 전화번호 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>전화번호</span>
                    <span
                      className={`info-value ${pendingChanges['phone'] ? 'modified' : ''
                        }`}
                    >
                      {pendingChanges['phone'] || userInfo['phone']}
                    </span>
                  </div>
                  <span className='info-edit' onClick={() => openEditModal('phone')}>
                    수정
                  </span>
                </div>
                {/* 주소 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>주소</span>
                    <span
                      className={`info-value ${pendingChanges['addr'] ? 'modified' : ''
                        }`}
                    >
                      {pendingChanges['addr'] || userInfo['addr']}
                    </span>
                  </div>
                  <span className='info-edit' onClick={() => openEditModal('addr')}>
                    수정
                  </span>
                </div>
                {/* 가입일 */}
                <div className='info-row'>
                  <div className='info-text'>
                    <span className='info-label'>가입일</span>
                    <span className='info-value'>{userInfo.reg_date}</span>
                  </div>
                </div>
              </div>
              {/* 비밀번호 변경 버튼 */}
              <div className='password-change-container'>
                <button
                  className='password-change-button'
                  onClick={openPasswordModal}
                >
                  비밀번호 변경
                </button>
              </div>
              {/* 변경사항 적용 버튼 */}
              {Object.keys(pendingChanges).length > 0 && (
                <div className='apply-changes-container'>
                  <button className='apply-changes-button' onClick={applyChanges}>
                    변경사항 적용
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 결제 내역 섹션 */}
        {activeTab === 'orders' && (
          <div className='order-history'>
            <h2 className='section-title'>결제 내역</h2>
            {orderHistory.length > 0 ? (
              <div className='orders-table-container'>
                <table className='orders-table'>
                  <thead>
                    <tr>
                      <th>주문 번호</th>
                      <th>주문 날짜</th>
                      <th>상품 수</th>
                      <th>총액</th>
                      <th>상태</th>
                      <th>상세보기</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.date}</td>
                        <td>{order.items.length}개</td>
                        <td>{order.total.toLocaleString()}원</td>
                        <td className='order-status'>{order.status}</td>
                        <td>
                          <button
                            className='order-detail-button'
                            onClick={() => openOrderModal(order)}
                          >
                            상세정보 보기
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>결제 내역이 없습니다.</p>
            )}
          </div>
        )}
      </main>
      <MemberFooter />

      {/* 주문 상세 모달 */}
      {isModalOpen && selectedOrder && (
        <div className='modal-overlay' onClick={closeOrderModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2>주문 상세 정보</h2>
            <p>주문 번호: {selectedOrder.orderId}</p>
            <p>주문 날짜: {selectedOrder.date}</p>
            <table className='modal-table'>
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}개</td>
                    <td>{(item.price * item.quantity).toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className='modal-total'>
              총액: {selectedOrder.total.toLocaleString()}원
            </p>
            <button className='modal-close-button' onClick={closeOrderModal}>
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 정보 수정 모달 */}
      {isEditModalOpen && (
        <div className='modal-overlay' onClick={closeEditModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2>{`${fieldToEdit === 'name'
              ? '이름'
              : fieldToEdit === 'email'
                ? '이메일'
                : fieldToEdit === 'phone'
                  ? '전화번호'
                  : fieldToEdit === 'addr'
                    ? '주소'
                    : ''
              } 수정`}</h2>
            {fieldToEdit !== 'addr' ? (
              <>
                <div className='input-group'>
                  <input
                    type='text'
                    value={editValue}
                    onChange={handleEditChange}
                    className='edit-input'
                    disabled={fieldToEdit === 'email' && isVerificationCodeSent}
                  />
                  {fieldToEdit === 'email' && !isVerificationCodeSent && (
                    <button
                      className='send-code-button'
                      onClick={handleSendVerificationCode}
                    >
                      인증번호 전송
                    </button>
                  )}
                </div>
                {fieldToEdit === 'phone' && (
                  <p className='input-helper-text'>형식: 010-1234-5678</p>
                )}
                {errors[fieldToEdit] && (
                  <p className='error-text'>{errors[fieldToEdit]}</p>
                )}
                {/* 인증번호 입력 필드 및 타이머 */}
                {fieldToEdit === 'email' && isVerificationCodeSent && (
                  <>
                    <div className='input-group' style={{ marginTop: '16px' }}>
                      <input
                        type='text'
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        className='edit-input'
                        placeholder='인증번호를 입력하세요'
                      />
                      {errors.verificationCode && (
                        <p className='error-text'>{errors.verificationCode}</p>
                      )}
                    </div>
                    <div className='timer'>
                      남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className='input-group'>
                  <label htmlFor='addr'>주소</label>
                  <div className='address-search'>
                    <input
                      type='text'
                      id='addr'
                      name='addr'
                      placeholder='주소를 검색하세요'
                      value={editValue}
                      onChange={handleEditChange}
                      className='edit-input'
                      readOnly
                    />
                    <DaumPost setAddress={setAddress} />
                  </div>
                  {errors.addr && <p className='error-text'>{errors.addr}</p>}
                </div>

                <div className='input-group'>
                  <label htmlFor='detailAddr'>상세 주소</label>
                  <input
                    type='text'
                    id='detailAddr'
                    name='detailAddr'
                    placeholder='상세 주소를 입력하세요'
                    value={detailAddress}
                    onChange={handleDetailAddressChange}
                    className='edit-input'
                  />
                  {errors.detailAddress && (
                    <p className='error-text'>{errors.detailAddress}</p>
                  )}
                </div>
              </>
            )}
            <div className='modal-buttons'>
              <button
                className='modal-save-button'
                onClick={handleSave}
                disabled={fieldToEdit === 'email'}
              >
                저장
              </button>
              <button className='modal-cancel-button' onClick={closeEditModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {isPasswordModalOpen && (
        <div className='modal-overlay' onClick={closePasswordModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2>비밀번호 변경</h2>
            <div className='input-group'>
              <label htmlFor='currentPassword'>현재 비밀번호</label>
              <input
                type='password'
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className='edit-input'
              />
              {passwordErrors.currentPassword && (
                <p className='error-text'>{passwordErrors.currentPassword}</p>
              )}
            </div>
            <div className='input-group'>
              <label htmlFor='newPassword'>새 비밀번호</label>
              <input
                type='password'
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='edit-input'
              />
              {passwordErrors.newPassword && (
                <p className='error-text'>{passwordErrors.newPassword}</p>
              )}
            </div>
            <div className='input-group'>
              <label htmlFor='confirmNewPassword'>비밀번호 확인</label>
              <input
                type='password'
                id='confirmNewPassword'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className='edit-input'
              />
              {passwordErrors.confirmNewPassword && (
                <p className='error-text'>{passwordErrors.confirmNewPassword}</p>
              )}
            </div>
            <div className='modal-buttons'>
              <button className='modal-save-button' onClick={handleChangePassword}>
                변경
              </button>
              <button className='modal-cancel-button' onClick={closePasswordModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
