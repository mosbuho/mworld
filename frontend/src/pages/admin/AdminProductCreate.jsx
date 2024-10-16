import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {EditorState, convertToRaw} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from '/src/utils/axiosConfig.js';
import AdminHeader from "../../components/admin/AdminHeader.jsx";

const AdminProductCreate = () => {
    const nav = useNavigate();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]: value}));
    };

    const handleEditorChange = (editorState) => setEditorState(editorState);

    // 이미지 리사이징 함수 (대표 이미지 및 에디터 이미지에서 재사용)
    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            reader.onerror = (e) => {
                reject(new Error('Failed to read image file'));
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 캔버스의 크기를 고정
                canvas.width = maxWidth;
                canvas.height = maxHeight;

                // 이미지의 비율을 계산
                const imageAspectRatio = img.width / img.height;
                const canvasAspectRatio = maxWidth / maxHeight;

                let drawWidth = maxWidth;
                let drawHeight = maxHeight;

                // 이미지 비율에 맞게 크기를 조정
                if (imageAspectRatio > canvasAspectRatio) {
                    drawHeight = maxWidth / imageAspectRatio;
                } else {
                    drawWidth = maxHeight * imageAspectRatio;
                }

                // 캔버스의 가운데에 이미지를 그리기 위해 좌표 계산
                const offsetX = (maxWidth - drawWidth) / 2;
                const offsetY = (maxHeight - drawHeight) / 2;

                // 배경을 흰색으로 채워서 패딩처럼 보이도록 설정
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // 리사이징된 이미지를 캔버스 중앙에 그리기
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                // 리사이징된 이미지를 Blob으로 변환
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type);
            };

            reader.readAsDataURL(file);
        });
    };

    // 대표 이미지 업로드 함수
    const handleTitleImageUpload = (e) => {
        const file = e.target.files[0];
        const maxWidth = 580; // 최대 너비
        const maxHeight = 580; // 최대 높이
        const entityType = 'product'; // 엔티티 타입

        resizeImage(file, maxWidth, maxHeight)
            .then((resizedBlob) => {
                const formData = new FormData();
                formData.append('file', resizedBlob, file.name);
                formData.append('entityType', entityType);

                axios.post('/api/img', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then((response) => {
                        const imageUrl = `http://localhost:8080/api/img/${response.data.url}`;
                        setFormData((prevData) => ({...prevData, titleImg: imageUrl}));
                    })
                    .catch((error) => {
                        console.error('Image upload failed:', error);
                    });
            })
            .catch((error) => {
                console.error('Image resize failed:', error);
            });
    };

    // 에디터에 삽입할 이미지 업로드 콜백 함수
    const uploadImageCallback = (file) => {
        const maxWidth = 1200; // 최대 너비
        const maxHeight = 2000; // 최대 높이
        const entityType = 'product'; // 에디터에 삽입할 이미지도 product에 속함

        return new Promise((resolve, reject) => {
            resizeImage(file, maxWidth, maxHeight)
                .then((resizedBlob) => {
                    const formData = new FormData();
                    formData.append('file', resizedBlob, file.name);
                    formData.append('entityType', entityType);

                    axios.post('/api/img', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                        .then((response) => {
                            const imageUrl = `http://localhost:8080/api/img/${response.data.url}`;
                            resolve({data: {link: imageUrl}}); // 에디터에 삽입할 URL 반환
                        })
                        .catch((error) => {
                            console.error('Image upload failed:', error);
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const contentState = editorState.getCurrentContent();
        const rawContent = JSON.stringify(convertToRaw(contentState));

        const postData = {
            title: formData.title,
            category: formData.category,
            price: formData.price,
            quantity: formData.quantity,
            content: rawContent, // 에디터 내용 추가
            titleImg: formData.titleImg, // 대표 이미지 URL 추가
        };

        try {
            const response = await axios.post('/api/admin/product', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            nav('/admin/product');
        } catch (error) {
            console.error('failed to create product', error)
            alert('상품등록에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className="admin-main">
            <AdminHeader/>
            <AdminSidebar/>
            <div className="main">
                <div className="admin-product-detail">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">상품명</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">카테고리</label>
                            <input
                                type="text"
                                id="category"
                                value={formData.category || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="titleImg">대표이미지</label>
                            <input
                                type="file"
                                id="titleImg"
                                onChange={handleTitleImageUpload} // 대표 이미지 업로드 처리
                            />
                            <div className="title-img">
                                <span>미리보기(580px, 580px)</span>
                                <img src={formData.titleImg} alt=""/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">상품가격</label>
                            <input
                                type="number"
                                id="price"
                                value={formData.price || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="quantity">초기재고</label>
                            <input
                                type="number"
                                id="quantity"
                                value={formData.quantity || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">상품설명</label>
                            <div className="draft-editor">
                                <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                    toolbar={{
                                        image: {
                                            uploadEnabled: true,
                                            uploadCallback: uploadImageCallback, // 컨텐츠 이미지 업로드 콜백
                                            alt: {present: true, mandatory: false},
                                            previewImage: true,
                                            defaultSize: {
                                                height: 'auto',
                                                width: '400px',
                                            },
                                            alignmentEnabled: true,
                                            resizeEnabled: true,
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <button className="save-btn" type="submit">저장</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProductCreate;
