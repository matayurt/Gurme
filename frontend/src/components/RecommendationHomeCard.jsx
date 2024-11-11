import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurants } from '../actions/restaurantActions';
import { getApprovedComments } from '../actions/commentActions';
import loadingGif from '../assets/loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faCommentDots, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import Catal from '../assets/catal.png';

const RecommendationHomeCard = () => {
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [visibleRestaurants, setVisibleRestaurants] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const restaurantList = useSelector((state) => state.restaurantList || {});
  const { loading, error, restaurants = [] } = restaurantList;

  const approvedCommentsList = useSelector((state) => state.commentApprovedList);
  const { comments: approvedComments = [] } = approvedCommentsList;

  useEffect(() => {
    dispatch(getRestaurants());
    dispatch(getApprovedComments());
  }, [dispatch]);

  useEffect(() => {
    if (restaurants.length > 0) {
      const initialLoad = restaurants.slice(0, 10);
      setVisibleRestaurants(initialLoad);
      setHasMore(restaurants.length > 10);
    }
  }, [restaurants]);

  const fetchMoreData = () => {
    if (visibleRestaurants.length >= restaurants.length) {
      setHasMore(false);
      return;
    }

    const newPage = page + 1;
    const newRestaurants = restaurants.slice(visibleRestaurants.length, newPage * 10);
    setVisibleRestaurants((prevRestaurants) => [...prevRestaurants, ...newRestaurants]);
    setPage(newPage);

    if (visibleRestaurants.length + newRestaurants.length >= restaurants.length) {
      setHasMore(false);
    }
  };

  const filteredRestaurants = visibleRestaurants.filter((restaurant) => {
    const matchesSearchTerm = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || restaurant.country === selectedCountry;
    const matchesCity = !selectedCity || restaurant.city === selectedCity;
    const matchesDistrict = !selectedDistrict || restaurant.district === selectedDistrict;

    return matchesSearchTerm && matchesCountry && matchesCity && matchesDistrict;
  });

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity('');
    setSelectedDistrict('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedDistrict('');
    setVisibleRestaurants(restaurants.slice(0, 10));
    setPage(1);
    setHasMore(restaurants.length > 10);
  };

  const getCities = () => {
    return Array.from(
      new Set(
        restaurants.filter((r) => r.country === selectedCountry).map((r) => r.city)
      )
    );
  };

  const getDistricts = () => {
    return Array.from(
      new Set(
        restaurants.filter((r) => r.city === selectedCity).map((r) => r.district)
      )
    );
  };

  const getCommentCount = (restaurantId) => {
    return approvedComments.filter((comment) => comment?.restaurant?._id === restaurantId).length;
  };

  const RestaurantItem = ({ restaurant, index }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    const commentCount = getCommentCount(restaurant._id);

    return (
      <motion.li
        ref={ref}
        key={restaurant._id}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.7,
          ease: 'easeInOut',
          delay: index * 0.1,
          type: 'spring',
          stiffness: 100,
        }}
        className="border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
          <div className="p-4 pb-0">
            {restaurant.images.length > 0 && (
              <img
                src={`http://localhost:5001/${restaurant.images[0]}`}
                alt={restaurant.name}
                className="rounded-lg object-cover w-full h-32"
              />
            )}
          </div>
          <div className="flex flex-col justify-between flex-grow p-4">
            <div className="mb-8">
              <h2 className="text-gray-400 mb-2">
                {restaurant.district}, {restaurant.city}
              </h2>
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                <Link to={`/restaurant/${restaurant._id}`} className="text-2xl">
                  <FontAwesomeIcon icon={faAngleRight} />
                </Link>
              </div>
            </div>
            <div className="flex justify-between items-center mt-auto relative">
              <div className="flex items-center pl-1">
                <div className="relative">
                  <div className="absolute top-[-1px] left-[-12px] z-10 w-7 h-7 rounded-full bg-[#484f56] flex items-center justify-center">
                    <img src={Catal} alt="Catal Icon" className="w-6 h-6" />
                  </div>
                  <span className="bg-[#e14b00] pl-4 pr-1 py-1 text-sm rounded-lg text-white relative">
                    {restaurant.category ? restaurant.category.name : 'Kategori Yok'}
                  </span>
                </div>
              </div>
              <div className="text-gray-500 text-sm">
                <FontAwesomeIcon icon={faCommentDots} className="text-md" /> {commentCount > 0 ? `${commentCount} Yorum` : 'Yorum Yok'}
              </div>
            </div>
          </div>
        </div>
      </motion.li>
    );
  };

  return (
    <div className="flex justify-center mx-auto p-4">
      <div className="w-full max-w-6xl">
        {/* Arama ve Filtre Bölümü */}
        <div className="flex items-center mt-5 mb-8 justify-center flex-wrap gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tavsiye Ara..."
              className="border border-gray-300 bg-white p-3 rounded-md appearance-none h-12 w-full focus:outline-none focus:border-[#e14b00]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            className="bg-[#e14b00] text-white px-4 py-2 rounded hover:bg-[#c73e00] transition duration-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        {showFilters && (
          <div className="m-4 p-4 bg-white shadow rounded max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">Filtrele</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-gray-700">Ülke</label>
                <select
                  className="border rounded p-2 w-full"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                >
                  <option value="">Tümü</option>
                  {Array.from(new Set(restaurants.map((r) => r.country))).map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCountry && getCities().length > 0 && (
                <div>
                  <label className="block text-gray-700">Şehir</label>
                  <select
                    className="border rounded p-2 w-full"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="">Tümü</option>
                    {getCities().map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedCity && getDistricts().length > 0 && (
                <div>
                  <label className="block text-gray-700">İlçe</label>
                  <select
                    className="border rounded p-2 w-full"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Tümü</option>
                    {getDistricts().map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                onClick={handleClearFilters}
              >
                Temizle
              </button>
            </div>
          </div>
        )}

        {/* Kartlar */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <img src={loadingGif} alt="Loading..." className="w-24 h-24 object-cover" />
            </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <InfiniteScroll
              dataLength={filteredRestaurants.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center items-center mt-10">
                  <img src={loadingGif} alt="Loading..." className="w-24 object-cover animate-spin" />
                </div>
              }
              endMessage={
                !hasMore && (
                  <p className="text-center mt-10 text-gray-600 mb-8">
                    Daha fazla tavsiye bulunamadı.
                  </p>
                )
              }
              style={{ overflow: 'visible' }}
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantItem key={restaurant._id} restaurant={restaurant} index={index} />
                ))}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationHomeCard;
