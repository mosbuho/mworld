import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DaumPost from "../../components/common/DaumPost.jsx";
import '/src/styles/pages/member/MemberSignUp.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [inputData, setInputData] = useState({
    id: '',
    pw: '',
    name: '',
    phone: '',
    email: '',
    business: '',
    addr: '',
    detailAddr: ''
  });

  const [error, setError] = useState({});
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [inputVerificationCode, setInputVerificationCode] = useState('');
  const [timer, setTimer] = useState(300);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [bussinessDisabled, setBussinessDisabled] = useState(false);
  const [isBussinessVerified, setBussinessVerified] = useState(false);
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

    if (name === 'id') {
      const userIdPattern = /^[a-zA-Z0-9]{4,12}$/;
      if (!userIdPattern.test(value)) {
        errorMessage = '아이디는 4~12자의 영문 대소문자, 숫자만 사용 가능합니다.';
      }
    }

    if (name === 'pw') {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
      if (!passwordPattern.test(value)) {
        errorMessage = '비밀번호는 8~20자의 영문, 숫자, 특수문자 조합이어야 합니다.';
      }
    }

    if (name === 'phone') {
      const phonePattern = /^\d{10,11}$/;
      if (!phonePattern.test(value)) {
        errorMessage = '전화번호는 10~11자리의 숫자만 사용 가능합니다.';
      }
    }

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

    if (name === 'email') {
      setIsEmailVerified(false);
    }

    if (name === 'id') {
      setIsIdChecked(false);
    }

    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const setAddress = (address) => {
    setInputData((prevData) => ({
      ...prevData,
      addr: address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newError = {};
    Object.keys(inputData).forEach((field) => {
      const errorMessage = validateField(field, inputData[field]);
      if (errorMessage) {
        newError[field] = errorMessage;
      }
    });

    if (!isEmailVerified) newError['email'] = '이메일 인증이 완료되지 않았습니다.';
    if (!isBussinessVerified) newError['business'] = '사업자 등록 번호 인증이 완료되지 않았습니다.';
    if (!isIdChecked) newError['id'] = '아이디 중복 검사가 완료되지 않았습니다.';

    setError(newError);

    if (Object.keys(newError).length === 0) {
      try {
        const response = await axios.post("http://localhost:8080/api/auth/signup", inputData);

        if (response.status === 200) {
          alert('회원가입이 완료되었습니다.');
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }

  const openVerificationModal = () => {
    if (!inputData.email) {
      setError((prevError) => ({
        ...prevError,
        email: '이메일을 입력해주세요.',
      }));
      return;
    }

    axios.post("http://localhost:8080/api/auth/email-send", {
      email: inputData.email
    });

    const emailError = validateField('email', inputData.email);
    if (emailError) {
      setError((prevError) => ({
        ...prevError,
        email: emailError,
      }));
      return;
    }

    setIsVerificationModalOpen(true);
    setIsVerificationCodeSent(true);
    setTimer(300);
    setInputVerificationCode('');
    alert('인증번호가 전송되었습니다.');
  };

  const closeVerificationModal = () => {
    setIsVerificationModalOpen(false);
    setIsVerificationCodeSent(false);
    setTimer(300);
    setInputVerificationCode('');
  };

  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/email-verify", {
        email: inputData.email,
        code: inputVerificationCode,
      });

      if (response.status === 200) {
        alert('이메일 인증이 완료되었습니다.');
        setIsEmailVerified(true);
        closeVerificationModal();
        setEmailDisabled(true);
      }
    } catch (error) {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  const handleIdCheck = async () => {
    if (!inputData.id) {
      setError((prevError) => ({
        ...prevError,
        id: '아이디를 입력해주세요.',
      }));
      return;
    }

    const idError = validateField('id', inputData.id);
    if (idError) {
      setError((prevError) => ({
        ...prevError,
        id: idError,
      }));
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/check-id", {
        id: inputData.id
      });

      if (response.status === 200) {
        alert('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
        setError((prevError) => ({
          ...prevError,
          id: '',
        }));
      }
    } catch {
      if (error.response && error.response.status === 409) {
        setError((prevError) => ({
          ...prevError,
          id: '이미 사용 중인 아이디입니다.',
        }));
        setIsIdChecked(false);
      } else {
        alert('예기치 못한 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleVerifyBusiness = async () => {
    const data = {
      b_no: [inputData.business],
    };

    try {
      const response = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${import.meta.env.VITE_GO_APP_SERVICE_KEY}`,
        data
      );
      if (response.data.data[0].b_stt_cd == "01") {
        setBussinessDisabled(true);
        setBussinessVerified(true);
        alert("인증되었습니다.");
      } else {
        alert("유효하지 않은 번호입니다.");
      }
    } catch {
      alert("예기치 못한 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-header">
          <Link to="/">
            명치세상
          </Link>
        </div>
        <div className="input-group id-group">
          <div className="id-check">
            <input
              type="text"
              id="id"
              name="id"
              placeholder="아이디"
              value={inputData.id}
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
            value={inputData.pw}
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
              value={inputData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={emailDisabled}
              required
            />
            {!isEmailVerified && (
              <button
                type="button"
                className="verification-button"
                onClick={openVerificationModal}
                disabled={emailDisabled}
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
            value={inputData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="전화번호 (-를 제외한 숫자만 입력)"
            value={inputData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        <div className="input-group business-group">
          <div className="business-verification">
            <input
              type="text"
              id="business"
              name="business"
              placeholder="사업자등록번호 (-를 제외한 숫자만 입력)"
              value={inputData.business}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={bussinessDisabled}
              required
            />
            <button
              type="button"
              className="verification-button"
              onClick={handleVerifyBusiness}
              disabled={bussinessDisabled}
            >
              인증하기
            </button>
          </div>
        </div>
        <div className="input-group address-group">
          <div className="address-search">
            <input
              type="text"
              id="addr"
              name="addr"
              placeholder="(선택) 주소"
              value={inputData.addr}
              onChange={handleChange}
              disabled
            />
            <DaumPost setAddress={setAddress} />
          </div>
        </div>
        <div className="input-group">
          <input
            type="text"
            id="detailAddr"
            name="detailAddr"
            placeholder="(선택) 상세주소"
            value={inputData.detailAddr}
            onChange={handleChange}
          />
        </div>
        {error.id && <p className="error-message">{error.id}</p>}
        {error.pw && <p className="error-message">{error.pw}</p>}
        {error.email && <p className="error-message">{error.email}</p>}
        {error.phone && <p className="error-message">{error.phone}</p>}
        <button type="submit" className="signup-button">회원가입</button>

        <div className="links">
          이미 계정이 있으신가요? <Link to='/login'> 로그인 </Link>
        </div>
      </form>

      {isVerificationModalOpen && (
        <div className='modal-overlay' onClick={closeVerificationModal}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <p>{inputData.email}로 전송된 인증번호를 입력해주세요.</p>
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