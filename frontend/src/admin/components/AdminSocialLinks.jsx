import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSocialLinks, updateSocialLinks } from "../../actions/socialActions.js";
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faLinkedin, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const AdminSocialLinks = ({ darkMode }) => {
  const dispatch = useDispatch();
  const { socialLinks, loading, error } = useSelector((state) => state.socialLinks);

  const [links, setLinks] = useState({
    facebook: { link: "", active: true },
    x: { link: "", active: true },
    linkedin: { link: "", active: true },
    instagram: { link: "", active: true },
    youtube: { link: "", active: true },
  });

  useEffect(() => {
    if (!socialLinks || Object.keys(socialLinks).length === 0) {
      dispatch(fetchSocialLinks());
    } else {
      const filteredLinks = {
        facebook: socialLinks.facebook || { link: "", active: true },
        x: socialLinks.x || { link: "", active: true },
        linkedin: socialLinks.linkedin || { link: "", active: true },
        instagram: socialLinks.instagram || { link: "", active: true },
        youtube: socialLinks.youtube || { link: "", active: true },
      };
      setLinks(filteredLinks);
    }
  }, [dispatch, socialLinks]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [key, field] = name.split(".");
    setLinks({
      ...links,
      [key]: {
        ...links[key],
        [field]: type === "checkbox" ? checked : value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSocialLinks(links));
    toast.success("Sosyal medya linkleri güncellendi!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const iconMap = {
    facebook: faFacebook,
    x: faXTwitter,
    linkedin: faLinkedin,
    instagram: faInstagram,
    youtube: faYoutube,
  };

  return (
    <div className={`max-w-full mx-auto p-12 rounded-lg ${darkMode ? 'text-white' : 'text-black'}`}>
      <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Sosyal Medya Linklerini Düzenle</h2>
      {loading ? (
        <p className={`text-center text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Yükleniyor...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.keys(links).map((key) => (
            <div key={key} className={`flex flex-col items-center justify-between p-4 border rounded-lg shadow-sm ${darkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={iconMap[key]} className={`text-3xl mr-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name={`${key}.link`}
                  value={links[key].link}
                  onChange={handleChange}
                  placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} Linki`}
                  className={`flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300'}`}
                />
              </div>
              <div className="flex items-center">
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={`${key}.active`}
                    checked={links[key].active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`w-10 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#F2115E] peer-checked:bg-[#F2115E] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#f0f0f0] after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'}`}></div>
                  <span className={`ml-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Aktif</span>
                </label>
              </div>
            </div>
          ))}
          <div className="col-span-full flex justify-center mt-6">
            <button type="submit" className={`py-2 px-8 rounded-md transition duration-300 ${darkMode ? 'bg-[#e0004a] hover:bg-[#c9003e] text-white' : 'bg-[#F2115E] hover:bg-[#e0004a] text-white'}`}>
              Güncelle
            </button>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminSocialLinks;
