import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser, register, updateUser } from '../../actions/userActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { sendEmail } from '../../actions/emailAction.js';

const AdminUserPanel = ({ darkMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userList = useSelector((state) => state.userList);
  const { users = [] } = userList;

  const userRegister = useSelector((state) => state.userRegister);
  const { error: registerError } = userRegister;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const openModal = (user) => {
    if (user._id === userInfo._id) {
      toast.error('Giriş yapılan kullanıcı düzenlenemez.', { autoClose: 1000 });
      return;
    }
  
    setEditUser(user);
    setModalName(user.name);
    setModalEmail(user.email);
    setModalPassword('');
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setEditUser(null);
    setModalName('');
    setModalEmail('');
    setModalPassword('');
    setIsModalOpen(false);
  };

  const saveUserHandler = async () => {
    try {
      if (editUser) {
        if (editUser._id === userInfo._id) {
          toast.error('Giriş yapılan kullanıcı düzenlenemez.', { autoClose: 1000 });
          return;
        }
  
        await dispatch(updateUser({ 
          _id: editUser._id, 
          name: modalName, 
          email: modalEmail 
        }));
        toast.success('Kullanıcı başarıyla güncellendi.', { autoClose: 1000 });
        closeModal();
        dispatch(listUsers());
      }
    } catch (error) {
      toast.error('Kullanıcı güncellenirken bir hata oluştu.', { autoClose: 1000 });
    }
  };
  
  
  
  const deleteHandler = async (id) => {
    if (id === userInfo._id) {
      toast.error('Giriş yapılan kullanıcı silinemez.', { autoClose: 1000 });
      return;
    }
  
    if (window.confirm('Kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await dispatch(deleteUser(id)); 
        toast.success('Kullanıcı başarıyla silindi.', { autoClose: 1000 });
        dispatch(listUsers());
      } catch (error) {
        toast.error('Kullanıcı silinirken bir hata oluştu.', { autoClose: 1000 });
      }
    }
  };
  

  const addUserHandler = async (e) => {
    e.preventDefault();
    if (name && email && password) {
      try {
        await dispatch(register(name, email, password));
        if (!registerError) {
          await dispatch(sendEmail(email, { name, email, password }));
          setName('');
          setEmail('');
          setPassword('');
          toast.success('Kullanıcı başarıyla eklendi ve bilgiler gönderildi.', { autoClose: 1000 });
          dispatch(listUsers());
        } else {
          toast.error('Kullanıcı eklenirken bir hata oluştu.', { autoClose: 1000 });
        }
      } catch (error) {
        toast.error('Kullanıcı eklenirken bir hata oluştu.', { autoClose: 1000 });
      }
    } else {
      toast.warn('Lütfen tüm alanları doldurun.', { autoClose: 1000 });
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setPassword(newPassword);
  };

  const handleModalGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setModalPassword(newPassword);
  };

  const generateStrongPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#E8EFFA] text-black'}`}>
      {/* Kullanıcı ekleme ve düzenleme formu */}
      <table className={`min-w-full rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <thead>
          <tr className={darkMode ? 'bg-gray-700 text-white' : 'bg-gray-600 text-white'}>
            <th className="py-4 px-6 text-left">Ad</th>
            <th className="py-4 px-6 text-left">Email</th>
            <th className="py-4 px-6 text-left">Şifre</th>
            <th className="py-4 px-6 text-center">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
            <td className="border-t px-6 py-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700'
                }`}
                placeholder="Adınızı girin"
              />
            </td>
            <td className="border-t px-6 py-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700'
                }`}
                placeholder="Emailinizi girin"
              />
            </td>
            <td className="border-t px-6 py-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`shadow appearance-none border rounded w-4/6 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700'
                }`}
                placeholder="Şifrenizi girin"
              />
              <button
                onClick={handleGeneratePassword}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded ml-2 focus:outline-none focus:shadow-outline transition duration-300"
              >
                Şifre Öner
              </button>
            </td>
            <td className="border-t px-6 py-4 text-center">
              <button
                onClick={addUserHandler}
                className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Yeni Kullanıcı Ekle
              </button>
            </td>
          </tr>

          {/* Kullanıcı listesi */}
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') : (darkMode ? 'bg-gray-700' : 'bg-white')
                } hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} transition duration-150`}
              >
                <td className="border-t px-6 py-4">{user.name}</td>
                <td className="border-t px-6 py-4">{user.email}</td>
                <td className="border-t px-6 py-4">
                  <div className="relative group">
                    <span className="group-hover:hidden">*******</span>
                  </div>
                </td>
                <td className="border-t px-6 py-4 flex justify-center space-x-4">
                  <button
                    onClick={() => openModal(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteHandler(user._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={`text-center py-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Kullanıcı bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Kullanıcıyı Düzenle"
  className={`fixed inset-0 flex items-center justify-center z-50`}
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
>
  <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
    <h2 className="text-2xl font-bold mb-4">Kullanıcıyı Düzenle</h2>
    <input
      type="text"
      value={modalName}
      onChange={(e) => setModalName(e.target.value)}
      className={`w-full mb-4 p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
      placeholder="Adınızı girin"
    />
    <input
      type="email"
      value={modalEmail}
      onChange={(e) => setModalEmail(e.target.value)}
      className={`w-full mb-4 p-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
      placeholder="Emailinizi girin"
    />
    <div className="flex justify-end space-x-4">
      <button
        onClick={closeModal}
        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        İptal
      </button>
      <button
        onClick={saveUserHandler}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Kaydet
      </button>
    </div>
  </div>
</Modal>


      <ToastContainer />
    </div>
  );
};

export default AdminUserPanel;
