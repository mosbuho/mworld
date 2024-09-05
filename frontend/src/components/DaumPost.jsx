import { useDaumPostcodePopup } from 'react-daum-postcode';

const DaumPost = ({ setAddress }) => {
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    let localAddress = data.sido + ' ' + data.sigungu;

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      // 기본 주소에서 지역명 제거 후 빌딩 이름 추가
      fullAddress = fullAddress.replace(localAddress, '');
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    setAddress(fullAddress);
  }

  const handleClick = () => {
    open({ onComplete: handleComplete });
  }

  return (
    <div type='button' onClick={handleClick} className='addr-button'>주소검색</div>
  )
}

export default DaumPost;
