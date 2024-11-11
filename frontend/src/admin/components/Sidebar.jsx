import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleDown,
  faComments,
  faClipboardList,
  faPlus,
  faList,
  faTv,
  faEnvelopeOpenText,
  faUsers,
  faSolarPanel,
  faShop,
  faUserCircle,
  faQuestion,
  faIcons,
  faTable,
  faSliders,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { checkNewComments } from '../../actions/commentActions';
import defaultAvatar from '../../assets/default-avatar.png';

const Sidebar = ({ searchTerm, darkMode }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const newCommentsState = useSelector((state) => state.newCommentsState);
  const { newComments } = newCommentsState;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [openGroups, setOpenGroups] = useState({
    home: false,
    add: false,
    content: false,
    comments: false,
    management: false, 
  });

  useEffect(() => {
    dispatch(checkNewComments());
  }, [dispatch]);

  const handleGroupToggle = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const menuItems = [{ to: 'admin', label: 'Dashboard', icon: faTv }];

  const homeGroup = [
    { to: 'questions', label: 'Sorular', icon: faQuestion },
    { to: 'videos', label: 'Youtube Videoları', icon: faYoutube },
    { to: 'gurmedetail', label: 'Gurme Detayları', icon: faTable },
    { to: 'sliders', label: 'Sliderlar', icon: faSliders },
  ];

  const addGroup = [
    { to: 'restaurant', label: 'Tavsiye Ekle', icon: faPlus },
    { to: 'addwritings', label: 'Yazı Ekle', icon: faPlus },
  ];

  const contentGroup = [
    { to: 'writings', label: 'Yazılar', icon: faFileLines },
    { to: 'restaurantlist', label: 'Tavsiyeler', icon: faShop },
  ];

  const commentGroup = [
    { to: 'comments', label: 'Yorumlar', icon: faComments, newComments },
    { to: 'approvedcomments', label: 'Onaylanmış Yorumlar', icon: faClipboardList },
  ];

  const managementGroup = [
    { to: 'categories', label: 'Kategori Yönetimi', icon: faList },
    { to: 'social', label: 'Sosyal Medya', icon: faIcons },
    { to: 'adminedituser', label: 'Kullanıcı Yönetimi', icon: faUsers },
    { to: 'mail', label: 'Mail Yönetimi', icon: faEnvelopeOpenText },
    { to: 'webedit', label: 'Website Yönetimi', icon: faSolarPanel },
  ];

  const filteredHomeGroup = homeGroup.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAddGroup = addGroup.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContentGroup = contentGroup.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommentGroup = commentGroup.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredManagementGroup = managementGroup.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const profileImage = userInfo?.profileImage
    ? `http://localhost:5001/uploads/${userInfo.profileImage}`
    : defaultAvatar;

  const isGroupActive = (groupItems) => {
    return groupItems.some((item) => location.pathname.includes(item.to));
  };

  return (
    <div className={`w-64 flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#E8EFFA] text-black'}`}>
      <nav className="flex-1">
        <ul className="space-y-4 ml-3 mb-4">
          <li>
            <div className={`p-4 mt-3 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="flex items-center space-x-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full h-16 w-16 object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} size="4x" className="text-gray-500" />
                )}
                <span className="text-lg font-medium">{userInfo?.name}</span>
              </div>
            </div>
          </li>
          {menuItems.map((item, index) => (
            <li key={index} className="animate-slide-in">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                    isActive
                      ? 'text-[#F2115E] border-[#F2115E]'
                      : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                  }`
                }
                onClick={handleNavClick}
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={item.icon} />
                  <span>{item.label}</span>
                </div>
                <FontAwesomeIcon icon={faAngleRight} />
              </NavLink>
            </li>
          ))}
          {/* Ana Sayfa Grubu */}
          <li>
            <div
              onClick={() => handleGroupToggle('home')}
              className={`cursor-pointer p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                isGroupActive(homeGroup)
                  ? 'text-[#F2115E] border-[#F2115E]'
                  : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faQuestion} />
                <span className="font-medium">Ana Sayfa</span>
              </div>
              <FontAwesomeIcon icon={openGroups.home ? faAngleDown : faAngleRight} />
            </div>
            {openGroups.home && (
              <ul className="pl-6 space-y-2 mt-2">
                {filteredHomeGroup.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                          isActive
                            ? 'text-[#F2115E] border-[#F2115E]'
                            : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                        }`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* Ekleme Yap Grubu */}
          <li>
            <div
              onClick={() => handleGroupToggle('add')}
              className={`cursor-pointer p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                isGroupActive(addGroup)
                  ? 'text-[#F2115E] border-[#F2115E]'
                  : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faPlus} />
                <span className="font-medium">Ekleme Yap</span>
              </div>
              <FontAwesomeIcon icon={openGroups.add ? faAngleDown : faAngleRight} />
            </div>
            {openGroups.add && (
              <ul className="pl-6 space-y-2 mt-2">
                {filteredAddGroup.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                          isActive
                            ? 'text-[#F2115E] border-[#F2115E]'
                            : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                        }`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* İçerik Yönetimi Grubu */}
          <li>
            <div
              onClick={() => handleGroupToggle('content')}
              className={`cursor-pointer p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                isGroupActive(contentGroup)
                  ? 'text-[#F2115E] border-[#F2115E]'
                  : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faFileLines} />
                <span className="font-medium">İçerik Yönetimi</span>
              </div>
              <FontAwesomeIcon icon={openGroups.content ? faAngleDown : faAngleRight} />
            </div>
            {openGroups.content && (
              <ul className="pl-6 space-y-2 mt-2">
                {filteredContentGroup.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                          isActive
                            ? 'text-[#F2115E] border-[#F2115E]'
                            : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                        }`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* Yorum Yönetimi Grubu */}
          <li>
            <div
              onClick={() => handleGroupToggle('comments')}
              className={`cursor-pointer p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                isGroupActive(commentGroup)
                  ? 'text-[#F2115E] border-[#F2115E]'
                  : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faComments} />
                <span className="font-medium">Yorum Yönetimi</span>
              </div>
              <FontAwesomeIcon icon={openGroups.comments ? faAngleDown : faAngleRight} />
            </div>
            {openGroups.comments && (
              <ul className="pl-6 space-y-2 mt-2">
                {filteredCommentGroup.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                          isActive
                            ? 'text-[#F2115E] border-[#F2115E]'
                            : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                        }`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
          {/* Yönetim Grubu */}
          <li>
            <div
              onClick={() => handleGroupToggle('management')}
              className={`cursor-pointer p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                isGroupActive(managementGroup)
                  ? 'text-[#F2115E] border-[#F2115E]'
                  : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
              }`}
            >
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={faList} />
                <span className="font-medium">Yönetim</span>
              </div>
              <FontAwesomeIcon icon={openGroups.management ? faAngleDown : faAngleRight} />
            </div>
            {openGroups.management && (
              <ul className="pl-6 space-y-2 mt-2">
                {filteredManagementGroup.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block p-4 border rounded-lg shadow-md transition duration-300 flex justify-between items-center ${
                          isActive
                            ? 'text-[#F2115E] border-[#F2115E]'
                            : `hover:text-[#F2115E] hover:border-[#F2115E] ${darkMode ? 'bg-gray-900' : 'bg-white'}`
                        }`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center space-x-4">
                        <FontAwesomeIcon icon={item.icon} />
                        <span>{item.label}</span>
                      </div>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
