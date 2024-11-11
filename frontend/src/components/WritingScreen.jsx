import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { listWritings } from '../actions/writingActions.js';
import loadingGif from '../assets/loading.gif';

const WritingScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const writingList = useSelector((state) => state.writingList);
  const { writings, loading, error } = writingList;

  useEffect(() => {
    dispatch(listWritings());
  }, [dispatch]);

  const writing = writings.find((writing) => writing._id === id);

  const headerImageUrl = writing && writing.headerImage ? `http://localhost:5001/${writing.headerImage}` : '';

  return (
    <div className='mb-36'>
      {writing && writing.headerImage && (
        <div className="relative w-full h-96">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${headerImageUrl})`,
              opacity: 0.5,
              zIndex: -1, // Position it behind the text
            }}
          ></div>

          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Breadcrumb */}
            <div className="absolute top-0 left-0 w-full text-center text-black py-2">
              <Link to="/" className="hover:underline text-black">
                Anasayfa
              </Link>
              {' > '}
              <Link to="/mywritings" className="hover:underline text-black">
                Yazılarım
              </Link>
              {' > '}
              <span className="text-black">{writing.title}</span>
            </div>

            <div className="flex flex-col items-center justify-end flex-grow">
              <h2 className="text-[#e14b00] text-lg uppercase mb-2">Yazılarım</h2>
              <h1 className="text-black text-4xl font-bold">{writing.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 mt-12 bg-white">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <img src={loadingGif} alt="Loading..." className="w-8/12 h-8/12" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : writing ? (
          <div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: writing.content }}></div>
          </div>
        ) : (
          <p>Yazı bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default WritingScreen;
