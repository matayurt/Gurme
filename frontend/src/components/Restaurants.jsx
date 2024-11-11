import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getRestaurants } from '../actions/restaurantActions';
import loadingGif from '../assets/loading.gif';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';

const Restaurants = () => {
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

    useEffect(() => {
        dispatch(getRestaurants());
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
        setVisibleRestaurants(prevRestaurants => [...prevRestaurants, ...newRestaurants]);
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
        return Array.from(new Set(restaurants
            .filter(r => r.country === selectedCountry)
            .map(r => r.city)));
    };

    const getDistricts = () => {
        return Array.from(new Set(restaurants
            .filter(r => r.city === selectedCity)
            .map(r => r.district)));
    };

    const RestaurantItem = ({ restaurant, index }) => {
        const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
        });

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
                    type: "spring",
                    stiffness: 100,
                }}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
            >
                <Link to={`/restaurant/${restaurant._id}`} className="mt-5 block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full">
                    {restaurant.images.length > 0 && (
                        <img
                            src={`http://localhost:5001/${restaurant.images[0]}`}
                            alt={restaurant.name}
                            className="w-full h-48 sm:h-60 md:h-64 lg:h-72 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h2 className="text-gray-700 mb-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                            {restaurant.district}, {restaurant.city}, {restaurant.country}
                        </h2>
                        <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                        <p className="text-gray-700 mb-4">{restaurant.address}</p>
                    </div>
                </Link>
            </motion.li>
        );
    };

    return (
        <>
            <div className="flex justify-center items-center mt-8">
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-red-800' />
                <input
                    type="text"
                    placeholder="Restoran Ara..."
                    className="p-2 border rounded ml-3 shadow focus:shadow-xl focus:outline-none focus:border-red-800 transition duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="ml-3 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FontAwesomeIcon icon={faFilter} />
                </button>
            </div>

            {showFilters && (
                <div className="m-4 p-4 bg-white shadow rounded max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold mb-3">Filtrele</h3>
                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-gray-700">Ülke</label>
                            <select
                                className="border rounded p-2"
                                value={selectedCountry}
                                onChange={handleCountryChange}
                            >
                                <option value="">Tümü</option>
                                {Array.from(new Set(restaurants.map(r => r.country))).map((country, index) => (
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
                                    className="border rounded p-2"
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
                                    className="border rounded p-2"
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
                                <img src={loadingGif} alt="Loading..." className="w-24 h-24 object-cover animate-spin" />
                            </div>
                        }
                        endMessage={
                            !hasMore && (
                                <p className="text-center mt-10 text-gray-600 mb-8">Daha fazla restoran bulunamadı.</p>
                            )
                        }
                        style={{ overflow: "visible" }}
                    >
                        <ul className="flex flex-wrap justify-center">
                            {filteredRestaurants.map((restaurant, index) => (
                                <RestaurantItem key={restaurant._id} restaurant={restaurant} index={index} />
                            ))}
                        </ul>
                    </InfiniteScroll>
                )}
            </div>
        </>
    );
};

export default Restaurants;
