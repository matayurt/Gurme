import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminCommentList from './components/AdminCommentList';
import AdminCategoryList from './components/AdminCategoryList';
import AdminAprovedComments from './components/AdminAprovedComments';
import AdminHome from './components/AdminHome';
import ProfileScreen from './components/ProfileScreen';
import AddRestaurant from './components/AddRestaurant';
import AdminRestaurantList from './components/AdminRestaurantList';
import AdminMail from './components/AdminMail';
import AdminUserPanel from './components/AdminUserPanel';
import AdminWebEdit from './components/AdminWebEdit';
import AdminRestaurantEdit from './components/AdminRestaurantEdit';
import AdminQuestions from './components/AdminQuestions';
import AdminQuestionEdit from './components/AdminQuestionEdit';
import AdminSocialLinks from './components/AdminSocialLinks';
import AdminGurmeDetail from './components/AdminGurmeDetail';
import AdminVideos from './components/AdminVideos';
import AdminSliders from './components/AdminSliders';
import AdminAddWritings from './components/AdminAddWriting';
import AdminWritings from './components/AdminWritings';
import AdminEditWriting from './components/AdminEditWriting';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onSearch={setSearchTerm} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar darkMode={darkMode} searchTerm={searchTerm} className="w-64" />
        <main
          className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto transition duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#E8EFFA] text-black'
            }`}
        >
          <Routes>
            <Route path="admin" element={<AdminHome darkMode={darkMode} />} />
            <Route path="profile" element={<ProfileScreen darkMode={darkMode}/>} />
            <Route path="comments" element={<AdminCommentList darkMode={darkMode} />} />
            <Route path="categories" element={<AdminCategoryList darkMode={darkMode} />} />
            <Route path="approvedcomments" element={<AdminAprovedComments darkMode={darkMode} />} />
            <Route path="restaurant" element={<AddRestaurant darkMode={darkMode} />} />
            <Route path="restaurantlist" element={<AdminRestaurantList darkMode={darkMode} />} />
            <Route path="mail" element={<AdminMail darkMode={darkMode} />} />
            <Route path="adminedituser" element={<AdminUserPanel darkMode={darkMode} />} />
            <Route path="webedit" element={<AdminWebEdit darkMode={darkMode} />} />
            <Route path="social" element={<AdminSocialLinks darkMode={darkMode} />} />
            <Route path="gurmedetail" element={<AdminGurmeDetail darkMode={darkMode}/>} />
            <Route path="videos" element={<AdminVideos darkMode={darkMode} />} />
            <Route path="writings" element={<AdminWritings darkMode={darkMode} />} />
            <Route path="/writings/edit/:id" element={<AdminEditWriting darkMode={darkMode} />} />
            <Route path="addwritings" element={<AdminAddWritings darkMode={darkMode} />} />
            <Route path="sliders" element={<AdminSliders darkMode={darkMode} />} />
            <Route path="questions" element={<AdminQuestions darkMode={darkMode} />} />
            <Route path="/questions/edit/:id" element={<AdminQuestionEdit darkMode={darkMode} />} />
            <Route path="restaurant/edit/:id" element={<AdminRestaurantEdit darkMode={darkMode}/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
