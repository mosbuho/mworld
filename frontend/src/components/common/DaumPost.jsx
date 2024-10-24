import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPost = ({ setAddress }) => {
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = '';

    if (data.userSelectedType === 'R') {
      fullAddress = data.roadAddress;
    } else {
      fullAddress = data.jibunAddress;
    }

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
