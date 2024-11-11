import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVideo, fetchVideos, deleteVideo } from '../../actions/videoActions.js';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const AdminVideos = ({ darkMode }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const dispatch = useDispatch();

  const { videos, loading, error } = useSelector((state) => state.videoList);
  const { success: addSuccess, error: addError } = useSelector((state) => state.videoAdd);
  const { success: deleteSuccess } = useSelector((state) => state.videoDelete);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  useEffect(() => {
    if (addSuccess) {
      toast.success('Video başarıyla eklendi!', {
        autoClose: 1000,
        onClose: () => window.location.reload(),
      });
    }
    if (addError) {
      toast.error(`Video eklenemedi: ${addError}`, {
        autoClose: 1000,
        onClose: () => setTimeout(() => window.location.reload(), 400),
      });
    }
  }, [addSuccess, addError]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Video başarıyla silindi!', {
        autoClose: 1000,
        onClose: () => setTimeout(() => window.location.reload(), 400),
      });
    }
    if (error) {
      toast.error(`Bir hata oluştu: ${error}`, {
        autoClose: 1000,
        onClose: () => setTimeout(() => window.location.reload(), 400),
      });
    }
  }, [deleteSuccess, error]);

  const handleAddVideo = () => {
    if (videoUrl) {
      dispatch(addVideo({ videoUrl }));
      setVideoUrl('');
    } else {
      toast.error('Lütfen bir YouTube video linki girin.', {
        autoClose: 1000,
        onClose: () => setTimeout(() => window.location.reload(), 400),
      });
    }
  };

  const handleDeleteVideo = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Bu videoyu silmek istediğinizden emin misiniz?</p>
          <button
            onClick={() => {
              dispatch(deleteVideo(id));
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
      { autoClose: false, onClose: () => setTimeout(() => window.location.reload(), 400) }
    );
  };

  return (
    <div
      className={`max-w-full mx-auto p-6 shadow-lg rounded-md ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Videoları Yönet</h2>

      {/* Video Link Girişi */}
      <div className="mb-6 flex items-center">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube video linki girin"
          className={`flex-1 p-3 border rounded-md focus:outline-none ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'
          }`}
        />
        <button
          onClick={handleAddVideo}
          className={`ml-3 py-2 px-4 rounded-md transition duration-300 ${
            darkMode ? 'bg-[#F2115E] text-white hover:bg-[#e0004a]' : 'bg-[#F2115E] text-white hover:bg-[#e0004a]'
          }`}
        >
          Ekle
        </button>
      </div>

      {/* Video Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          videos.map((video) => (
            <div
              key={video._id}
              className={`p-4 border rounded-md shadow-md flex flex-col items-start ${
                darkMode ? 'bg-gray-900 border-gray-900' : 'bg-white'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 rounded-md mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <p className={`text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {new Date(video.publishedAt).getFullYear()} - {video.location || 'Bilinmeyen Konum'}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Yayınlanma Tarihi: {new Date(video.publishedAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <button
                onClick={() => handleDeleteVideo(video._id)}
                className="self-end text-red-500 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminVideos;
