import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWriting } from '../../actions/writingActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ImageResize from 'quill-image-resize-module-react';

import Quill from 'quill';
Quill.register('modules/imageResize', ImageResize);

const AdminAddWritings = ({ darkMode }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [headerImage, setHeaderImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null);
  const [previewHeaderImage, setPreviewHeaderImage] = useState(null); 
  const [showPreview, setShowPreview] = useState(false);

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

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
    if (title && content && coverImage && headerImage) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('coverImage', coverImage);
      formData.append('headerImage', headerImage); 

      dispatch(addWriting(formData));
      toast.success('Yazı başarıyla eklendi!', { autoClose: 2000 });

      setTitle('');
      setContent('');
      setCoverImage(null);
      setHeaderImage(null);
      setPreviewImage(null);
      setPreviewHeaderImage(null);
      setShowPreview(false); 
    } else {
      toast.error('Lütfen tüm alanları doldurun ve gerekli fotoğrafları seçin.', { autoClose: 2000 });
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className={`max-w-full mx-auto p-6 shadow-lg rounded-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-6">Yeni Yazı Ekle</h2>

      <form onSubmit={handleSubmit} className="mb-6">

        {/* Header Fotoğraf  */}
        <div className="mb-4">
          <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : ''}`}>Header Fotoğrafı</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setHeaderImage, setPreviewHeaderImage)}
            className={`border p-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
          />
          {previewHeaderImage && (
            <div className="mt-4">
              <p className={`font-semibold ${darkMode ? 'text-gray-300' : ''}`}>Header Önizleme:</p>
              <img src={previewHeaderImage} alt="Header Preview" className="w-48 h-32 object-cover rounded-md shadow-md" />
            </div>
          )}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yazı Başlığı"
          className={`flex-1 p-3 border rounded-md focus:outline-none mb-4 w-full ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
        />

        {/* Quill Text Editor */}
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Yazı İçeriği"
          className={`mb-4 ${darkMode ? 'ql-snow-dark' : ''}`}
        />

        {/* Kapak Fotoğrafı Yükleme */}
        <div className="mb-4">
          <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : ''}`}>Kapak Fotoğrafı</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setCoverImage, setPreviewImage)}
            className={`border p-2 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-300'}`}
          />
          {previewImage && (
            <div className="mt-4">
              <p className={`font-semibold ${darkMode ? 'text-gray-300' : ''}`}>Önizleme:</p>
              <img src={previewImage} alt="Cover Preview" className="w-48 h-32 object-cover rounded-md shadow-md" />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button type="button" onClick={handlePreview} className={`py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`}>
            Önizleme
          </button>
          <button type="submit" className={`py-2 px-4 rounded-md transition duration-200 ${darkMode ? 'bg-[#F2115E] text-white hover:bg-[#e0004a]' : 'bg-[#F2115E] text-white hover:bg-[#e0004a]'}`}>
            Yazıyı Ekle
          </button>
        </div>
      </form>

      {showPreview && (
        <div className={`mt-6 p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Önizleme</h3>
          <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminAddWritings;
