import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DaumPost from '/src/components/DaumPost';
import '/src/styles/pages/member/MemberSignUp.css';

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
    business: ''
  });

  const [error, setError] = useState({});

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [timer, setTimer] = useState(300);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // 아이디 중복 검사 관련 상태
  const [isIdChecked, setIsIdChecked] = useState(false);

  useEffect(() => {
    let countdown;
    if (isVerificationCodeSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsVerificationCodeSent(false);
      alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      setIsVerificationModalOpen(false);
    }

    return () => clearInterval(countdown);
  }, [isVerificationCodeSent, timer]);

  const validateField = (name, value) => {
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

    // 전화번호 형식 검사
    if (name === 'phone') {
      const phonePattern = /^\d{10,11}$/;
      if (!phonePattern.test(value)) {
        errorMessage = '전화번호는 10~11자리의 숫자만 사용 가능합니다.';
      }
    }

    // 이메일 형식 검사
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        errorMessage = '유효한 이메일 주소를 입력해주세요.';
      }
    }

    return errorMessage;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 이메일이 변경되면 이메일 인증 상태 초기화
    if (name === 'email') {
      setIsEmailVerified(false);
    }

    // 아이디가 변경되면 아이디 중복 검사 상태 초기화
    if (name === 'id') {
      setIsIdChecked(false);
    }

    setMockData({
      ...mockData,
      [name]: value,
    });
  };

  const setAddress = (address) => {
    setMockData((prevData) => ({
      ...prevData,
      addr: address,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newError = {};
    Object.keys(mockData).forEach((field) => {
      const errorMessage = validateField(field, mockData[field]);
      if (errorMessage) {
        newError[field] = errorMessage;
      }
    });

    if (!isEmailVerified) {
      newError['email'] = '이메일 인증이 완료되지 않았습니다.';
    }

    if (!isIdChecked) {
      newError['id'] = '아이디 중복 검사가 완료되지 않았습니다.';
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
      const fullAddress = `${mockData.addr} ${mockData.detailAddr}`;

      console.log('회원가입 데이터', {
        ...mockData,
        fullAddress,
      });

      // 회원가입 성공 메시지 등 처리
      alert('회원가입이 완료되었습니다.');
    }
  };

  // 이메일 인증 모달 열기
  const openVerificationModal = () => {
    if (!mockData.email) {
      setError((prevError) => ({
        ...prevError,
        email: '이메일을 입력해주세요.',
      }));
      return;
    }

    axios.post("http://localhost:8080/api/auth/email-send", {
      email: mockData.email
    });

    const emailError = validateField('email', mockData.email);
    if (emailError) {
      setError((prevError) => ({
        ...prevError,
        email: emailError,
      }));
      return;
    }

    // 인증번호 전송 로직 '123456'
    setVerificationCode('123456');
    setIsVerificationModalOpen(true);
    setIsVerificationCodeSent(true);
    setTimer(300);
    setInputVerificationCode('');
    alert('인증번호가 전송되었습니다.');
  };

  // 이메일 인증 모달 닫기
  const closeVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setIsVerificationCodeSent(false);
    setTimer(300);
    setVerificationCode('');
    setInputVerificationCode('');
  };

  // 인증번호 입력 변경 핸들러
  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  // 인증번호 확인 핸들러
  const handleVerifyCode = async () => {
    try {
      console.log(mockData.email);
      console.log(inputVerificationCode);
      const response = await axios.post("http://localhost:8080/api/auth/email-verify", {
        email: mockData.email,
        code: inputVerificationCode,
      });

      if (response.status === 200) {
        alert('이메일 인증이 완료되었습니다.');
        setIsEmailVerified(true);
        closeVerificationModal();
        setIsDisabled(true);
      }
    } catch (error) {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  // 아이디 중복 검사 핸들러
  const handleIdCheck = () => {
    if (!mockData.id) {
      setError((prevError) => ({
        ...prevError,
        id: '아이디를 입력해주세요.',
      }));
      return;
    }

    const idError = validateField('id', mockData.id);
    if (idError) {
      setError((prevError) => ({
        ...prevError,
        id: idError,
      }));
      return;
    }

    // 아이디 중복 검사 로직 'testuser'
    if (mockData.id === 'testuser') {
      setError((prevError) => ({
        ...prevError,
        id: '이미 사용 중인 아이디입니다.',
      }));
      setIsIdChecked(false);
    } else {
      alert('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
      setError((prevError) => ({
        ...prevError,
        id: '',
      }));
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group id-group">
          <div className="id-check">
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
            <button
              type="button"
              className="id-check-button"
              onClick={handleIdCheck}
            >
              중복검사
            </button>
          </div>

        </div>

        <div className="input-group">
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
        </div>

        <div className="input-group email-group">
          <div className="email-verification">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일"
              value={mockData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              required
            />
            {!isEmailVerified && (
              <button
                type="button"
                className="verification-button"
                onClick={openVerificationModal}
              >
                인증하기
              </button>
            )}
          </div>
        </div>
        <div className="input-group">
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
        </div>
        <div className="input-group email-group">
          <div className="email-verification">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="사업자등록번호"
              value={mockData.business}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isDisabled}
              required
            />
            {/* {!isEmailVerified && ( */}
            <button
              type="button"
              className="verification-button"
              onClick={() => { console.log("test") }}
            >
              인증하기
            </button>
            {/* )} */}
          </div>
        </div>
        <div className="input-group address-group">
          <div className="address-search">
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
        </div>
        <div className="input-group">
          <input
            type="text"
            id="detailAddr"
            name="detailAddr"
            placeholder="상세주소"
            value={mockData.detailAddr}
            onChange={handleChange}
            required
          />
        </div>
        {error.id && <p className="error-message">{error.id}</p>}
        {error.pw && <p className="error-message">{error.pw}</p>}
        {error.email && <p className="error-message">{error.email}</p>}
        {error.phone && <p className="error-message">{error.phone}</p>}
        <button type="submit" className="signup-button">회원가입</button>

        <div className="links">
          <Link to='/login'>이미 계정이 있으신가요? 로그인</Link>
        </div>
      </form>

      {/* 이메일 인증 모달 */}
      {isVerificationModalOpen && (
        <div className='modal-overlay' onClick={closeVerificationModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <p>{mockData.email}로 전송된 인증번호를 입력해주세요.</p>
            <div className='input-group'>
              <input
                type='text'
                value={inputVerificationCode}
                onChange={handleVerificationCodeChange}
                className='verification-input'
                placeholder='인증번호 입력'
              />
            </div>
            <div className='timer'>
              남은 시간: {Math.floor(timer / 60)}분 {timer % 60}초
            </div>
            <div className='modal-buttons'>
              <button className='modal-save-button' onClick={handleVerifyCode}>
                확인
              </button>
              <button className='modal-cancel-button' onClick={closeVerificationModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;