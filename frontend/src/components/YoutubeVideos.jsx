import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { fetchVideos } from '../actions/videoActions.js';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const YoutubeVideos = () => {
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { videos = [], loading, error } = useSelector((state) => state.videoList);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const scroll = (direction) => {
    const container = sliderRef.current;
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedVideo(null);
  };

  if (!loading && videos.length === 0) {
    return null;
  }

  return (
    <div className='pl-4 pt-4 mt-16 ml-2 md:ml-60 lg:ml-72 xl:ml-80'>
      <div>
        {/* Başlık Bölümü */}
        <div className='flex items-center mb-6'>
          <h2 className='text-2xl'>Videolarım</h2>
          <hr className='w-2/3 border-t-1 border-gray-300 ml-4 mr-4' />
          {/* Kaydırma düğmeleri */}
          <button onClick={() => scroll('left')} className='border border-gray-300 px-3 py-1 rounded-s-md text-gray-400'>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button onClick={() => scroll('right')} className='border border-gray-300 px-3 py-1 rounded-e-md mr-2 text-gray-400'>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>

        {/* Video Kartları Bölümü */}
        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div ref={sliderRef} className='flex overflow-x-auto space-x-4 scrollbar-hide p-2' style={{ cursor: 'grab' }}>
            {videos.map((video) => (
              <div
                key={video._id}
                className='flex-none w-64 relative group cursor-pointer'
                onClick={() => openModal(video.url)}
              >
                {/* Hover efektli küçük resim */}
                <div className='relative'>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className='w-64 h-32 rounded-t-lg object-cover rounded-lg group-hover:opacity-70 transition-opacity duration-300'
                  />
                  <FontAwesomeIcon
                    icon={faYoutube}
                    size='3x'
                    className='absolute text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className='pt-3 px-2'>
                  <h2 className='font-semibold text-lg'>{video.title}</h2>
                  <p className='text-sm text-gray-600 mt-1 flex items-center'>
                    <span>{new Date(video.publishedAt).getFullYear()}</span>
                    <span className='mx-2 w-2 h-2 bg-gray-500 rounded-full'></span>
                    <span>{video.location}</span>
                  </p>
                  <div className='flex justify-between items-center mt-2'>
                    <p className='text-sm text-red-600'>
                      {new Date(video.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </p>
                    {/* Sağ alt köşede YouTube ikonu */}
                    <FontAwesomeIcon icon={faYoutube} size='2x' className='text-black-600' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Video Modal"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        shouldCloseOnOverlayClick={true}
      >
        <div className="relative p-8 rounded-lg shadow-xl w-full max-w-5xl">
          {/* Kapatma İkonu */}
          <button
            onClick={closeModal}
            className="absolute -top-2 -right-6 text-red-600 hover:text-red-800 z-50"
            style={{ padding: '8px' }}
          >
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </button>
          {selectedVideo && (
            <iframe
              width="100%"
              height="700"
              src={`https://www.youtube.com/embed/${selectedVideo.split('v=')[1]}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default YoutubeVideos;
