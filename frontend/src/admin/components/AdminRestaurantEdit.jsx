import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurants, updateRestaurant } from '../../actions/restaurantActions';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StarRatingComponent from 'react-star-rating-component';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const AdminRestaurantEdit = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurantList = useSelector((state) => state.restaurantList);
  const { restaurants } = restaurantList;

  const restaurant = restaurants.find((restaurant) => restaurant._id === id);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [website, setWebsite] = useState(''); 
  const [images, setImages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [noLocation, setNoLocation] = useState(false);
  const [formError, setFormError] = useState('');

  const [foodRating, setFoodRating] = useState(1);
  const [serviceRating, setServiceRating] = useState(1);
  const [cleaningRating, setCleaningRating] = useState(1);
  const [atmosphereRating, setAtmosphereRating] = useState(1);
  const [priceRating, setPriceRating] = useState(1);

  const [hoveredServiceStar, setHoveredServiceStar] = useState(null);
  const [hoveredCleaningStar, setHoveredCleaningStar] = useState(null);
  const [hoveredAtmosphereStar, setHoveredAtmosphereStar] = useState(null);
  const [hoveredPriceStar, setHoveredPriceStar] = useState(null);

  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "Your-Google-Maps-API-Key",
    libraries: ['places'],
  });

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setAddress(restaurant.address);
      setDistrict(restaurant.district);
      setCity(restaurant.city);
      setCountry(restaurant.country);
      setDescription(restaurant.description || ''); 
      setPhoneNumber(restaurant.phoneNumber || '');
      setWebsite(restaurant.website || ''); 
      setImages(restaurant.images.map((image, index) => ({ id: index, preview: `http://localhost:5001/${image}` })));

      setServiceRating(restaurant.serviceRating || 1);
      setCleaningRating(restaurant.cleaningRating || 1);
      setAtmosphereRating(restaurant.atmosphereRating || 1);
      setPriceRating(restaurant.priceRating || 1);

      if (restaurant.location && restaurant.location.coordinates.length === 2) {
        setSelectedLocation({
          lat: restaurant.location.coordinates[1],
          lng: restaurant.location.coordinates[0],
        });
      }
    } else {
      dispatch(getRestaurants());
    }
  }, [dispatch, restaurant]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5001/api/restaurants/${id}/ratings`)
        .then(response => {
          const ratings = response.data;
          setServiceRating(ratings.service);
          setCleaningRating(ratings.cleaning);
          setAtmosphereRating(ratings.atmosphere);
          setPriceRating(ratings.price);
        })
        .catch(error => {
          console.error('Puanlar yüklenirken hata oluştu:', error);
        });
    }
  }, [id]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles.map((file, index) =>
          Object.assign(file, {
            id: prevImages.length + index,
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    setFormError('');

    if (!name || !address || !district || !city || !country || !description) {
      setFormError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!noLocation && !selectedLocation) {
      setLocationError('Lütfen bir konum seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('district', district);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('description', description);
    formData.append('phoneNumber', phoneNumber);
    formData.append('website', website); 
    formData.append('service', serviceRating);
    formData.append('cleaning', cleaningRating);
    formData.append('atmosphere', atmosphereRating);
    formData.append('price', priceRating);

    if (selectedLocation) {
      formData.append('latitude', selectedLocation.lat);
      formData.append('longitude', selectedLocation.lng);
    }

    images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else {
        formData.append('existingImages', image.preview.replace('http://localhost:5001/', ''));
      }
    });

    try {
      await dispatch(updateRestaurant(formData, id));
      toast.success('Restoran başarılı bir şekilde güncellendi!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          navigate('/admin/restaurantlist');
          window.location.reload();
        },
      });
    } catch (error) {
      toast.error('Restoran güncellenemedi. Lütfen tekrar deneyin.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const onMapClick = useCallback((event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setLocationError('');
  }, []);

  const handleNoLocationChange = () => {
    setNoLocation(!noLocation);
    if (!noLocation) {
      setSelectedLocation(null);
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setSelectedLocation({
        lat: location.lat(),
        lng: location.lng(),
      });
      setLocationError('');
      if (mapRef.current) {
        mapRef.current.panTo(location);
      }
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    setImages(reorderedImages);
  };

  if (!isLoaded) return <div>Harita Yükleniyor...</div>;

  return (
    <div className={`max-w-full mx-auto p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-lg`}>
      <form onSubmit={submitHandler} className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md rounded-lg`}>
        <h2 className={`text-2xl font-semibold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Restoranı Düzenle</h2>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Restoran Adı:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Restoran adını girin"
              required
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Adres:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Adres girin"
              required
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>İlçe:</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="İlçe girin"
              required
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Şehir:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Şehir girin"
              required
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Ülke:</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Ülke girin"
              required
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Website:</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Website URL Girin"
            />
          </div>
          <div className="col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Telefon Numarası:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
              placeholder="Telefon Numarası Girin"
            />
          </div>
        </div>

        <div className="col-span-3 mb-6">
          <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Açıklama:</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Restoran açıklamasını buraya yazın..."
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-800 text-white' : 'text-gray-700'}`}
            theme="snow"
          />
        </div>

        {/* Photo Upload */}
        <div className="col-span-3 mb-4">
          <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} font-medium mb-2`}>Fotoğraflar:</label>
          <div
            {...getRootProps({
              className: `border-dashed border-2 rounded-lg p-4 cursor-pointer focus:outline-none ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300'}`,
            })}
          >
            <input {...getInputProps()} />
            <p className={`text-center ${darkMode ? 'text-white' : 'text-gray-500'}`}>Fotoğrafları sürükleyip bırakın veya yüklemek için tıklayın</p>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
                >
                  {images.map((file, index) => (
                    <Draggable key={file.id} draggableId={`image-${file.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative w-full h-24 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        >
                          <img
                            src={file.preview}
                            alt={`preview ${index}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 m-1"
                          >
                            &times;
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 left-0 bg-[#F2115E] text-white text-xs px-2 py-1 rounded-bl-lg">
                              Kapak Fotoğrafı
                            </span>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 justify-items-center items-center">
          <div className="flex flex-col items-center col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2 text-center`}>Hizmet:</label>
            <StarRatingComponent
              name="serviceRating"
              starCount={5}
              value={serviceRating}
              onStarClick={(value) => setServiceRating(value)}
              onStarHover={(nextValue) => setHoveredServiceStar(nextValue)}
              onStarHoverOut={() => setHoveredServiceStar(null)}
              renderStarIcon={(index, value) => (
                <span className={`text-4xl cursor-pointer ${index <= (hoveredServiceStar || value) ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2 text-center`}>Temizlik:</label>
            <StarRatingComponent
              name="cleaningRating"
              starCount={5}
              value={cleaningRating}
              onStarClick={(value) => setCleaningRating(value)}
              onStarHover={(nextValue) => setHoveredCleaningStar(nextValue)}
              onStarHoverOut={() => setHoveredCleaningStar(null)}
              renderStarIcon={(index, value) => (
                <span className={`text-4xl cursor-pointer ${index <= (hoveredCleaningStar || value) ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2 text-center`}>Atmosfer:</label>
            <StarRatingComponent
              name="atmosphereRating"
              starCount={5}
              value={atmosphereRating}
              onStarClick={(value) => setAtmosphereRating(value)}
              onStarHover={(nextValue) => setHoveredAtmosphereStar(nextValue)}
              onStarHoverOut={() => setHoveredAtmosphereStar(null)}
              renderStarIcon={(index, value) => (
                <span className={`text-4xl cursor-pointer ${index <= (hoveredAtmosphereStar || value) ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2 text-center`}>Fiyat:</label>
            <StarRatingComponent
              name="priceRating"
              starCount={5}
              value={priceRating}
              onStarClick={(value) => setPriceRating(value)}
              onStarHover={(nextValue) => setHoveredPriceStar(nextValue)}
              onStarHoverOut={() => setHoveredPriceStar(null)}
              renderStarIcon={(index, value) => (
                <span className={`text-4xl cursor-pointer ${index <= (hoveredPriceStar || value) ? 'text-yellow-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ★
                </span>
              )}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`}>Konum:</label>
          {!noLocation && (
            <>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Yer arayın..."
                  className={`shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline mb-4 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'text-gray-700 border-gray-300'}`}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={selectedLocation || { lat: 41.015137, lng: 28.979530 }}
                onClick={onMapClick}
                onLoad={(map) => (mapRef.current = map)}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
              {locationError && <p className="text-red-500 text-sm mt-2">{locationError}</p>}
            </>
          )}
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={noLocation}
                onChange={handleNoLocationChange}
                className={`form-checkbox h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              />
              <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Restoranın Google Maps konumu mevcut değil</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className={`w-full py-2 rounded-lg hover:bg-[#e0004a] transition duration-300 ${darkMode ? 'bg-[#F2115E] text-white' : 'bg-[#F2115E] text-white'}`}
          >
            Güncelle
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminRestaurantEdit;
