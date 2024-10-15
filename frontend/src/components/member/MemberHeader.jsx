import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/styles/components/member/MemberHeader.css';
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineBell } from 'react-icons/ai';

const MemberHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const searchTerms = [
    '아이러브밀크 멸균우유',
    'CJ 크레잇 냉동 육질탄탄베이컨',
    '모짜렐라 피자치즈',
    '밀락골드 무가당 휘핑크림',
    '디벨라 파스타 스파게티니',
    'Product123',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 추천 검색어 업데이트 함수
  const updateSuggestion = () => {
    if (searchQuery.length === 0) {
      setSuggestion('');
    } else {
      const match = searchTerms.find((term) =>
        term.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match && match.toLowerCase() !== searchQuery.toLowerCase()) {
        setSuggestion(match);
      } else {
        setSuggestion('');
      }
    }
  };

  // 검색어 변경 시 추천 검색어 업데이트
  useEffect(() => {
    if (!isComposing) {
      updateSuggestion();
    }
  }, [searchQuery, isComposing]);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    setSearchQuery(e.target.value);
    updateSuggestion();
  };

  const handleKeyDown = (e) => {
    if (isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestion && suggestion.toLowerCase() !== searchQuery.toLowerCase()) {
        setSearchQuery(suggestion);
        setSuggestion('');
      } else {
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      }
    } else if (e.key === 'ArrowRight') {
      if (suggestion) {
        e.preventDefault();
        setSearchQuery(suggestion);
        setSuggestion('');
      }
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className={`search-bar-container ${isSticky ? 'sticky' : ''}`}>
      <div className="search-bar-wrapper">
        <Link to='/' className='logo'>
          <h1>명치세상</h1>
        </Link>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <div className="input-container">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="search-input"
              value={searchQuery}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              ref={inputRef}
            />
            {suggestion && suggestion.toLowerCase() !== searchQuery.toLowerCase() && (
              <div className="suggestion-text">
                <span className="suggested-text">{suggestion}</span>
                <span className="autocomplete-hint">자동완성: Enter 또는 →</span>
              </div>
            )}
          </div>
        </div>
        <div className="search-buttons">
          <Link to="/notice" className="search-button">
            <AiOutlineBell />
          </Link>
          <Link to="/mypage" className="search-button">
            <AiOutlineUser />
          </Link>
          <Link to="/cart" className="search-button">
            <AiOutlineShoppingCart />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MemberHeader;
