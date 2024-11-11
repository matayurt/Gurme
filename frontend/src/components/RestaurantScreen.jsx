import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getRestaurants, getRestaurantDetails, incrementRestaurantViewCount } from '../actions/restaurantActions';
import { addComment, getApprovedComments } from '../actions/commentActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faStar,
  faConciergeBell,
  faBroom,
  faGlassCheers,
  faDollarSign,
  faCommentDots,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { faSmile, faMeh, faFrown, faLaugh } from '@fortawesome/free-regular-svg-icons';
import loadingGif from '../assets/loading.gif';
import Slider from 'react-slick';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UpButton from './UpButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestaurantScreen = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();

  const restaurantList = useSelector((state) => state.restaurantList);
  const { loading, error, restaurants } = restaurantList;

  const approvedCommentsList = useSelector((state) => state.commentApprovedList);
  const { comments: approvedComments = [] } = approvedCommentsList;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Geçersiz Tarih"; 
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
  };

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');

  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyName, setReplyName] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});

  const [visibleComments, setVisibleComments] = useState(10);
  const [currentSortOrder, setCurrentSortOrder] = useState('newest');

  const commentFormRef = useRef(null); 

  useEffect(() => {
    dispatch(getRestaurantDetails(restaurantId));
    dispatch(getApprovedComments());
    dispatch(incrementRestaurantViewCount(restaurantId));
  }, [dispatch, restaurantId]);

  useEffect(() => {
    if (restaurants.length === 0) {
      dispatch(getRestaurants());
    }
  }, [dispatch, restaurants.length]);

  const restaurant = restaurants.find((r) => r._id === restaurantId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const commentData = { name, comment, phoneNumber, email, address, restaurantId};
    
    try {
      const response = await fetch('http://localhost:5001/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });      
  
      if (response.ok) {
        dispatch(getRestaurants());
        dispatch(getApprovedComments());
    
        toast.success('Yorum başarıyla gönderildi ve yönetici onayına sunuldu.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    
        setName('');
        setComment('');
        setPhoneNumber('');
        setEmail('');
        setAddress('');
      } else {
        throw new Error('Yorum gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
      toast.error('Yorum eklenirken bir hata oluştu, lütfen tekrar deneyin.', {
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

  const handleReplySubmit = async (e) => {
    e.preventDefault();
  
    const replyData = { name: replyName, comment: replyText };
  
    try {
      const response = await fetch(`http://localhost:5001/api/comments/${replyToCommentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
      });
  
      if (!response.ok) {
        throw new Error('Yanıt eklenirken hata oluştu.');
      }
  
      setReplyToCommentId(null);
      setReplyName('');
      setReplyText('');
      dispatch(getApprovedComments());
    } catch (error) {
      console.error('Yanıt eklenirken hata oluştu:', error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleLoadMoreComments = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 10);
  };

  const handleSortChange = (e) => {
    setCurrentSortOrder(e.target.value);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: true,
          autoplay: true,
          autoplaySpeed: 3000,
        },
      },
    ],
  };

  const googleMapEmbedUrl = restaurant && restaurant.location
    ? `https://www.google.com/maps/embed/v1/place?key=Your-Google-Maps_API-Key&q=${restaurant.location.coordinates[1]},${restaurant.location.coordinates[0]}&zoom=15`
    : '';

  const averageRatings = restaurant && restaurant.ratings.length > 0 ? {
    service: (restaurant.ratings.reduce((acc, rating) => acc + rating.service, 0) / restaurant.ratings.length).toFixed(1),
    cleaning: (restaurant.ratings.reduce((acc, rating) => acc + rating.cleaning, 0) / restaurant.ratings.length).toFixed(1),
    atmosphere: (restaurant.ratings.reduce((acc, rating) => acc + rating.atmosphere, 0) / restaurant.ratings.length).toFixed(1),
    price: (restaurant.ratings.reduce((acc, rating) => acc + rating.price, 0) / restaurant.ratings.length).toFixed(1),
  } : null;

  const overallRating = averageRatings ? (
    (parseFloat(averageRatings.service) +
      parseFloat(averageRatings.cleaning) +
      parseFloat(averageRatings.atmosphere) +
      parseFloat(averageRatings.price)) / 4
  ).toFixed(1) : null;

  const faceIcons = [
    { icon: faLaugh, minScore: 4.5 },
    { icon: faSmile, minScore: 3.5 },
    { icon: faMeh, minScore: 2.5 },
    { icon: faFrown, minScore: 0 },
  ];

  const selectedFaceIcon = faceIcons.find((face) => overallRating >= face.minScore);

  const sortedComments = approvedComments
    .filter((comment) => comment?.restaurant?._id === restaurantId)
    .filter((comment) => (filterRating === 0 ? true : comment.rating === filterRating))
    .sort((a, b) => (currentSortOrder === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)));

  const rootComments = sortedComments.filter(comment => !comment.parentComment);
  const replies = sortedComments.filter(comment => comment.parentComment);

  const scrollToCommentForm = () => {
    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedComments = rootComments.slice(0, visibleComments);

  const renderReplies = (parentId) => {
    const childReplies = replies.filter(reply => reply.parentComment === parentId);
  
    if (childReplies.length === 0) {
      return null;
    }

    return (
      <div className='ml-6 pl-4 border-l-2 border-gray-200'>
        {childReplies.map((reply) => (
        <div key={reply._id} className='mb-2'>
          <h4 className='text-sm font-semibold'>{reply.name}</h4>
          <p className='text-xs text-gray-500'>{formatDate(reply.createdAt)}</p>
          <p className='text-sm'>{reply.comment}</p>
          <button
            onClick={() => setReplyToCommentId(reply._id)}
            className='text-[#e14b00] text-xs'>
            Yanıtla
          </button>

          {replyToCommentId === reply._id && (
            <form onSubmit={handleReplySubmit} className="mt-2">
              <div className='flex flex-col mb-2'>
                <label>Adınız:</label>
                <input
                  type="text"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className='border border-gray-300 rounded-lg p-2 w-full'
                  placeholder='Adınızı girin'
                />
              </div>
              <div className='flex flex-col mb-2'>
                <label>Yanıtınız:</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className='border border-gray-300 rounded-lg p-2 w-full resize-none'
                  placeholder='Yanıtınızı yazın'
                ></textarea>
              </div>
              <button type="submit" className='bg-[#e14b00] text-white p-2 rounded-lg'>
                Gönder
              </button>
            </form>
          )}

            {renderReplies(reply._id)}
          </div>
        ))}
      </div>
    );
  };

  const renderComment = (comment) => (
    <div key={comment._id} className='mb-6 p-4'>
      <div className='flex justify-between mb-8'>
        <div>
          <h3 className='font-semibold'>{comment.name}</h3>
          <p className='text-gray-600 text-xs'>{formatDate(comment.createdAt)}</p>
        </div>
        <button
          onClick={() => setReplyToCommentId(comment._id)}
          className='p-2 bg-[#e14b00] rounded-lg w-28 text-white'>
          Yanıtla
        </button>
      </div>
      <p className='text-md'>{comment.comment}</p>
  
      {replies.filter((reply) => reply.parentComment === comment._id).length > 0 && (
        <button
          onClick={() => toggleReplies(comment._id)}
          className='mt-2 text-[#e14b00] text-sm'>
          {showReplies[comment._id] ? 'Yanıtları Gizle' : 'Yanıtları Gör'}
        </button>
      )}
  
      {showReplies[comment._id] && renderReplies(comment._id)}
  
      {replyToCommentId === comment._id && (
        <form onSubmit={handleReplySubmit} className="mt-4">
          <div className='flex flex-col mb-2'>
            <label>Adınız:</label>
            <input
              type="text"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              className='border border-gray-300 rounded-lg p-2 w-full'
              placeholder='Adınızı girin'
            />
          </div>
          <div className='flex flex-col mb-2'>
            <label>Yanıtınız:</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className='border border-gray-300 rounded-lg p-2 w-full resize-none'
              placeholder='Yanıtınızı yazın'
            ></textarea>
          </div>
          <button type="submit" className='bg-[#e14b00] text-white p-2 rounded-lg'>
            Gönder
          </button>
        </form>
      )}
    </div>
  );

  const Breadcrumb = () => (
    <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 text-md font-medium py-4">
      <Link to="/" className="text-white hover:underline">Ana Sayfa</Link>
      <span className="mx-2 text-white">{">"}</span>
      <Link to="/recommendations" className="text-white hover:underline">Tavsiyeler</Link>
      <span className="mx-2 text-white">{">"}</span>
      <span className="text-white">{restaurant ? restaurant.name : "Restoran Detayları"}</span>
    </nav>
  );

  return (
    <div className='relative overflow-x-hidden'>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <img src={loadingGif} alt="Loading..." className="w-4/6 min-h-72 object-cover" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : (
        restaurant && (
          <div>
            {/* Slider Bölümü */}
            <div className="relative w-full">
              <Breadcrumb />
              <Slider {...settings}>
                {restaurant.images && restaurant.images.length > 0 && restaurant.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`http://localhost:5001/${image}`}
                      alt={restaurant.name}
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Ana İçerik */}
            <div className='container mx-auto px-4'>
              <div className='flex flex-col lg:flex-row justify-between p-2 items-start lg:items-center'>
                <h2 className='mb-4 lg:mb-0 text-base md:text-lg lg:text-xl'>
                  <FontAwesomeIcon icon={faLocationDot} className='text-lg md:text-xl' /> {restaurant.address}, {restaurant.city} | {restaurant.category ? restaurant.category.name : 'Kategori Yok'}
                </h2>
                <h2 onClick={scrollToCommentForm} className='cursor-pointer z-10 text-base md:text-lg lg:text-xl'>
                  <FontAwesomeIcon icon={faCommentDots} className='text-lg md:text-xl'/> Yorum Yap
                </h2>
              </div>

              <div className='pl-2 mt-12'>
                <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>{restaurant.name}</h2>
                <div className='mt-4'>
                  <div className='mt-8 text-sm md:text-base' dangerouslySetInnerHTML={{ __html: restaurant.description }} />
                </div>
              </div>

              <div className='mt-8 pl-2'>
                <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Adres ve İletişim Bilgileri</h2>
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-12 p-3 pl-0 mt-5'>
                  <h2 className='font-semibold'>Adres</h2>
                  <h2>:{restaurant.address}</h2>
                </div>
                <hr />
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-10 p-3 pl-0 '>
                  <h2 className='font-semibold'>Telefon</h2>
                  <h2>+{restaurant.phoneNumber}</h2>
                </div>
                <hr />
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-10 p-3 pl-0'>
                  <h2 className='font-semibold'>Website</h2>
                  <h2>{restaurant.website}</h2>
                </div>
                <hr />
                <div className='flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6 p-3 pl-0'>
                  <h2 className='font-semibold'>Instagram</h2>
                  <h2>www.instagram.com</h2>
                </div>
                <hr />
                <div className='pt-4'>
                  <h2 className='font-semibold'><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />Konum:</h2>
                  {restaurant.location && (
                    <div className="mt-2 mb-8">
                      <iframe
                        title="Google Maps Location"
                        width="100%"
                        height="400"
                        loading="lazy"
                        allowFullScreen
                        src={googleMapEmbedUrl}
                        className="rounded-lg shadow-lg"
                      ></iframe>
                    </div>
                  )}
                </div>
                <hr />
                <h2 className='pt-8 font-semibold'># {restaurant.category ? restaurant.category.name : 'Kategori Yok'}</h2>
              </div>

              <div className='pt-8 pb-24'>
                <h2 className='text-xl md:text-2xl font-semibold text-gray-800'>Puanlama</h2>
                <div className='flex flex-col lg:flex-row items-center'>
                  <div className='w-full lg:w-1/2 pr-4'>
                    {averageRatings && (
                      <div className="pt-12">
                        {[
                          { category: 'Hizmet', value: averageRatings.service },
                          { category: 'Temizlik', value: averageRatings.cleaning },
                          { category: 'Atmosfer', value: averageRatings.atmosphere },
                          { category: 'Fiyat', value: averageRatings.price },
                        ].map(({ category, value }, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <span className="text-gray-700 text-sm md:text-base w-24">{category}</span>
                            <div className="flex ml-2">
                              {[...Array(5)].map((_, starIndex) => (
                                <FontAwesomeIcon
                                  key={starIndex}
                                  icon={faStar}
                                  className={starIndex < Math.round(value) ? 'text-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className='hidden lg:block border-l-2 border-gray-200 h-32 mx-6'></div>

                  <div className='flex flex-col items-center w-full lg:w-1/2 pl-4'>
                    <div className='flex space-x-4 mb-4'>
                      {faceIcons.map(({ icon, minScore }, index) => (
                        <FontAwesomeIcon
                          key={index}
                          icon={icon}
                          className={`text-4xl md:text-6xl ${selectedFaceIcon.icon === icon ? 'text-black-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <h2 className='text-3xl md:text-6xl'>{(overallRating * 20).toFixed(0)}%</h2>
                  </div>
                </div>
              </div>

              <hr />

              <div className='mt-24'>
                <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
                  <h2 className='text-xl md:text-2xl font-semibold'>
                    {sortedComments.length > 0 ? `${sortedComments.length} Yorum:` : 'Yorumlar:'}
                  </h2>
                  <select
                    value={currentSortOrder}
                    onChange={handleSortChange}
                    className='border border-gray-300 rounded-lg p-2 mt-2 sm:mt-0'
                  >
                    <option value="newest">En Yeni</option>
                    <option value="oldest">En Eski</option>
                  </select>
                </div>
                
                <div className='mt-6 mb-24'>
                  {displayedComments.length > 0 ? (
                    displayedComments.map((comment) => renderComment(comment))
                  ) : (
                    <p>Henüz yorum yok.</p>
                  )}

                  {visibleComments < rootComments.length && (
                    <button
                      onClick={handleLoadMoreComments}
                      className='bg-[#e14b00] text-white p-2 rounded-lg mt-4 mx-auto flex justify-center'
                    >
                      Daha Fazla Yorum Yükle
                    </button>
                  )}
                </div>
              </div>

              <hr />

              <div className='mt-24' ref={commentFormRef}>
                <h2 className='text-xl md:text-2xl font-semibold mb-12'>Deneyiminizi Benimle ve Ziyaretçilerle Paylaşın</h2>
                <form onSubmit={handleSubmit}>
                  <div className='flex flex-wrap md:flex-nowrap justify-between mb-4 gap-4'>
                    <div className='w-full lg:w-1/2'>
                      <label>Adı Soyadı</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        placeholder='Adınız Soyadınız'
                      />
                    </div>
                    <div className='w-full lg:w-1/2'>
                      <label>Telefon Numarası</label>
                      <PhoneInput
                        country={'tr'}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        inputClass='border border-gray-300 rounded-lg w-full p-6 focus:outline-none focus:ring-2 focus:ring-orange-500'
                        inputStyle={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className='flex flex-wrap md:flex-nowrap justify-between mb-4 gap-4'>
                    <div className='w-full lg:w-1/2'>
                      <label>E-Posta Adresi</label>
                      <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        placeholder='E-Posta Adresiniz'
                      />
                    </div>
                    <div className='w-full lg:w-1/2'>
                      <label>Adres</label>
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500' 
                        placeholder='Adresiniz'
                      />
                    </div>
                  </div>

                  <div>
                    <label>Mesaj</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className='resize-none border border-gray-300 rounded-lg h-32 p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500' 
                      placeholder='Mesajınız'
                    ></textarea>
                  </div>

                  <div>
                    <button type="submit" className='bg-[#e14b00] hover:bg-[#d13b00] text-white p-4 rounded-lg w-full lg:w-6/12 mt-8 mb-24 font-semibold transition duration-300'>
                      Gönder
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )
      )}

      <UpButton className="fixed bottom-4 right-4 z-50" />
    </div>
  );
};

export default RestaurantScreen;
