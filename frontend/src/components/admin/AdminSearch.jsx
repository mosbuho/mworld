import {useEffect, useState} from "react";

const AdminSearch = ({f, setF, q, setQ, onSearch, options, startDate, setStartDate, endDate, setEndDate}) => {
    const [reset, setReset] = useState(false);

    const handleReset = () => {
        setF('');
        setQ('');
        setStartDate('');
        setEndDate('');
        setReset(true);
    };
    useEffect(() => {
        if (reset) {
            onSearch();
            setReset(false);
        }
    }, [f, q, startDate, endDate, reset, onSearch]);

    return (
        <div className="admin-search">
            <select value={f} onChange={(e) => setF(e.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="검색어 입력"
            />
            <button onClick={onSearch}>검색</button>
            <button onClick={handleReset}>초기화</button>
        </div>
    );
};

export default AdminSearch;