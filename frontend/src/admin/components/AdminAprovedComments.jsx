import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getApprovedComments, deleteComment, updateComment } from '../../actions/commentActions';
import { getRestaurants } from '../../actions/restaurantActions';
import { getCategories } from '../../actions/categoryActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import UpButton from './AdminUpButton';
import loadingGif from '../../assets/loading.gif';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const AdminApprovedComments = ({ setTotalApprovedComments, darkMode }) => {
  const dispatch = useDispatch();

  const commentApprovedList = useSelector((state) => state.commentApprovedList);
  const { loading, error, comments = [] } = commentApprovedList;

  const restaurantList = useSelector((state) => state.restaurantList);
  const { restaurants = [] } = restaurantList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories = [] } = categoryList;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('user');
  const [selectedComments, setSelectedComments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedComment, setEditedComment] = useState({});

  useEffect(() => {
    dispatch(getApprovedComments());
    dispatch(getRestaurants());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (setTotalApprovedComments) {
      setTotalApprovedComments(comments.length);
    }
  }, [comments, setTotalApprovedComments]);

  const toggleSelectComment = (commentId) => {
    if (selectedComments.includes(commentId)) {
      setSelectedComments(selectedComments.filter((id) => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const selectAllComments = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map((comment) => comment._id));
    }
  };

  const deleteSelectedHandler = () => {
    selectedComments.forEach((commentId) => confirmDeletion(commentId));
    setSelectedComments([]);
  };

  const deleteHandler = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Bu yorumu silmek istediğinize emin misiniz?</p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => confirmDeletion(id, closeToast)}
            >
              Evet
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeToast}
            >
              Hayır
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        className: `${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-lg p-5 border ${
          darkMode ? 'border-gray-700' : 'border-gray-300'
        }`,
      }
    );
  };

  const confirmDeletion = (id, closeToast) => {
    dispatch(deleteComment(id))
      .then(() => {
        toast.success('Yorum başarıyla silindi!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => window.location.reload(),
        });
      })
      .catch(() => {
        toast.error('Yorum silinemedi. Lütfen tekrar deneyin.', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    if (closeToast) {
      closeToast();
    }
  };

  const clearSelectedComments = () => {
    setSelectedComments([]);
  };

  const filteredComments = comments.filter((comment) => {
    const restaurant = restaurants.find((r) => r._id === comment.restaurant?._id);
    const restaurantName = restaurant ? restaurant.name.toLowerCase() : '';
    const location = restaurant
      ? `${restaurant.district}, ${restaurant.city}, ${restaurant.country}`.toLowerCase()
      : '';

    if (searchType === 'user') {
      return comment.name && comment.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === 'restaurant') {
      return restaurantName.includes(searchTerm.toLowerCase());
    } else if (searchType === 'location') {
      return location.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const openEditModal = (comment) => {
    setEditedComment(comment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditedComment({});
  };

  const handleEditChange = (e) => {
    setEditedComment({ ...editedComment, [e.target.name]: e.target.value });
  };

  const saveEditedComment = () => {
    dispatch(updateComment(editedComment._id, editedComment))
      .then(() => {
        toast.success('Yorum başarıyla güncellendi!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => window.location.reload(),
        });
      })
      .catch(() => {
        toast.error('Yorum güncellenemedi. Lütfen tekrar deneyin.', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    closeModal();
  };

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'text-white' : 'text-black'}`}>
      <div className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h2 className={`text-3xl font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Onaylanmış Yorumlar</h2>
      </div>

      <div className="flex justify-center mb-2">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder={
              searchType === 'user' ? 'Kullanıcı adına göre ara...' :
              searchType === 'restaurant' ? 'Tavsiye adına göre ara...' :
              'Konuma göre ara...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-64 p-2 border rounded-lg shadow focus:shadow-lg focus:outline-none transition duration-300 ${darkMode ? 'bg-gray-900 text-white border-gray-600' : 'border-gray-300'}`}
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className={`p-2 border rounded-lg shadow focus:shadow-lg focus:outline-none transition duration-300 ${darkMode ? 'bg-gray-900 text-white border-gray-600' : 'border-gray-300'}`}
          >
            <option value="user">Kullanıcı adına göre ara</option>
            <option value="restaurant">Tavsiye adına göre ara</option>
            <option value="location">Konuma göre ara</option>
          </select>
        </div>
      </div>

      <div className="text-center mb-6 mt-5">
        <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-600'}`}>
          Toplam Yorum Sayısı: <span className="text-[#F2115E] text-2xl">{filteredComments.length}</span>
        </p>
        {selectedComments.length > 0 && (
          <div className="flex justify-center items-center space-x-4">
            <p className="text-lg font-semibold text-[#F2115E]">
              <span className={`${darkMode ? 'text-white' : 'text-black'}`}>Seçili Yorum Sayısı:</span> {selectedComments.length}
            </p>
            <button
              onClick={clearSelectedComments}
              className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
            >
              Seçimi Temizle
            </button>
          </div>
        )}
      </div>

      {selectedComments.length > 0 && (
        <div className="flex justify-center mb-4 space-x-4">
          <button
            onClick={deleteSelectedHandler}
            className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
          >
            Seçili Yorumları Sil
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedComments.length === filteredComments.length}
            onChange={selectAllComments}
            className="mr-2 w-6 h-6"
          />
          <label className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>Tümünü Seç</label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <img src={loadingGif} alt="Loading..." className="w-full h-full object-cover" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <ul className="space-y-4">
          {filteredComments.map((comment) => {
            const restaurant = restaurants.find((r) => r._id === comment.restaurant?._id);
            const restaurantName = restaurant ? restaurant.name : 'Tavsiye Bulunamadı';
            const restaurantLocation = restaurant
              ? `${restaurant.district}, ${restaurant.city}, ${restaurant.country}`
              : 'Konum Bilgisi Bulunamadı';

            return (
              <li key={comment._id} className={`p-6 border rounded-lg shadow-md cursor-pointer ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}
                  onClick={() => toggleSelectComment(comment._id)}>
                <div className='flex justify-between mb-4'>
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedComments.includes(comment._id)}
                        onChange={() => toggleSelectComment(comment._id)}
                        className="w-6 h-6 mb-4"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <strong className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{comment.name}</strong>
                    <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.comment}</p>

                    {restaurant && (
                      <div className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p><strong>Tavsiye:</strong> {restaurantName}</p>
                        <p><strong>Konum:</strong> {restaurantLocation}</p>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(comment); }}
                        className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHandler(comment._id); }}
                        className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                  <div className='flex'>
                    {restaurant && (
                      <div className="relative block w-56 h-full ml-3">
                        <Link to={`/restaurant/${restaurant._id}`}>
                          <img
                            src={`http://localhost:5001/${restaurant.images[0]}`}
                            alt={restaurant.name}
                            className="h-full w-full object-cover rounded-lg transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Tavsiyeye Git</span>
                          </div>
                        </Link>
                        <p className={`mt-2 text-center font-semibold group-hover:opacity-0 transition-opacity duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{restaurant.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Yorumu Düzenle"
        className={`fixed inset-0 flex items-center justify-center z-50 ${darkMode ? 'bg-gray-900' : ''}`}
        overlayClassName={`fixed inset-0 ${darkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'}`}
      >
        <div className={`p-8 rounded-lg shadow-lg w-full max-w-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-semibold mb-4">Yorumu Düzenle</h2>
          <textarea
            name="comment"
            value={editedComment.comment || ''}
            onChange={handleEditChange}
            className={`w-full p-2 border rounded-lg mb-4 resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            rows="5"
          />
          <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Puan</label>
          <input
            type="number"
            name="rating"
            value={editedComment.rating || ''}
            onChange={handleEditChange}
            className={`w-full p-2 border rounded-lg mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            min="1"
            max="5"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeModal}
              className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
            >
              İptal
            </button>
            <button
              onClick={saveEditedComment}
              className={`px-4 py-2 rounded-lg shadow transition duration-300 ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
            >
              Kaydet
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
      <UpButton />
    </div>
  );
};

export default AdminApprovedComments;
