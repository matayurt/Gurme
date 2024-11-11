import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faLinkedin, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocialLinks } from '../actions/socialActions.js';

const Footer = () => {
  const dispatch = useDispatch();
  const { socialLinks } = useSelector((state) => state.socialLinks);

  useEffect(() => {
    dispatch(fetchSocialLinks());
  }, [dispatch]);

  const isActiveLink = (link) => link && link.active;

  return (
    <footer className="bg-white text-black py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 mb-12 sm:mb-20 mt-6 sm:mt-12">
          <div className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-0">
            <FontAwesomeIcon icon={faUtensils} /> GURME
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 mb-4 sm:mb-0">
            <Link to="/" className="hover:underline text-sm sm:text-base">Hakkımda</Link>
            <Link to="/recommendations" className="hover:underline text-sm sm:text-base">Tavsiyeler</Link>
            <Link to="/mytrips" className="hover:underline text-sm sm:text-base">Gezi Rehberim</Link>
            <Link to="/mywritings" className="hover:underline text-sm sm:text-base">Yazılarım</Link>
            <Link to="/contact" className="hover:underline text-sm sm:text-base">İletişim</Link>
            <Link to="/" className="hover:underline text-sm sm:text-base">Özgeçmişim</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-0">
            Gizlilik Sözleşmesi <br /><br /> &copy; 2024 - Enes... Tüm hakları saklıdır.
          </p>

          <div className="flex justify-center space-x-4 mt-4 sm:mt-0">
            {isActiveLink(socialLinks?.instagram) && (
              <a href={socialLinks.instagram.link || "#"} target={socialLinks.instagram.link ? '_blank' : '_self'} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:bg-[#E4405F] text-gray-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            )}
            {isActiveLink(socialLinks?.x) && (
              <a href={socialLinks.x.link || "#"} target={socialLinks.x.link ? '_blank' : '_self'} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:bg-[#1DA1F2] text-gray-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faXTwitter} size="lg" />
              </a>
            )}
            {isActiveLink(socialLinks?.facebook) && (
              <a href={socialLinks.facebook.link || "#"} target={socialLinks.facebook.link ? '_blank' : '_self'} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:bg-[#4267B2] text-gray-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
            )}
            {isActiveLink(socialLinks?.linkedin) && (
              <a href={socialLinks.linkedin.link || "#"} target={socialLinks.linkedin.link ? '_blank' : '_self'} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:bg-[#0077B5] text-gray-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            )}
            {isActiveLink(socialLinks?.youtube) && (
              <a href={socialLinks.youtube.link || "#"} target={socialLinks.youtube.link ? '_blank' : '_self'} className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:bg-[#FF0000] text-gray-500 hover:text-white transition duration-300">
                <FontAwesomeIcon icon={faYoutube} size="lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
