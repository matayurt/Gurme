import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faUsers, faUserShield, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [activeSide, setActiveSide] = useState('client');

  const handleNavigate = (side) => {
    if (side === 'admin') {
      navigate('/admin/admin');
    } else {
      navigate('/');
    }
    setActiveSide(side);
    setIsOpen(false);
  };

  if (userInfo && userInfo.isAdmin) {
    return (
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-[#F2115E] ml-10">
            <FontAwesomeIcon icon={faUtensils} /> GURME
          </Link>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-[#F2115E] focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          {/* Fullscreen Mobile Menu */}
          <div className={`fixed inset-0 bg-gray-900 text-white flex flex-col justify-center items-center transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden z-50`}>
            <button onClick={toggleMenu} className="absolute top-5 right-5 text-[#F2115E]">
              <FaTimes size={30} />
            </button>
            <Link to="/" onClick={toggleMenu} className="text-2xl mb-6 hover:text-[#F2115E]">Hakkımda</Link>
            <Link to="/recommendations" onClick={toggleMenu} className="text-2xl mb-6 hover:text-[#F2115E]">Tavsiyeler</Link>
            <Link to="/mytrips" onClick={toggleMenu} className="text-2xl mb-6 hover:text-[#F2115E]">Gezi Rehberim</Link>
            <Link to="/mywritings" onClick={toggleMenu} className="text-2xl mb-6 hover:text-[#F2115E]">Yazılarım</Link>
            <Link to="/contact" onClick={toggleMenu} className="text-2xl mb-6 hover:text-[#F2115E]">İletişim</Link>
            <div
              className={`p-4 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'client' ? 'text-[#F2115E]' : 'text-gray-400'}`}
              onClick={() => handleNavigate('client')}
            >
              <FontAwesomeIcon icon={faUsers} size="2x" />
            </div>
            <div
              className={`p-4 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'admin' ? 'text-[#F2115E]' : 'text-gray-400'}`}
              onClick={() => handleNavigate('admin')}
            >
              <FontAwesomeIcon icon={faUserShield} size="2x" className='ml-2' />
            </div>
          </div>
          <div className="hidden md:flex md:flex-row md:items-center">
            <Link to="/" className="block text-gray-400 px-4 py-2 hover:text-[#F2115E] transition duration-300">Hakkımda</Link>
            <Link to="/recommendations" className="block text-gray-400 px-4 py-2 hover:text-[#F2115E] transition duration-300">Tavsiyeler</Link>
            <Link to="/mytrips" className="block text-gray-400 px-4 py-2 hover:text-[#F2115E] transition duration-300">Gezi Rehberim</Link>
            <Link to="/mywritings" className="block text-gray-400 px-4 py-2 hover:text-[#F2115E] transition duration-300">Yazılarım</Link>
            <Link to="/contact" className="block text-gray-400 px-4 py-2 hover:text-[#F2115E] transition duration-300">İletişim</Link>
            <div
              className={`ml-10 p-2 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'client' ? 'text-[#F2115E]' : 'text-gray-400'}`}
              onClick={() => handleNavigate('client')}
            >
              <FontAwesomeIcon icon={faUsers} size="2x" />
            </div>
            <div
              className={`mx-2 p-2 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'admin' ? 'text-[#F2115E]' : 'text-gray-400'}`}
              onClick={() => handleNavigate('admin')}
            >
              <FontAwesomeIcon icon={faUserShield} size="2x" className='ml-2' />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white p-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-black p-3"><FontAwesomeIcon icon={faUtensils} /> GURME</Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className={`fixed inset-0 bg-white text-black flex flex-col justify-center items-center transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden z-50`}>
          <button onClick={toggleMenu} className="absolute top-5 right-5 text-black">
            <FaTimes size={30} />
          </button>
          <Link to="/" onClick={toggleMenu} className="text-2xl mb-6 hover:text-gray-400">Hakkımda</Link>
          <Link to="/recommendations" onClick={toggleMenu} className="text-2xl mb-6 hover:text-gray-400">Tavsiyeler</Link>
          <Link to="/mytrips" onClick={toggleMenu} className="text-2xl mb-6 hover:text-gray-400">Gezi Rehberim</Link>
          <Link to="/mywritings" onClick={toggleMenu} className="text-2xl mb-6 hover:text-gray-400">Yazılarım</Link>
          <Link to="/contact" onClick={toggleMenu} className="text-2xl mb-6 hover:text-gray-400">İletişim</Link>
          <button className='text-2xl mb-6 hover:text-gray-400 flex items-center'>TR</button>
        </div>
        <div className="hidden md:flex md:flex-row md:items-center">
          <Link to="/" className="block text-black px-4 py-2 hover:text-gray-300 transition duration-300">Hakkımda</Link>
          <Link to="/recommendations" className="block text-black px-4 py-2 hover:text-gray-300 transition duration-300">Tavsiyeler</Link>
          <Link to="/mytrips" className="block text-black px-4 py-2 hover:text-gray-300 transition duration-300">Gezi Rehberim</Link>
          <Link to="/mywritings" className="block text-black px-4 py-2 hover:text-gray-300 transition duration-300">Yazılarım</Link>
          <Link to="/contact" className="block text-black px-4 py-2 hover:text-gray-300 transition duration-300">İletişim</Link>
          <button className='block text-black px-2 py-1 border border-black rounded-lg hover:text-gray-300 transition duration-300 flex items-center'>TR</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
