import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '/src/styles/components/common/Login.css';

const Login = ({ isAdmin }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginEndpoint = isAdmin ? "http://localhost:8080/api/admin/auth/login" : "http://localhost:8080/api/auth/login";
    try {
      const response = await axios.post(loginEndpoint, { id, pw });
      const { accessToken, refreshToken, no } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('no', no);
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="login-header">
          <Link to="/">
            명치세상
          </Link>
        </div>
        <div className="input-group">
          <input
            type="text"
            id="username"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">로그인</button>
        {!isAdmin && (
          <>
            <button type="button" className="signup-button">
              <Link to="/signup">사업자 회원가입</Link>
            </button>
            <div className="links">
              <a href="#">아이디 찾기</a>
              <a href="#">비밀번호 찾기</a>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
