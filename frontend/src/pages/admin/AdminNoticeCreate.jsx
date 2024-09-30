import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {EditorState, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from "/src/utils/axiosConfig.js";

const AdminNoticeCreate = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [title, setTitle] = useState('');

    const handleEditorChange = (editorState) => setEditorState(editorState);

    const handleCreate = async () => {
        try {
            const contentState = editorState.getCurrentContent();
            const contentRaw = JSON.stringify(convertToRaw(contentState));

            await axios.post('/api/notice/create', {title, content: contentRaw});
            navigate('/notice');
        } catch {
            alert('공지 생성에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div>
            <div>
                <form>
                    <div>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <div>
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={handleEditorChange}
                            />
                        </div>
                    </div>
                    <button type="button" onClick={handleCreate}>생성</button>
                    <button type="button" onClick={() => {
                        navigate(-1)
                    }}>취소
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminNoticeCreate;