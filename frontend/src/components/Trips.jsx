import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faAngleRight, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Gezi from '../assets/gezi.png';

const Trips = () => {
  return (
    <>
      <div className="flex justify-center mx-auto p-4">
        <div className="w-full max-w-screen-lg">
          {/* Arama Kısmı */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mt-5 mb-8 sm:mb-20 md:mb-24 lg:mb-32">
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto md:w-60 lg:w-72">
                <select className="border border-gray-300 text-gray-600 bg-white p-3 rounded-md appearance-none h-12 w-full focus:outline-none focus:border-[#e14b00]">
                  <option>Nereye?</option>
                  <option>İstanbul</option>
                  <option>Ankara</option>
                  <option>İzmir</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto md:w-60 lg:w-72">
                <select className="border border-gray-300 text-gray-600 bg-white p-3 rounded-md appearance-none h-12 w-full focus:outline-none focus:border-[#e14b00]">
                  <option>Ne Zaman?</option>
                  <option>Ocak</option>
                  <option>Şubat</option>
                  <option>Mart</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-auto md:w-60 lg:w-72">
                <select className="border border-gray-300 text-gray-600 bg-white p-3 rounded-md appearance-none h-12 w-full focus:outline-none focus:border-[#e14b00]">
                  <option>Kaç Kişi?</option>
                  <option>1 Kişi</option>
                  <option>2 Kişi</option>
                  <option>3 Kişi</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <button className="bg-[#e14b00] text-white p-3 rounded-lg w-full sm:w-auto md:w-60 lg:w-72 hover:bg-[#c73e00] transition-colors duration-200">
                Keşfet
              </button>
            </div>

          {/* Kartlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300">
                <img src={Gezi} alt="Gezi" className="rounded-lg mb-2 object-cover w-full h-32" />
                <p className="font-semibold text-gray-400">Mağusa, Cyprus</p>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Kapalı Maraş</h2>
                  <Link to="#" className="text-2xl"><FontAwesomeIcon icon={faAngleRight} /></Link>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="bg-[#e14b00] px-2 py-1 rounded-lg text-white">Kategori</div>
                  <div className="text-gray-500"><FontAwesomeIcon icon={faCommentDots} /> Yorum Yok</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Trips;
