import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteRestaurant, getRestaurants } from '../../actions/restaurantActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import UpButton from './AdminUpButton';
import loadingGif from '../../assets/loading.gif';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRestaurantList = ({ darkMode }) => {
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [visibleRestaurants, setVisibleRestaurants] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const restaurantList = useSelector((state) => state.restaurantList);
    const { loading, error, restaurants } = restaurantList;

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
        setVisibleRestaurants((prevRestaurants) => [...prevRestaurants, ...newRestaurants]);
        setPage(newPage);

        if (visibleRestaurants.length + newRestaurants.length >= restaurants.length) {
            setHasMore(false);
        }
    };

    const deleteHandler = (id) => {
        toast(
            ({ closeToast }) => (
                <div className="text-center">
                    <p className="text-lg font-semibold mb-4">Silmek istediğinize emin misiniz?</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => confirmDeletion(id, closeToast)}
                        >
                            Evet
                        </button>
                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={closeToast}
                        >
                            Hayır
                        </button>
                    </div>
                </div>
            ),
            {
                position: 'top-center',
                autoClose: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                className: `rounded-lg shadow-lg p-5 border ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white border-gray-300'}`,
            }
        );
    };

    const confirmDeletion = (id, closeToast) => {
        dispatch(deleteRestaurant(id))
            .then(() => {
                toast.success('Tavsiye başarıyla silindi!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => window.location.reload(),
                });
            })
            .catch(() => {
                toast.error('Tavsiye silinemedi. Lütfen tekrar deneyin.', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

        closeToast();
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
                    type: 'spring',
                    stiffness: 100,
                }}
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
            >
                <div className={`block rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                    {restaurant.images.length > 0 && (
                        <img
                            src={`http://localhost:5001/${restaurant.images[0]}`}
                            alt={restaurant.name}
                            className="w-full h-48 sm:h-60 md:h-64 lg:h-72 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                        <p className="mb-2">{restaurant.address}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => deleteHandler(restaurant._id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <Link
                                to={`/admin/restaurant/edit/${restaurant._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.li>
        );
    };

    return (
        <div className={`${darkMode ? 'text-white' : 'text-black'}`}>
            <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <h2 className="text-2xl font-semibold flex items-center justify-center">
                    Tavsiye Listesi
                </h2>
            </div>
            
            <div className="flex justify-center items-center mt-8 mb-5">
                <FontAwesomeIcon icon={faMagnifyingGlass} className='text-[#F2115E]' />
                <input
                    type="text"
                    placeholder="Tavsiye Ara..."
                    className={`p-2 border rounded ml-3 shadow focus:shadow-xl focus:outline-none focus:border-[#F2115E] transition duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className={`ml-3 px-4 py-2 rounded-lg transition duration-300 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#F2115E] text-white hover:bg-[#e0004a]'}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FontAwesomeIcon icon={faFilter} />
                </button>
            </div>

            {showFilters && (
                <div className={`m-4 p-4 shadow rounded max-w-4xl mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <h3 className="text-lg font-semibold mb-3">Filtrele</h3>
                    <div className="flex space-x-4">
                        <div>
                            <label className="block">Ülke</label>
                            <select
                                className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
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
                                <label className="block">Şehir</label>
                                <select
                                    className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
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
                                <label className="block">İlçe</label>
                                <select
                                    className={`border rounded p-2 ${darkMode ? 'bg-gray-700 text-white' : ''}`}
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
                            className={`px-4 py-2 rounded hover:bg-[#e0004a] transition duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-[#F2115E] text-white'}`}
                            onClick={handleClearFilters}
                        >
                            Temizle
                        </button>
                    </div>
                </div>
            )}

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
                            <p className={`text-center mt-10 text-gray-600 mb-8 ${darkMode ? 'text-white' : 'text-gray'}`}>Daha fazla Tavsiye bulunamadı.</p>
                        )
                    }
                    style={{ overflow: 'visible' }}
                >
                    <ul className="flex flex-wrap justify-center">
                        {filteredRestaurants.map((restaurant, index) => (
                            <RestaurantItem key={restaurant._id} restaurant={restaurant} index={index} />
                        ))}
                    </ul>
                </InfiniteScroll>
            )}
            <ToastContainer />
            <UpButton />
        </div>
    );
};

export default AdminRestaurantList;
