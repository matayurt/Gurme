import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getWritingDetails, updateWriting } from '../../actions/writingActions.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminEditWriting = ({ darkMode }) => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { writing, loading, error } = useSelector((state) => state.writingDetails);
  const { success: updateSuccess, error: updateError } = useSelector((state) => state.writingUpdate);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [headerImage, setHeaderImage] = useState(null); 
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const [previewHeaderImage, setPreviewHeaderImage] = useState(null);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Yazı başarıyla güncellendi!', { autoClose: 2000 });
      navigate('/admin/writings'); 
    } else if (!writing || writing._id !== id) {
      dispatch(getWritingDetails(id));
    } else {
      setTitle(writing.title);
      setContent(writing.content);
      setPreviewCoverImage(`http://localhost:5001/${writing.coverImage}`);
      setPreviewHeaderImage(`http://localhost:5001/${writing.headerImage}`);
    }
  }, [dispatch, id, writing, updateSuccess, navigate]);

  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (coverImage) formData.append('coverImage', coverImage);
      if (headerImage) formData.append('headerImage', headerImage);

      dispatch(updateWriting(id, formData));
    } else {
      toast.error('Lütfen tüm alanları doldurun.', { autoClose: 2000 });
    }
  };

  return (
    <div className={`max-w-full mx-auto p-6 rounded-md shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Yazıyı Düzenle</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yazı Başlığı"
            className={`flex-1 p-3 border rounded-md focus:outline-none mb-4 w-full ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
          />

          {/* Quill Text Editor */}
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'list',
              'bullet',
              'indent',
              'link',
              'image',
              'video',
            ]}
            placeholder="Yazı İçeriği"
            className="mb-4"
          />

          {/* Header Fotoğraf */}
          <div className="mb-4">
            <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Header Fotoğrafı</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setHeaderImage, setPreviewHeaderImage)}
              className={`border p-2 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
            />
            {previewHeaderImage && (
              <div className="mt-4">
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Header Önizleme:</p>
                <img src={previewHeaderImage} alt="Header Preview" className="w-48 h-32 object-cover rounded-md shadow-md" />
              </div>
            )}
          </div>

          {/* Kapak Fotoğrafı */}
          <div className="mb-4">
            <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kapak Fotoğrafı</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setCoverImage, setPreviewCoverImage)}
              className={`border p-2 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
            />
            {previewCoverImage && (
              <div className="mt-4">
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Kapak Önizleme:</p>
                <img src={previewCoverImage} alt="Cover Preview" className="w-48 h-32 object-cover rounded-md shadow-md" />
              </div>
            )}
          </div>

          <button type="submit" className="bg-[#F2115E] text-white py-2 px-4 rounded-md hover:bg-[#e0004a] transition duration-200">
            Güncelle
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminEditWriting;
