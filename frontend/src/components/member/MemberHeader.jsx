import { Link } from "react-router-dom";
import '/src/styles/components/member/MemberHeader.css'

const MemberHeader = () => {
  return (
    <header className="member-header">
      <nav className="nav-menu">
        <ul className="nav-list">
          <li><Link to='/notice'>공지사항</Link></li>
          <li><Link to='/deliveryInfo'>배송안내</Link></li>
          <li><Link to='/faq'>FAQ</Link></li>
          <li><Link to='/login'>로그인 / 회원가입</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default MemberHeader;