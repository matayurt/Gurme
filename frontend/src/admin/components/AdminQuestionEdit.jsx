import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions, editQuestion } from '../../actions/questionActions.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminQuestionEdit = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { questions } = useSelector((state) => state.questionList);
  const { success: successEdit, error: errorEdit } = useSelector((state) => state.questionEdit);

  useEffect(() => {
    if (questions.length === 0) {
      dispatch(fetchQuestions());
    } else {
      const questionToEdit = questions.find((q) => q._id === id);
      if (questionToEdit) {
        setQuestion(questionToEdit.question);
        setAnswer(questionToEdit.answer);
        setIsActive(questionToEdit.isActive);
      }
    }
  }, [dispatch, id, questions]);

  useEffect(() => {
    if (successEdit) {
      toast.success('Soru başarıyla güncellendi!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          navigate('/admin/questions');
          window.location.reload();
        },
      });
    } else if (errorEdit) {
      toast.error('Güncellerken bir sorun oluştu! Tekrar deneyin.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [successEdit, errorEdit, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editQuestion(id, { question, answer, isActive }));
  };

  const handleBack = () => {
    navigate('/admin/questions');
  };

  return (
    <div className={`max-w-4xl mx-auto mt-8 p-6 rounded-lg shadow-lg relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <button
        type="button"
        onClick={handleBack}
        className={`absolute top-4 left-4 py-2 px-6 rounded-md hover:opacity-80 transition duration-300 ${darkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>

      <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Soruyu Düzenle</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-8">
        <div>
          <div className="flex-1">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Soru:</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
              placeholder="Soruyu Düzenle"
            />
          </div>

          <div className="flex-shrink-0 w-64 mt-4">
            <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Durum:</label>
            <select
              value={isActive ? 'Active' : 'Inactive'}
              onChange={(e) => setIsActive(e.target.value === 'Active')}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
            >
              <option value="Active">Aktif</option>
              <option value="Inactive">Pasif</option>
            </select>
          </div>
        </div>

        <div className="flex-1">
          <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Cevap:</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows="4"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] resize-none ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'border-gray-300'}`}
            placeholder="Cevabı Düzenle"
          />
        </div>

        <div className="flex-shrink-0 w-full">
          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-md hover:bg-opacity-80 transition duration-300 mt-4 ${darkMode ? 'bg-[#F2115E] text-white hover:bg-[#e0004a]' : 'bg-[#F2115E] text-white hover:bg-[#e0004a]'}`}
          >
            Güncelle
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AdminQuestionEdit;
