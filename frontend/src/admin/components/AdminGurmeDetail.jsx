import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGurmeDetail, updateGurmeDetail } from '../../actions/gurmeDetailActions.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminGurmeDetail = ({ darkMode }) => {
  const dispatch = useDispatch();
  const { gurmeDetail, loading, error } = useSelector((state) => state.gurmeDetail);

  const [details, setDetails] = useState({
    titleLeft: '',
    titleRight: '',
    descriptionLeft: '',
    descriptionRight: '',
    image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchGurmeDetail());
  }, [dispatch]);

  useEffect(() => {
    if (gurmeDetail && Object.keys(gurmeDetail).length > 0) {
      setDetails({
        titleLeft: gurmeDetail.titleLeft || '',
        titleRight: gurmeDetail.titleRight || '',
        descriptionLeft: gurmeDetail.descriptionLeft || '',
        descriptionRight: gurmeDetail.descriptionRight || '',
        image: gurmeDetail.image || '',
      });
    }
  }, [gurmeDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    Object.keys(details).forEach((key) => {
      if (key !== 'image') formData.append(key, details[key]);
    });

    dispatch(updateGurmeDetail(formData));

    toast.success('Gurme detayları güncellendi!', { autoClose: 1000 });
  };

  return (
    <div className={`max-w-full mx-auto p-12 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <h2 className="text-3xl font-bold mb-8 text-center">Gurme Detaylarını Düzenle</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Başlık */}
          <div className="flex flex-col">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Başlık Sol:</label>
            <input
              type="text"
              name="titleLeft"
              value={details.titleLeft}
              onChange={handleChange}
              className={`p-3 border rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
          </div>
          {/* Sağ Başlık */}
          <div className="flex flex-col">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Başlık Sağ:</label>
            <input
              type="text"
              name="titleRight"
              value={details.titleRight}
              onChange={handleChange}
              className={`p-3 border rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
          </div>
          {/* Sol Açıklama */}
          <div className="flex flex-col">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Açıklama Sol:</label>
            <textarea
              name="descriptionLeft"
              value={details.descriptionLeft}
              onChange={handleChange}
              className={`p-3 border rounded-md h-32 resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
          </div>
          {/* Sağ Açıklama */}
          <div className="flex flex-col">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Açıklama Sağ:</label>
            <textarea
              name="descriptionRight"
              value={details.descriptionRight}
              onChange={handleChange}
              className={`p-3 border rounded-md h-32 resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
          </div>
          {/* Resim Yükleme */}
          <div className="flex flex-col col-span-full">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Resim Seç:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className={`p-3 border rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Seçilen Resim"
                className="mt-4 max-h-40 object-contain"
              />
            )}
            {!selectedImage && details.image && (
              <img
                src={details.image}
                alt="Mevcut Resim"
                className="mt-4 max-h-40 object-contain"
              />
            )}
          </div>
          <div className="col-span-full flex justify-center mt-4">
            <button type="submit" className="w-1/3 bg-[#F2115E] text-white py-2 px-8 rounded-md hover:bg-[#e0004a] transition duration-300">
              Güncelle
            </button>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminGurmeDetail;
