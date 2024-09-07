import axios from "/src/utils/axiosConfig.js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

const AdminMember = () => {
    const location = useLocation();
    const nav = useNavigate();
    const { member } = location.state;

    const [formData, setFormData] = useState({
        no: member.no,
        id: member.id,
        name: member.name,
        phone: member.phone,
        addr: member.addr,
        regDate: member.regDate,
    })

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleUpdate = async () => {
        if (window.confirm("회원정보를 수정하시겠습니까?")) {
            try {
                await axios.put(`/api/admin/member/${formData.no}`, {
                    name: formData.name,
                    phone: formData.phone,
                    addr: formData.addr,
                });
                alert("회원정보가 수정되었습니다.");
                nav('/admin/member');
            } catch (err) {
                console.error("failed to update member", err);
                alert('회원정보 수정에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("회원을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/admin/member/${formData.no}`);
                alert("회원이 삭제되었습니다.");
                nav('/admin/member');
            } catch (err) {
                console.error("failed to delete member", err);
                alert('회원삭제에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };


    return (
        <div className="admin-member">
            <h1>회원정보</h1>
            <AdminSidebar />
            <div className="admin-member-detail">
                <form>
                    <div className="form-group">
                        <label htmlFor="no">번호</label>
                        <input
                            type="text"
                            id="no"
                            value={formData.no}
                            readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="id">아이디</label>
                        <input
                            type="text"
                            id="id"
                            value={formData.id}
                            readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="text"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addr">주소</label>
                        <input
                            type="text"
                            id="addr"
                            value={formData.addr}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="regDate">가입일</label>
                        <input
                            type="text"
                            id="regDate"
                            value={formData.regDate}
                            readOnly={true}
                        />
                    </div>
                    <button type="button" onClick={handleUpdate}>수정</button>
                    <button type="button" onClick={handleDelete}>삭제</button>
                    <button type="button" onClick={() => nav(-1)}>뒤로</button>
                </form>
            </div>
        </div>
    );
}

export default AdminMember;