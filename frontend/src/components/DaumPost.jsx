// src/components/DaumPost.jsx

import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPost = ({ setAddress }) => {
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = ''; // 전체 주소 변수

    // 기본 주소 설정
    if (data.userSelectedType === 'R') { // 도로명 주소 선택 시
      fullAddress = data.roadAddress;
    } else { // 지번 주소 선택 시
      fullAddress = data.jibunAddress;
    }

    // 주소에 시도와 시군구가 포함되어 있는지 확인하고 없으면 추가
    if (!fullAddress.startsWith(data.sido)) {
      fullAddress = `${data.sido} ${data.sigungu} ${fullAddress}`;
    }

    setAddress(fullAddress);
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <button type="button" onClick={handleClick} className="addr-button">
      주소검색
    </button>
  );
};

export default DaumPost;
