import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWritings, deleteWriting } from '../../actions/writingActions.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const AdminWritings = ({ darkMode }) => {
  const dispatch = useDispatch();
  const { writings, loading, error } = useSelector((state) => state.writingList);

  useEffect(() => {
    dispatch(listWritings());
  }, [dispatch]);

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Bu yazıyı silmek istediğinizden emin misiniz?</p>
          <button
            onClick={() => {
              dispatch(deleteWriting(id));
              toast.success('Yazı başarıyla silindi!', { autoClose: 1000 });
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

  return (
    <div className={`max-w-5xl mx-auto p-6 mt-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>Yazıları Yönet</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {writings.map((writing) => (
            <div
              key={writing._id}
              className={`relative p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <img
                src={`http://localhost:5001/${writing.coverImage}`}
                alt={writing.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{writing.title}</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(writing.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/admin/writings/edit/${writing._id}`}
                  className={`hover:text-blue-700 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}
                >
                  <FontAwesomeIcon icon={faEdit} /> Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(writing._id)}
                  className={`hover:text-red-700 ${darkMode ? 'text-red-400' : 'text-red-500'}`}
                >
                  <FontAwesomeIcon icon={faTrash} /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default AdminWritings;
