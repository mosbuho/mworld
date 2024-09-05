import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MemberLogin = ({ title, isAdmin }) => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", { id, pw });
            const { accessToken, refreshToken, no } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('no', no);
            navigate('/');
        } catch (error) {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            console.error(error);
        }
    };

    const handleSocialLogin = (provider) => {
        let authUrl = '';

        switch (provider) {
            case '카카오':
                if (!import.meta.env.VITE_KAKAO_CLIENT_ID) {
                    console.log('Missing Kakao Client ID');
                    return;
                  }
                authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}/kakao&response_type=code&scope=profile_nickname,account_email,phone_number`;
                break;
            case '네이버':
                if (!import.meta.env.VITE_NAVER_CLIENT_ID) {
                    console.log('Missing Naver Client ID');
                    return;
                }
                const state = Math.random().toString(36).substr(2, 12);
                authUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}/naver&response_type=code&state=${state}&scope=email`;
                break;
            case '구글':
                if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
                    console.log('Missing Google Client ID');
                    return;
                  }
                authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}/google&response_type=code&scope=email profile`;
                break;
            default:
                console.log('Invalid provider or missing client ID');
                return;
        }
        window.location.href = authUrl;
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>{title}</h2>
                <div className="input-group">
                    <label htmlFor="username">아이디</label>
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
                    <label htmlFor="password">비밀번호</label>
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
                <button type="button" className="signup-button">사업자 회원가입</button>


                {!isAdmin && (
                    <div className="social-login">
                        <button
                            type="button"
                            className="social-button naver"
                            onClick={() => handleSocialLogin('네이버')}
                        >
                            <img src="src/utils/Images/btnG_아이콘사각.png" alt="" />
                        </button>
                        <button
                            type="button"
                            className="social-button kakao"
                            onClick={() => handleSocialLogin('카카오')}
                        >
                            <img src="src/utils/Images/카카오톡.png" alt="" />
                        </button>
                        <button
                            type="button"
                            className="social-button google"
                            onClick={() => handleSocialLogin('구글')}
                        >
                            <img src="src/utils/Images/web_neutral_sq_na@4x.png" alt="" />
                        </button>
                    </div>
                )}
                <div className="links">
                    <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a>
                </div>
            </form>
        </div>
    )
}

export default MemberLogin;