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

    const ENTITY_TYPE = 'product';

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({...prevData, [id]: value}));
    };

    const handleEditorChange = (newEditorState) => {
        const oldContent = editorState.getCurrentContent();
        const newContent = newEditorState.getCurrentContent();

        const oldImages = extractImageUrls(oldContent);
        const newImages = extractImageUrls(newContent);

        // 이전 상태의 이미지가 새 상태에 없으면 삭제 처리
        oldImages.forEach((url) => {
            if (!newImages.includes(url)) {
                deleteImage(ENTITY_TYPE, url)
                    .then(() => {
                        setFormData((prevData) => ({ ...prevData, titleImg: "" }));
                    })
                    .catch((error) => console.error('Image delete failed:', error));
            }
        });

        setEditorState(newEditorState);
    };

    const extractImageUrls = (contentState) => {
        const urls = [];
        const blocks = contentState.getBlocksAsArray();

        blocks.forEach((block) => {
            block.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity();
                    if (entityKey) {
                        const entity = contentState.getEntity(entityKey);
                        return entity.getType() === 'IMAGE';
                    }
                    return false;
                },
                (start, end) => {
                    const entity = contentState.getEntity(block.getEntityAt(start));
                    const { src } = entity.getData();
                    urls.push(src); // 이미지 URL 수집
                }
            );
        });

        return urls;
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
                let newWidth = img.width;
                let newHeight = img.height;

                // 비율 유지하며 최대 크기를 넘지 않도록 조정
                const aspectRatio = img.width / img.height;

                if (newWidth > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = maxWidth / aspectRatio;
                }

                if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = maxHeight * aspectRatio;
                }

                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                // 리사이징된 이미지를 Blob으로 변환하여 반환
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

        if (formData.titleImg) {
            deleteImage(ENTITY_TYPE, formData.titleImg)
                .then(() => {
                    setFormData((prevData) => ({ ...prevData, titleImg: "" }));
                })
                .catch((error) => console.error('Image delete failed:', error));
        }

        const maxWidth = 580; // 최대 너비
        const maxHeight = 580; // 최대 높이

        resizeImage(file, maxWidth, maxHeight)
            .then((resizedBlob) => {
                const formData = new FormData();
                formData.append('file', resizedBlob, file.name);
                formData.append('entityType', ENTITY_TYPE);

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
        const maxHeight = 3000; // 최대 높이

        return new Promise((resolve, reject) => {
            resizeImage(file, maxWidth, maxHeight)
                .then((resizedBlob) => {
                    const formData = new FormData();
                    formData.append('file', resizedBlob, file.name);
                    formData.append('entityType', ENTITY_TYPE);

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

    const deleteImage = async (entityType, imageUrl) => {
        try {
            const fileName = imageUrl.split('/').pop();
            await axios.delete(`/api/img/${entityType}/${fileName}`);
        } catch (error) {
            console.error('Image delete failed:', error);
            throw error;
        }
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
            content: rawContent,
            titleImg: formData.titleImg,
        };

        try {
            const response = await axios.post('/api/admin/product', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('상품등록이 완료되었습니다.')
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
                        </div>
                        <div className="title-img">
                            <span>미리보기(580px, 580px)</span>
                            <img src={formData.titleImg} alt=""/>
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
                        <div className="form-group-editor">
                            <label htmlFor="content">상품설명</label>
                            <div className="draft-editor">
                                <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                    toolbar={{
                                        image: {
                                            uploadEnabled: true,
                                            uploadCallback: uploadImageCallback,
                                            alt: {present: true, mandatory: false},
                                            previewImage: true,
                                            defaultSize: {
                                                height: 'auto',
                                                width: '1200',
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
