import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRestaurant } from '../../actions/restaurantActions';
import { getCategories } from '../../actions/categoryActions';
import { useDropzone } from 'react-dropzone';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StarRatingComponent from 'react-star-rating-component';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 41.015137,
  lng: 28.97953,
};

const AddRestaurant = ({ darkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "Your-Google-Maps-API-Key",
    libraries: ['places'],
  });

  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [images, setImages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationError, setLocationError] = useState('');
  const [noLocation, setNoLocation] = useState(false);
  const [formError, setFormError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');

  const [foodRating, setFoodRating] = useState(1);
  const [serviceRating, setServiceRating] = useState(1);
  const [cleaningRating, setCleaningRating] = useState(1);
  const [atmosphereRating, setAtmosphereRating] = useState(1);
  const [priceRating, setPriceRating] = useState(1);

  const [hoveredServiceStar, setHoveredServiceStar] = useState(null);
  const [hoveredCleaningStar, setHoveredCleaningStar] = useState(null);
  const [hoveredAtmosphereStar, setHoveredAtmosphereStar] = useState(null);
  const [hoveredPriceStar, setHoveredPriceStar] = useState(null);

  const [description, setDescription] = useState('');

  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const [selectedCategories, setSelectedCategories] = useState(['']);

  const categoryList = useSelector((state) => state.categoryList);
  const { categories, loading: categoryLoading, error: categoryError } = categoryList;

  useEffect(() => {
    dispatch(getCategories());
    fetchCountries();
  }, [dispatch]);

  const fetchCountries = async () => {
    try {
      const { data } = await axios.get('https://restcountries.com/v3.1/all');
      setCountries(data.map(country => ({ name: country.name.common, code: country.cca2 })));
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: acceptedFiles => {
      setImages(prevImages => [
        ...prevImages,
        ...acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    setFormError('');

    if (!restaurantName || !address || !selectedCountry || !selectedCity || !selectedDistrict || !description) {
      toast.error('Lütfen tüm alanları doldurun.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const filteredCategories = selectedCategories.filter(category => category !== '');
    if (filteredCategories.length === 0) {
      toast.error('Lütfen bir kategori seçin.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!noLocation && !selectedLocation && (!latitude || !longitude)) {
      toast.error('Lütfen bir konum seçin veya enlem ve boylam girin.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', restaurantName);
    formData.append('address', address);
    formData.append('district', selectedDistrict);
    formData.append('city', selectedCity);
    formData.append('country', selectedCountry);
    formData.append('phoneNumber', phoneNumber);
    formData.append('website', website);
    formData.append('description', description);

    formData.append('category', filteredCategories[filteredCategories.length - 1]);

    if (selectedLocation) {
      formData.append('latitude', selectedLocation.lat);
      formData.append('longitude', selectedLocation.lng);
    } else if (latitude && longitude) {
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
    }

    images.forEach(image => {
      formData.append('images', image);
    });

    formData.append('service', serviceRating);
    formData.append('cleaning', cleaningRating);
    formData.append('atmosphere', atmosphereRating);
    formData.append('price', priceRating);

    try {
      await dispatch(addRestaurant(formData));
      toast.success('Tavsiye başarılı bir şekilde eklendi!', {
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
      toast.error('Tavsiye eklenemedi. Lütfen tekrar deneyin.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCategoryChange = (index, value) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;

    if (getSubCategories(value).length > 0) {
      newSelectedCategories.splice(index + 1, selectedCategories.length - index - 1, '');
    } else {
      newSelectedCategories.splice(index + 1);
    }

    setSelectedCategories(newSelectedCategories);
  };

  const getSubCategories = (parentId) => {
    if (!categories) return [];
    return categories.filter((cat) => cat.parentId === parentId);
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const onMapClick = useCallback((event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setLatitude('');
    setLongitude('');
    setLocationError('');
  }, []);

  const handleNoLocationChange = () => {
    setNoLocation(!noLocation);
    if (!noLocation) {
      setSelectedLocation(null);
      setLatitude('');
      setLongitude('');
    }
  };

  const handleStarHover = (setHoveredStar) => (nextValue) => {
    setHoveredStar(nextValue);
  };

  const handleStarHoverOut = (setHoveredStar) => () => {
    setHoveredStar(null);
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setSelectedLocation({
        lat: location.lat(),
        lng: location.lng(),
      });
      setLatitude('');
      setLongitude('');
      setLocationError('');
      if (mapRef.current) {
        mapRef.current.panTo(location);
      }
    }
  };

  const onLatitudeChange = (e) => {
    setLatitude(e.target.value);
    setSelectedLocation(null);
    setLocationError('');
  };

  const onLongitudeChange = (e) => {
    setLongitude(e.target.value);
    setSelectedLocation(null);
    setLocationError('');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    setImages(reorderedImages);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className={`max-w-full mx-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <form onSubmit={submitHandler} className={`shadow-md rounded-lg p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-semibold text-center mb-6">Tavsiye Ekle</h2>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}

        {/* Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-bold mt-5">Tavsiye Adı:</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Tavsiye Adı Girin"
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
            />
          </div>
          <div className="col-span-1 mt-4">
            <label className="block text-sm font-bold mb-1">Ülke:</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <option value="">Ülke Seçin</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 mt-3">
            <label className="block text-sm font-bold mb-2">Şehir:</label>
            <input
              type="text"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              placeholder="Şehir Girin"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2">İlçe:</label>
            <input
              type="text"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              placeholder="İlçe Girin"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold mb-2">Adres:</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              placeholder="Adres Girin"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2">Website:</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              placeholder="Website URL Girin"
            />
          </div>

          {/* Ülkelere Göre Telefon Numarası Bölümü */}
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2">Telefon Numarası:</label>
            <PhoneInput
              country={'tr'}
              value={phoneNumber}
              onChange={setPhoneNumber}
              inputStyle={{
                backgroundColor: darkMode ? '#1a202c' : '#ffffff', 
                color: darkMode ? '#ffffff' : '#4a5568', 
                borderColor: darkMode ? '#2d3748' : '#e2e8f0', 
                borderRadius: '4px',
              }}
            />
          </div>


          {/* Açıklama Input */}
          <div className="col-span-3 mb-6">
          <label className="block text-sm font-bold mb-2">Açıklama:</label>
          <div className={darkMode ? 'dark-mode' : ''}>
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Tavsiye açıklamasını buraya yazın..."
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              theme="snow"
            />
          </div>
        </div>
        </div>

        {/* Fotoğraf Yükleme */}
        <div className="col-span-3 mb-4">
          <label className="block font-medium mb-2">Fotoğraflar</label>
          <div
            {...getRootProps({
              className: 'border-dashed border-2 border-gray-300 rounded-lg p-4 cursor-pointer focus:outline-none',
            })}
          >
            <input {...getInputProps()} />
            <p className={`text-center ${darkMode ? 'text-white' : 'text-gray-500'}`}>
              Fotoğrafları Buraya Sürükleyin veya Tıklayın
            </p>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {images.map((file, index) => (
                    <Draggable key={index} draggableId={`image-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden"
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

        {/* Kategori Seçme Bölümü */}
        {selectedCategories.map((category, index) => (
          <div className="col-span-1 mb-4" key={index}>
            <label className={`block text-gray-700 text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {index === 0 ? 'Kategori' : `Alt Kategori ${index}`}
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
              }`}
              value={category}
              onChange={(e) => handleCategoryChange(index, e.target.value)}
            >
              <option value="">Seçin</option>
              {getSubCategories(selectedCategories[index - 1] || null).map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Puan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-```jsx
6 mt-8 justify-items-center items-center">
          <div className="flex flex-col items-center col-span-1">
            <label className="block text-sm font-bold mb-2 text-center">Hizmet:</label>
            <StarRatingComponent
              name="serviceRating"
              starCount={5}
              value={serviceRating}
              onStarClick={(value) => setServiceRating(value)}
              onStarHover={handleStarHover(setHoveredServiceStar)}
              onStarHoverOut={handleStarHoverOut(setHoveredServiceStar)}
              renderStarIcon={(index, value) => (
                <span
                  className={`text-4xl cursor-pointer ${
                    index <= (hoveredServiceStar || value) ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className="block text-sm font-bold mb-2 text-center">Temizlik:</label>
            <StarRatingComponent
              name="cleaningRating"
              starCount={5}
              value={cleaningRating}
              onStarClick={(value) => setCleaningRating(value)}
              onStarHover={handleStarHover(setHoveredCleaningStar)}
              onStarHoverOut={handleStarHoverOut(setHoveredCleaningStar)}
              renderStarIcon={(index, value) => (
                <span
                  className={`text-4xl cursor-pointer ${
                    index <= (hoveredCleaningStar || value) ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className="block text-sm font-bold mb-2 text-center">Atmosfer:</label>
            <StarRatingComponent
              name="atmosphereRating"
              starCount={5}
              value={atmosphereRating}
              onStarClick={(value) => setAtmosphereRating(value)}
              onStarHover={handleStarHover(setHoveredAtmosphereStar)}
              onStarHoverOut={handleStarHoverOut(setHoveredAtmosphereStar)}
              renderStarIcon={(index, value) => (
                <span
                  className={`text-4xl cursor-pointer ${
                    index <= (hoveredAtmosphereStar || value) ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  ★
                </span>
              )}
            />
          </div>

          <div className="flex flex-col items-center col-span-1">
            <label className="block text-sm font-bold mb-2 text-center">Fiyat:</label>
            <StarRatingComponent
              name="priceRating"
              starCount={5}
              value={priceRating}
              onStarClick={(value) => setPriceRating(value)}
              onStarHover={handleStarHover(setHoveredPriceStar)}
              onStarHoverOut={handleStarHoverOut(setHoveredPriceStar)}
              renderStarIcon={(index, value) => (
                <span
                  className={`text-4xl cursor-pointer ${
                    index <= (hoveredPriceStar || value) ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  ★
                </span>
              )}
            />
          </div>
        </div>

        {/* Konum */}
        <div className="col-span-3">
          <label className="block text-sm font-bold mb-2">Konum:</label>
          {!noLocation && (
            <>
              <Autocomplete
                onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  placeholder="Bir lokasyon arayın..."
                  className={`shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline mb-4 ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
                  }`}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={selectedLocation || center}
                onClick={onMapClick}
                onLoad={(map) => (mapRef.current = map)}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
              {locationError && <p className="text-red-500 text-sm mt-2">{locationError}</p>}
            </>
          )}
          {!noLocation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-bold mb-2">Enlem:</label>
                <input
                  type="number"
                  value={latitude}
                  onChange={onLatitudeChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
                  }`}
                  placeholder="Enlem Girin"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Boylam:</label>
                <input
                  type="number"
                  value={longitude}
                  onChange={onLongitudeChange}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'
                  }`}
                  placeholder="Boylam Girin"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={noLocation}
              onChange={handleNoLocationChange}
              className="form-checkbox h-5 w-5 text-gray-600"
            />
            <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              Bu Tavsiye İçin Konum Belirtmek İstemiyorum
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className={`w-full py-2 rounded-lg hover:bg-[#e0004a] transition duration-300 ${
              darkMode ? 'bg-[#F2115E] text-white' : 'bg-[#F2115E] text-white'
            }`}
          >
            Tavsiye Ekle
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRestaurant;
