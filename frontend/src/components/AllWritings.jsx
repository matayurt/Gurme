import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listWritings, incrementClickCount } from '../actions/writingActions';
import { Link } from 'react-router-dom';
import loadingGif from '../assets/loading.gif';

const AllWritings = () => {
  const dispatch = useDispatch();

  const writingList = useSelector((state) => state.writingList);
  const { writings, loading, error } = writingList;

  useEffect(() => {
    dispatch(listWritings());
  }, [dispatch]);

  return (
    <div className="flex justify-center mx-auto p-4">
      <div>
        <h2 className='text-4xl font-semibold text-center align-center mb-12'>Tüm Yazılar</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <img src={loadingGif} alt="Loading..." className="w-8/12 h-8/12" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            writings.map((writing) => (
              <div key={writing._id} className="flex-shrink-0 w-64 bg-[#f1eeec] p-4 shadow-md">
                <img
                  src={`http://localhost:5001/${writing.coverImage}`}
                  alt={writing.title}
                  className="w-64 h-40 mb-4 object-cover"
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
                    className="text-[#e14b00] hover:underline"
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
    </div>
  );
};

export default AllWritings;
