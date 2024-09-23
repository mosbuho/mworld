import '/src/styles/components/member/MemberFooter.css'

const MemberFooter = () => {

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>회사정보</h3>
          <ul>
            <li>회사명: 명치세상</li>
            <li>사업자등록번호: 123-45-6789</li>
            <li>주소: 경기도 남양주시 123</li>
            <li>대표: 최성락</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>고객센터</h3>
          <ul>
            <li>전화번호: 02-0000-1111</li>
            <li>이메일: abc@info.com</li>
            <li>운영시간: 평일 9:00 - 18:00</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>정책</h3>
          <ul>
            <li><a href="#">이용 약관</a></li>
            <li><a href="#">개인정보 처리방침</a></li>
            <li><a href="#">환불 정책</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 명치세상. All Rights Reserved.</p>
        <div className="social-icons">
          <a href="#"><img src="https://via.placeholder.com/20" alt="Facebook" /></a>
          <a href="#"><img src="https://via.placeholder.com/20" alt="Instagram" /></a>
          <a href="#"><img src="https://via.placeholder.com/20" alt="Twitter" /></a>
        </div>
      </div>
    </footer>
  )
}

export default MemberFooter;