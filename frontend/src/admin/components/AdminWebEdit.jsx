import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminWebEdit = ({ darkMode }) => {
  const [currentFavicon, setCurrentFavicon] = useState('');
  const [currentLogo, setCurrentLogo] = useState('');
  const [siteName, setSiteName] = useState('');
  const [newFavicon, setNewFavicon] = useState(null);
  const [newLogo, setNewLogo] = useState(null);
  const [newSiteName, setNewSiteName] = useState('');

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/settings');
        setCurrentFavicon(data.favicon);
        setCurrentLogo(data.logo);
        setSiteName(data.siteName);
        setNewSiteName(data.siteName); 
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  const handleFaviconChange = (e) => {
    setNewFavicon(e.target.files[0]);
  };

  const handleLogoChange = (e) => {
    setNewLogo(e.target.files[0]);
  };

  const handleSiteNameChange = (e) => {
    setNewSiteName(e.target.value);
  };

  const updateFavicon = (faviconUrl) => {
    const faviconElement = document.getElementById('favicon');
    if (faviconElement) {
      faviconElement.href = faviconUrl;
    } else {
      const link = document.createElement('link');
      link.id = 'favicon';
      link.rel = 'icon';
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('siteName', newSiteName);
    if (newFavicon) {
      formData.append('favicon', newFavicon);
    }
    if (newLogo) {
      formData.append('logo', newLogo);
    }

    try {
      const { data } = await axios.put('http://localhost:5001/api/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.siteName) {
        document.title = data.siteName;
        setSiteName(data.siteName);
      }
      if (data.favicon) {
        setCurrentFavicon(data.favicon);
        updateFavicon(data.favicon);
      }
      if (data.logo) {
        setCurrentLogo(data.logo);
      }

      alert('Site settings updated successfully');
    } catch (error) {
      console.error('Error updating site settings:', error);
      alert('Güncellenirken Hata Oluştu');
    }
  };

  return (
    <div className={`flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-[#E8EFFA]'}`}>
      <div className={`shadow-lg rounded-lg p-8 w-full max-w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Website Ayarlarını Düzenle</h2>
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          
          <div className="mb-6 md:flex-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Mevcut Favicon</label>
            <div className="flex items-center">
              {currentFavicon && <img src={currentFavicon} alt="Current Favicon" className="w-12 h-12 mr-4" />}
              <input
                type="file"
                onChange={handleFaviconChange}
                className={`text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${darkMode ? 'file:bg-gray-600 file:text-white hover:file:bg-gray-500' : 'file:bg-[#F2115E] file:text-white hover:file:bg-[#e0004a]'} transition duration-300`}
              />
            </div>
          </div>

          <div className="mb-6 md:flex-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Mevcut Logo</label>
            <div className="flex items-center">
              {currentLogo && <img src={currentLogo} alt="Current Logo" className="w-16 h-16 mr-4" />}
              <input
                type="file"
                onChange={handleLogoChange}
                className={`text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${darkMode ? 'file:bg-gray-600 file:text-white hover:file:bg-gray-500' : 'file:bg-[#F2115E] file:text-white hover:file:bg-[#e0004a]'} transition duration-300`}
              />
            </div>
          </div>

          <div className="mb-6 md:flex-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Web Site İsmi</label>
            <input
              type="text"
              value={newSiteName}
              onChange={handleSiteNameChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Yeni Web Site İsmi"
            />
          </div>

        </div>

        <button
          onClick={handleUpdate}
          className={`w-full py-2 px-4 rounded font-bold transition duration-300 focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-[#F2115E] hover:bg-[#e0004a] text-white'}`}
        >
          Güncelle
        </button>
      </div>
    </div>
  );
};

export default AdminWebEdit;
