import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { faCircleUser, faSignOutAlt, faEye, faUtensils, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FaSun, FaMoon } from 'react-icons/fa';
import { logout } from '../../actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ onSearch, darkMode, toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (e) => {
    if (e.target.closest('.dropdown') === null) {
      setDropdownOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', closeDropdown);
    } else {
      document.removeEventListener('click', closeDropdown);
    }

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [dropdownOpen]);

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md transition duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="text-3xl font-bold text-[#F2115E] ml-10">
        <FontAwesomeIcon icon={faUtensils} /> GURME
      </div>
      
      <div className="flex items-center">
        <button
          onClick={toggleDarkMode}
          className="mx-4 p-2 cursor-pointer hover:text-[#F2115E] transition duration-300"
        >
          {darkMode ? <FaMoon size={24} /> : <FaSun size={24} />}
        </button>
        <div className="relative dropdown transition duration-300">
          <button
            onClick={toggleDropdown}
            className={`flex items-center space-x-2 transition duration-300 ${
              darkMode ? 'text-white hover:text-[#F2115E]' : 'text-black hover:text-[#F2115E]'
            }`}
          >
            <FontAwesomeIcon icon={faCircleUser} className="text-4xl" />
            <span className="text-xl text-center font-bold">{userInfo?.name}</span>
          </button>
          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 transition duration-300 ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Link
                to="profile"
                className={`block px-4 py-2 flex items-center ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Profili Görüntüle
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 flex items-center ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
