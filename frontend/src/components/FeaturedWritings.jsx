import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMostClickedWritings, incrementClickCount } from '../actions/writingActions';
import loadingGif from '../assets/loading.gif';
import { Link } from 'react-router-dom';

const FeaturedWritings = () => {
  const dispatch = useDispatch();
  const scrollContainer = useRef(null);

  const writingList = useSelector((state) => state.writingList);
  const { writings, loading, error } = writingList;

  useEffect(() => {
    dispatch(listMostClickedWritings());
  }, [dispatch]);

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

  return (
    <div className="pl-4 pt-4 mt-16 ml-12 md:ml-60 lg:ml-72 xl:ml-80 mb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-4">İdealler, Deneyimler, Keşifler</h1>
      <h2 className="text-2xl text-gray-800 mb-6 ml-4">Öne Çıkan Yazılar</h2>

      <div
        ref={scrollContainer}
        className="flex overflow-x-auto space-x-4 scrollbar-hide pl-4 cursor-grab"
      >
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <img src={loadingGif} alt="Loading..." className="w-8/12 h-8/12" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          writings.map((writing) => (
            <div key={writing._id} className="flex-shrink-0 w-64 bg-[#f1eeec] p-4 shadow-md">
              {/* Image Section */}
              <img
                src={`http://localhost:5001/${writing.coverImage}`}
                alt={writing.title}
                className="w-64 h-40 mb-4 object-cover"
                draggable="false"
              />

              <div>
                <p className="text-gray-500 text-sm mb-2">
                  {new Date(writing.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-10">{writing.title}</h2>
                <Link
                  to={`/writings/${writing._id}`}
                  className="text-[#e14b00]"
                  onClick={() => dispatch(incrementClickCount(writing._id))}
                >
                  Daha Fazla &gt;&gt;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeaturedWritings;
