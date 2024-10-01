import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "../../utils/axiosConfig.js";
import {EditorState, convertFromRaw, convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const AdminProduct = () => {
    const location = useLocation();
    const nav = useNavigate();
    const {product} = location.state;

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const [formData, setFormData] = useState({
        no: product.no,
        titleImg: product.titleImg,
        title: product.title,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        content: product.content,
    });

    useEffect(() => {
        setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(product.content))));
    }, [product.content]);

    const handleEditorChange = (editorState) => {
        setEditorState(editorState);
    };
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

                let width = img.width;
                let height = img.height;

                // 이미지 비율을 유지하면서 리사이징
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.floor((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.floor((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 리사이징된 이미지를 캔버스에 그리기
                ctx.drawImage(img, 0, 0, width, height);

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
        const maxWidth = 800; // 최대 너비
        const maxHeight = 800; // 최대 높이
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
        const maxWidth = 1000; // 최대 너비
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

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]: value}));
    };

    const handleUpdate = async () => {
        if (window.confirm("상품정보를 수정하시겠습니까?")) {
            try {
                const contentState = editorState.getCurrentContent();
                const rawContent = JSON.stringify(convertToRaw(contentState));

                await axios.put(`/api/admin/product/${formData.no}`, {
                    titleImg: formData.titleImg,
                    title: formData.title,
                    category: formData.category,
                    quantity: formData.quantity,
                    price: formData.price,
                    content: rawContent,
                });
                alert("상품정보가 수정되었습니다.");
                nav('/admin/product');
            } catch (err) {
                console.error("failed to update product", err);
                alert('회원정보 수정에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("회원을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/admin/product/${formData.no}`);
                alert("상품이 삭제되었습니다.");
                nav('/admin/product');
            } catch (err) {
                console.error("failed to delete product", err);
                alert('회원삭제에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };
    return (
        <div className="admin-main">
            <h1>상품정보</h1>
            <AdminSidebar/>
            <div className="main">
                <div className="Admin-Product-detail">
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
                            <div>
                                <img src={formData.titleImg} alt=""/>
                                <span>미리보기</span>
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
                        <button type="button" onClick={handleUpdate}>수정</button>
                        <button type="button" onClick={handleDelete}>삭제</button>
                        <button type="button" onClick={() => nav(-1)}>뒤로</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProduct;