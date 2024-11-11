import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSliders, addSlider, updateSlider, deleteSlider } from '../../actions/sliderActions.js';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import ImageUploading from 'react-images-uploading';

const availablePages = [
  { label: 'Ana Sayfa', value: 'anasayfa' },
  { label: 'Gezilerim', value: 'gezilerim' },
  { label: 'İletişim', value: 'iletisim' },
  { label: 'Tavsiyelerim', value: 'tavsiyelerim' },
  { label: 'Yazılarım', value: 'yazilarim' },
];

const AdminSliders = ({ darkMode }) => {
  const [sliderName, setSliderName] = useState('');
  const [sliderImages, setSliderImages] = useState([]);
  const [sliderPage, setSliderPage] = useState(availablePages[0].value);
  const [sliderIdToUpdate, setSliderIdToUpdate] = useState(null);
  const dispatch = useDispatch();

  const { sliders, loading, error } = useSelector((state) => state.sliderList);
  const { success: addSuccess, error: addError } = useSelector((state) => state.sliderAdd);
  const { success: updateSuccess, error: updateError } = useSelector((state) => state.sliderUpdate);
  const { success: deleteSuccess, error: deleteError } = useSelector((state) => state.sliderDelete);

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  useEffect(() => {
    if (addSuccess) {
      toast.success('Slider başarıyla eklendi!', { autoClose: 1000, onClose: () => setTimeout(() => window.location.reload(), 100) });
    }
    if (addError) {
      toast.error(`Slider eklenemedi: ${addError}`, { autoClose: 1000 });
    }
  }, [addSuccess, addError]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Slider başarıyla güncellendi!', { autoClose: 1000, onClose: () => setTimeout(() => window.location.reload(), 100) });
    }
    if (updateError) {
      toast.error(`Slider güncellenemedi: ${updateError}`, { autoClose: 1000, onClose: () => setTimeout(() => window.location.reload(), 100) });
    }
  }, [updateSuccess, updateError]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Slider başarıyla silindi!', { autoClose: 1000, onClose: () => setTimeout(() => window.location.reload(), 100) });
    }
    if (deleteError) {
      toast.error(`Slider silinemedi: ${deleteError}`, { autoClose: 1000, onClose: () => setTimeout(() => window.location.reload(), 100) });
    }
  }, [deleteSuccess, deleteError]);

  const handleAddSlider = () => {
    if (sliderName && sliderPage && sliderImages.length) {
      const formData = new FormData();
      formData.append('name', sliderName);
      formData.append('page', sliderPage);
      sliderImages.forEach((image) => formData.append('images', image.file));

      dispatch(addSlider(formData));
    } else {
      toast.error('Slider adı, sayfa ve en az bir resim gerekli.', { autoClose: 1000 });
    }
  };

  const handleUpdateSlider = () => {
    if (sliderIdToUpdate && sliderName && sliderImages.length) {
      const formData = new FormData();
      formData.append('name', sliderName);
      formData.append('page', sliderPage);
      sliderImages.forEach((image) => formData.append('images', image.file));
      dispatch(updateSlider(sliderIdToUpdate, formData));
    } else {
      toast.error('Slider güncelleme için gerekli tüm bilgileri girin.', { autoClose: 1000 });
    }
  };

  const handleDeleteSlider = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Bu slider'ı silmek istediğinizden emin misiniz?</p>
          <button
            onClick={() => {
              dispatch(deleteSlider(id));
              closeToast();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded mr-2"
          >
            Evet
          </button>
          <button onClick={closeToast} className="bg-gray-300 px-3 py-1 rounded">
            Hayır
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  const onChange = (imageList, addUpdateIndex) => {
    setSliderImages(imageList);
  };

  const handleEditSlider = (slider) => {
    setSliderIdToUpdate(slider._id);
    setSliderName(slider.name);
    setSliderPage(slider.page);
    setSliderImages(slider.images.map((image, index) => ({ file: null, data_url: image, id: index })));
  };

  return (
    <div className={`max-w-full mx-auto p-6 rounded-lg ${darkMode ? 'text-white' : 'text-black'}`}>
      <h2 className={`text-3xl font-semibold mb-8 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Slider Yönetimi</h2>

      {/* Slider Ekleme/Güncelleme Formu */}
      <div className={`mb-8 p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <input
          type="text"
          value={sliderName}
          onChange={(e) => setSliderName(e.target.value)}
          placeholder="Slider adı girin"
          className={`w-full p-4 border rounded-lg focus:outline-none mb-4 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300'}`}
        />
        <label className={darkMode ? 'text-white' : 'text-black'}>Hangi Sayfaya Uygulansın</label>
        <select
          value={sliderPage}
          onChange={(e) => setSliderPage(e.target.value)}
          className={`w-full p-4 border rounded-lg focus:outline-none mb-4 mt-2 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300'}`}
        >
          {availablePages.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>

        {/* Fotoğraf Yükleme Alanı */}
        <ImageUploading multiple value={sliderImages} onChange={onChange} maxNumber={5} dataURLKey="data_url">
          {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
            <div className="upload__image-wrapper mb-6">
              <button
                className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors duration-200 mb-4 ${
                  isDragging ? 'bg-red-500' : 'bg-indigo-600'
                } text-white`}
                onClick={onImageUpload}
                {...dragProps}
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" /> Yükle veya Sürükleyin
              </button>
              <button
                onClick={onImageRemoveAll}
                className={`px-4 py-2 rounded-lg hover:bg-gray-400 mb-4 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                Tümünü Kaldır
              </button>
              <div className="grid grid-cols-2 gap-4">
                {imageList.map((image, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <img src={image['data_url']} alt="" className="w-full h-40 object-cover" />
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => onImageUpdate(index)} className="bg-green-500 text-white px-3 py-1 rounded-full mx-2">Güncelle</button>
                      <button onClick={() => onImageRemove(index)} className="bg-red-500 text-white px-3 py-1 rounded-full mx-2">Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ImageUploading>
        <button
          onClick={sliderIdToUpdate ? handleUpdateSlider : handleAddSlider}
          className={`w-full py-3 rounded-lg font-bold transition duration-300 ${
            sliderIdToUpdate ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-[#F2115E] hover:bg-[#e0004a] text-white'
          }`}
        >
          {sliderIdToUpdate ? 'Güncelle' : 'Ekle'}
        </button>
      </div>

      {/* Slider Listesi */}
      <div className="flex flex-wrap gap-6 justify-center py-6">
        {loading ? (
          <p className={`${darkMode ? 'text-white' : 'text-black'}`}>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-200">{error}</p>
        ) : (
          sliders.map((slider) => (
            <div key={slider._id} className={`min-w-[300px] rounded-lg shadow-md p-4 mb-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{slider.name} ({slider.page})</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditSlider(slider)} className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteSlider(slider._id)} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <div className="flex overflow-x-auto space-x-4 mt-4">
                {slider.images.map((image, index) => (
                  <div key={index} className="w-24 h-24 object-cover rounded-md shadow-md">
                    <img src={image} alt={`Slider ${index}`} className="w-full h-full object-cover rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminSliders;
