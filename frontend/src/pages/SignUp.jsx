import { useState } from "react";
import { Link } from "react-router-dom";
import '/src/styles/pages/member/SignUp.css';
import DaumPost from '/src/components/DaumPost';


const SignUp = () => {
  const [mockData, setMockData] = useState({
    id: '',
    pw: '',
    confirmPw: '',
    name: '',
    phone: '',
    addr: '',
    detailAddr: '',
    email: '',
  })

  const [error, setError] = useState({});

  const validateFiled = (name, value) => {
    let errorMessage = '';

    // 아이디 4~12자 영문 대소문자, 숫자만 허용
    if (name === 'id') {
      const userIdPattern = /^[a-zA-Z0-9]{4,12}$/;
      if (!userIdPattern.test(value)) {
        errorMessage = '아이디는 4~12자의 영문 대소문자, 숫자만 사용 가능합니다.';
      }
    }

    // 비밀번호 8~20자의 영문, 숫자, 특수문자 조합
    if (name === 'pw') {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
      if (!passwordPattern.test(value)) {
        errorMessage = '비밀번호는 8~20자의 영문, 숫자, 특수문자 조합이어야 합니다.';
      }
    }

    // 비밀번호 확인
    if (name === 'confirmPw') {
      if (value !== mockData.pw) {
        errorMessage = '비밀번호가 일치하지 않습니다.';
      }
    }

    // 전화번호 형식 검사
    if (name === 'phone') {
      const phonePattern = /^[0-9]{10,11}$/;
      if (!phonePattern.test(mockData.phone)) {
        errorMessage = '전화번호는 10~11자리의 숫자만 사용 가능합니다.';
      }
    }

    return errorMessage;
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateFiled(name, value);
    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMockData({
      ...mockData,
      [name]: value
    })
  }

  const setAddress = (address) => {
    setMockData((prevData) => ({
      ...prevData,
      addr: address
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newError = {};
    Object.keys(mockData).forEach((field) => {
      const errorMessage = validateFiled(field, mockData[field]);
      if (errorMessage) {
        newError[field] = fieldError[field];
      }
    })

    setError(newError);

    if (Object.keys(newError).length === 0) {
      const fullAddress = `${mockData.addr} ${mockData.detailAddr}`;

      console.log('회원가입 데이터', {
        ...mockData,
        fullAddress,
      });
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>회원가입</h2>

        <div className="input-group">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="아이디"
            value={mockData.id}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.id && <p className="error-message">{error.id}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="pw">비밀번호</label>
          <input
            type="password"
            id="pw"
            name="pw"
            placeholder="비밀번호"
            value={mockData.pw}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.pw && <p className="error-message">{error.pw}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="confirmPw">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPw"
            name="confirmPw"
            placeholder="비밀번호 확인"
            value={mockData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.confirmPw && <p className="error-message">{error.confirmPw}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일"
            value={mockData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름"
            value={mockData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="phone">전화번호</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="전화번호"
            value={mockData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {error.phone && <p className="error-message">{error.phone}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="addr">주소</label>
          <input
            type="text"
            id="addr"
            name="addr"
            placeholder="주소"
            value={mockData.addr}
            onChange={handleChange}
            required
            readOnly
          />
          <DaumPost setAddress={setAddress} />
        </div>

        <div className="input-group">
          <label htmlFor="detailAddr">상세주소</label>
          <input type="text"
            id="detailAddr"
            name="detailAddr"
            placeholder="상세주소"
            value={mockData.detailAddr}
            onChange={handleChange}
            required />
        </div>

        <button type="submit" className="signup-button">회원가입</button>

        <div className="links">
          <Link to='/login'>이미 계정이 있으신가요? 로그인</Link>
        </div>

      </form>
    </div>
  )
}

export default SignUp;