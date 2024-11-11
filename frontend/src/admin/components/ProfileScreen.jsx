import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, getUserProfile } from '../../actions/userActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultAvatar from '../../assets/default-avatar.png';

const ProfileScreen = ({ darkMode }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [image, setImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(defaultAvatar);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfileImageUrl(userInfo.profileImage || defaultAvatar);
    }
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    dispatch(updateUserProfile(formData))
      .then((response) => {
        toast.success('Profil başarıyla güncellendi!', {
          autoClose: 1000,
          onClose: () => {
            localStorage.setItem('userInfo', JSON.stringify(response.payload));
            dispatch(getUserProfile());
          },
        });
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Profil güncellenirken bir hata oluştu: ${errorMessage}`, {
          autoClose: 1000,
        });
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#E8EFFA]'}`}>
      <div className={`p-8 rounded-lg shadow-lg w-full max-w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Profilinizi Güncelleyin</h2>
        <form onSubmit={submitHandler} className="flex flex-col md:flex-row items-center md:items-start justify-between space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex flex-col items-center space-y-4">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover mx-auto"
            />
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
            />
          </div>
          <div className="flex-grow">
            <div className="mb-7">
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`} htmlFor="name">
                İsim
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                placeholder="İsminizi girin"
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`} htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'}`}
                placeholder="Emailinizi girin"
                disabled
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#F2115E] hover:bg-[#e0004a] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full"
              >
                Güncelle
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileScreen;
