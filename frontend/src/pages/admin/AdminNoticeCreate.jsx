import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from "axios";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";

const AdminNoticeCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');

    const handleEditorChange = (editorState) => setEditorState(editorState);

    const handleCreate = async () => {
        try {
            const contentState = editorState.getCurrentContent();
            const contentRaw = JSON.stringify(convertToRaw(contentState));

            await axios.post('http://localhost:8080/api/notice/create', {title, content: contentRaw});
            navigate('/admin/notice');
        } catch {
            alert('공지 생성에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-notice-detail">
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label htmlFor="title">제목</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group-editor">
                            <label htmlFor="content">공지내용</label>
                            <div className="draft-editor">
                                <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                />
                            </div>
                        </div>
                        <button className="save-btn" type="button" onClick={handleCreate}>생성</button>
                        <button type="button" onClick={() => {
                            navigate(-1)
                        }}>취소
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminNoticeCreate;