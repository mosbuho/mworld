// src/pages/member/MyPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/member/MyPage.css';
import MemberFooter from '../../components/member/MemberFooter';
import MemberHeader from '../../components/member/MemberHeader';
import MemberSearch from '../../components/member/MemberSearch';

const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('info');

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
    };

    // 임시 결제 내역
    const mockOrderHistory = [
      {
        orderId: 'ORD123456',
        date: '2024-09-01',
        items: '디벨라 파스타 스파게티니 500g/EA x 5',
        total: '8,250원',
        status: '배송 중',
      },
      {
        orderId: 'ORD123457',
        date: '2024-08-25',
        items: '아이러브밀크 멸균우유 1L/PK x 5',
        total: '7,700원',
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

  if (!userInfo) {
    return <div className='loading-spinner'>사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className='my-page-container'>
      <MemberHeader />
      <MemberSearch />
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
                <div className='info-row'>
                  <span className='info-label'>이름</span>
                  <span className='info-value'>{userInfo.name}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>아이디</span>
                  <span className='info-value'>{userInfo.id}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>이메일</span>
                  <span className='info-value'>{userInfo.email}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>전화번호</span>
                  <span className='info-value'>{userInfo.phone}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>주소</span>
                  <span className='info-value'>{userInfo.addr}</span>
                </div>
                <div className='info-row'>
                  <span className='info-label'>가입일</span>
                  <span className='info-value'>{userInfo.reg_date}</span>
                </div>
              </div>
              <button className='edit-button'>정보 수정</button>
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
                      <th>상품</th>
                      <th>총액</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.date}</td>
                        <td>{order.items}</td>
                        <td>{order.total}</td>
                        <td
                          className={`status ${order.status === '배송 완료'
                              ? 'completed'
                              : order.status === '배송 중'
                                ? 'shipping'
                                : 'canceled'
                            }`}
                        >
                          {order.status}
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
    </div>
  );
};

export default MyPage;
