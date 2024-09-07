import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {EditorState, convertToRaw} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const AdminProductCreate = () => {
    const nav = useNavigate();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]: value}));
    };

    const handleEditorChange = (editorState) => setEditorState(editorState);

    return (
        <div className="admin-product-create">
            <AdminSidebar/>
            <div className="admin-product-detail">
                <form>
                    <div className="form-group">
                        <label htmlFor="title">상품명</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="titleImg">대표이미지</label>
                        <input
                            type="file"
                            id="titleImg"
                            value={formData.titleImg}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">상품가격</label>
                        <input
                            type="number"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">초기재고</label>
                        <input
                            type="number"
                            id="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">상품설명</label>
                        <div className="draft-editor">
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={handleEditorChange}
                            />
                        </div>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default AdminProductCreate;