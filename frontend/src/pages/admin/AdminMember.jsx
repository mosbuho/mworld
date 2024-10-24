import axios from "/src/utils/axiosConfig.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import "/src/styles/pages/admin/AdminMember.css"
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DaumPost from "../../components/common/DaumPost.jsx";

const AdminMember = () => {
    const { no } = useParams();
    const nav = useNavigate();
    const [originalData, setOriginData] = useState({});
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchMember();
    }, [no, nav]);

    const fetchMember = async () => {
        try {
            const res = await axios.get(`/api/admin/member/${no}`);
            const member = res.data;
            setFormData({ ...member });
            setOriginData({ ...member });
        } catch (err) {
            console.error("Failed to fetch member details", err);
            alert("회원 정보를 불러오는 데 실패했습니다.");
            nav(-1);
        }
    };


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const setAddress = (address) => {
        setFormData((prevData) => ({ ...prevData, addr: address }));
    };

    const getChangeData = () => {
        const changeData = {};
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== originalData[key]) {
                changeData[key] = formData[key];
            }
        });
        return changeData;
    };

    const handleUpdate = async () => {
        if (window.confirm("회원정보를 수정하시겠습니까?")) {
            const changedData = getChangeData();
            if (Object.keys(changedData).length === 0) {
                alert("변경된 내용이 없습니다.");
                return;
            }
            try {
                await axios.put(`/api/admin/member/${formData.no}`, changedData);
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
        <div className="admin-main">
            <AdminHeader />
            <AdminSidebar />
            <div className="main">
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
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
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
                            <label htmlFor="business">사업자등록번호</label>
                            <input
                                type="text"
                                id="business"
                                value={formData.business}
                                onChange={handleChange}
                                readOnly={true}
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
                            <DaumPost setAddress={setAddress} />
                            <label htmlFor="detailAddr">상세주소</label>
                            <input
                                type="text"
                                id="detailAddr"
                                value={formData.detailAddr}
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
                        <div className="btn-area">
                            <button type="button" className="update-btn" onClick={handleUpdate}>수정</button>
                            <button type="button" className="delete-btn" onClick={handleDelete}>삭제</button>
                            <button type="button" onClick={() => nav(-1)}>뒤로</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminMember;