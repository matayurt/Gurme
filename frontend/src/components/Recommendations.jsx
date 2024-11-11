import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurants } from '../actions/restaurantActions';
import loadingGif from '../assets/loading.gif';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

const Recommendations = () => {
  const dispatch = useDispatch();
  const restaurantList = useSelector((state) => state.restaurantList || {});
  const { loading, error, restaurants = [] } = restaurantList;

  const scrollContainer = useRef(null);

  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);

  useEffect(() => {
    console.log('Fetched restaurants:', restaurants);
  }, [restaurants]);

  const recentRestaurants = restaurants.slice(0, 10);

  useEffect(() => {
    const container = scrollContainer.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      container.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const RestaurantItem = ({ restaurant, index }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.7,
          ease: 'easeInOut',
          delay: index * 0.1,
          type: 'spring',
          stiffness: 100,
        }}
        className="flex-none w-64 h-80 mb-4 ml-4"
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="block bg-white rounded-lg overflow-hidden hover:shadow-lg border border-gray transition duration-300 h-full p-4">
          {restaurant.images && restaurant.images.length > 0 && (
            <img
              src={`http://localhost:5001/${restaurant.images[0]}`}
              alt={restaurant.name}
              className="w-full h-48 object-cover rounded-lg" 
            />
          )}
          <div className="pt-2">
            <p className="restaurant-location text-gray-400">
              {restaurant.district}, {restaurant.city}, {restaurant.country}
            </p>
            <div className="flex justify-between items-center">
              <h3 className="restaurant-name text-xl font-semibold">{restaurant.name}</h3>
              <Link to={`/restaurant/${restaurant._id}`} className='text-2xl'>
              <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className='pl-4 pt-4 mt-16 ml-2 md:ml-60 lg:ml-72 xl:ml-80'>
      <div className="flex">
        <div>
          <h2 className="text-2xl font-bold mb-4">Tavsiyelerim</h2>
          <p className="text-gray-700 mb-8">
            En özel lezzetleri keşfetmeniz için seçtiğim mekanlar ve tatlarla mutfağın en iyilerini deneyimleyin.
          </p>
          <div>
            <Link to="/recommendations" className="text-black-800 hover:underline mb-8 block">
              {'Tümü '}<FontAwesomeIcon icon={faAnglesRight} className='text-gray-400'/>
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainer}
          className="flex overflow-x-auto overflow-y-hidden space-x-4 scrollbar-hide p-2"
          style={{ cursor: 'grab' }}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <img src={loadingGif} alt="Loading..." className="w-24 h-24" />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            recentRestaurants.map((restaurant, index) => (
              <RestaurantItem key={restaurant._id} restaurant={restaurant} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
