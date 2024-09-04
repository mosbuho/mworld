import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const provider = determineProvider(location.pathname);

        if (code && provider) {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}`, {
                provider: provider,
                code: code,
            })
            .then(response => {
                const { accessToken, refreshToken, no } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('no', no);
                navigate('/');
            })
            .catch(error => {
                if (error.response) {
                    console.error('소셜 로그인 실패 : ', error.response.data); // 백엔드 응답 메시지 출력
                } else {
                    console.error('소셜 로그인 실패 : ', error.message); // 기타 에러
                }
            });
        }
    }, [location]);

    const determineProvider = (pathname) => {
        if (pathname.includes('kakao')) return 'kakao';
        if (pathname.includes('google')) return 'google';
        if (pathname.includes('naver')) return 'naver';
        return null;
    };

    return <div>소셜 로그인 처리 중...</div>;
};

export default OAuthCallback;
