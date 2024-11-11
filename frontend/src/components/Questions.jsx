import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { fetchQuestions } from '../actions/questionActions.js';

const Questions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, questions } = useSelector((state) => state.questionList);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleToggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className='flex flex-col justify-center items-center pt-24 px-4 mb-24'>
      <div className='flex flex-col lg:flex-row items-center w-full lg:w-3/4 xl:w-2/3'>
        <div className='px-4 mb-8 lg:mb-0'>
          <h1 className='font-semibold text-2xl md:text-3xl lg:text-4xl mb-4 lg:mb-8 mt-8 lg:mt-12 text-center lg:text-left'>
            Gastronomi Hakkında<br />Sık Sorulan Sorular
          </h1>
        </div>
        <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl px-4'>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder='Kelime aratabilirsiniz'
              className='w-full p-4 text-base md:text-lg rounded-lg shadow-md focus:outline-none focus:shadow-lg transition duration-300 pr-12'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className='flex justify-center items-center'>
            <div className='w-full max-w-md'>
              {loading ? (
                <p>Yükleniyor...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                questions
                  .filter(q => q.isActive && q.question.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((q) => (
                    <div key={q._id} className="py-4">
                      <div
                        className="flex justify-between items-start cursor-pointer transition-all duration-300"
                        onClick={() => handleToggleQuestion(q._id)}
                      >
                        <h2 className='text-md md:text-lg font-semibold text-gray-600'>{q.question}</h2>
                        <FontAwesomeIcon
                          icon={expandedQuestion === q._id ? faMinus : faPlus}
                          className={`ml-2 ${expandedQuestion === q._id ? '' : 'text-[#e14b00]'} self-start`}
                        />
                      </div>
                      <div
                        className={`overflow-hidden transition-max-height duration-500 ease-in-out ${expandedQuestion === q._id ? 'max-h-[200px]' : 'max-h-0'}`}
                      >
                        <p className='mt-2 text-sm md:text-base text-gray-400'>{q.answer}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
