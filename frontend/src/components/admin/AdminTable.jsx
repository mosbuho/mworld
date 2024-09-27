import {useNavigate} from "react-router-dom";

const AdminTable = ({columns, data, onRowClick}) => {
    const nav = useNavigate();
    return (
        <div className="admin-table">
            <table>
                <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length}>데이터가 존재하지 않습니다.</td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex} onClick={() => onRowClick(row, nav)}>
                            {columns.map((col, index) => (
                                <td key={index}>
                                    {typeof row[col.accessor] === 'string' && row[col.accessor].includes('img') ? (
                                        <img
                                            src={row[col.accessor]}
                                            alt="이미지"
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    ) : (
                                        row[col.accessor]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminTable;