import {useNavigate} from "react-router-dom";
import AdminMain from "../../pages/admin/AdminMain.jsx";

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
                    ):(
                        data.map((row, rowIndex)=>(
                            <tr key={rowIndex} onClick={()=> onRowClick(row, nav)}>
                                {columns.map((col, index) => (
                                    <td key={index}>{row[col.accessor]}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminMain;