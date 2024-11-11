import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGurmeDetail } from '../actions/gurmeDetailActions.js';
import Chef from '../assets/default-chef.png';

const GurmeDetail = () => {
  const dispatch = useDispatch();
  const { gurmeDetail, loading, error } = useSelector((state) => state.gurmeDetail);

  useEffect(() => {
    if (!gurmeDetail || Object.keys(gurmeDetail).length === 0) {
      dispatch(fetchGurmeDetail());
    }
  }, [dispatch]);

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="relative overflow-hidden bg-white min-h-screen flex items-center justify-center mt-12">
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-12 items-center bg-[#f1eeec] rounded-lg shadow-lg">
        {/* Left Text Container */}
        <div className="flex flex-col items-start p-4 space-y-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {gurmeDetail?.titleLeft}
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {gurmeDetail?.descriptionLeft}
          </p>
        </div>

        {/* Chef Image */}
        <div className="flex justify-center">
          <img
            src={gurmeDetail?.image || Chef}
            alt="Chef"
            className="w-40 md:w-56 lg:w-72 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>

        {/* Right Text Container */}
        <div className="flex flex-col items-start p-4 space-y-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {gurmeDetail?.titleRight}
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {gurmeDetail?.descriptionRight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GurmeDetail;
