import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { fetchQuestions, addQuestion, deleteQuestion, updateQuestionOrder } from "../../actions/questionActions.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminQuestions = ({ darkMode }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const dispatch = useDispatch();

  const { loading, error, questions } = useSelector((state) => state.questionList);
  const { success: successAdd, success: successDelete } = useSelector((state) => ({
    successAdd: state.questionAdd.success,
    successDelete: state.questionDelete.success,
  }));

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch, successAdd, successDelete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addQuestion({ question, answer, isActive }));
    setQuestion("");
    setAnswer("");
    setIsActive(true);
    toast.success('Soru başarıyla eklendi!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: () => {
        window.location.reload();
      },
    });
  };

  const handleToggleAnswer = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Bu soruyu silmek istediğinizden emin misiniz?")) {
      dispatch(deleteQuestion(id));
      toast.success('Soru başarıyla silindi!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          window.location.reload();
        },
      });
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    dispatch(updateQuestionOrder(reorderedQuestions));
    toast.info('Soru sırası güncellendi!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: () => {
        window.location.reload();
      },
    });
  };

  return (
    <div className={`max-w-full p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div className="flex-1 p-2">
          <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Soru:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'
            }`}
            placeholder="Soruyu Girin"
          />
        </div>

        <div className="flex-1 p-2">
          <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Cevap:</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'
            }`}
            placeholder="Cevabı Girin"
          />
        </div>

        <div className="flex-1 p-2">
          <label className={`block font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Durum:</label>
          <select
            value={isActive ? "Active" : "Inactive"}
            onChange={(e) => setIsActive(e.target.value === "Active")}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F2115E] ${
              darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300'
            }`}
          >
            <option value="Active">Aktif</option>
            <option value="Inactive">Pasif</option>
          </select>
        </div>

        <div className="flex-shrink-0 p-2">
          <button
            type="submit"
            className={`w-24 py-2 px-4 mt-8 rounded-md transition duration-300 ${
              darkMode ? 'bg-[#e0004a] text-white hover:bg-[#c9003e]' : 'bg-[#F2115E] text-white hover:bg-[#e0004a]'
            }`}
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className={darkMode ? 'text-white' : 'text-black'}>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {questions.map((q, index) => (
                    <Draggable key={q._id} draggableId={q._id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`border-b py-4 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className={`text-lg font-semibold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {q.question} -{" "}
                              <span className="ml-2 flex items-center">
                                {q.isActive ? (
                                  <span className="flex items-center text-green-600">
                                    Aktif
                                    <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                  </span>
                                ) : (
                                  <span className="flex items-center text-red-600">
                                    Pasif
                                    <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                  </span>
                                )}
                              </span>
                            </h3>
                            <div className="flex items-center space-x-4">
                              <button onClick={() => handleToggleAnswer(q._id)} className="text-[#e14b00] focus:outline-none">
                                <FontAwesomeIcon icon={expandedQuestionId === q._id ? faMinus : faPlus} />
                              </button>
                              <Link to={`/admin/questions/edit/${q._id}`} className="text-blue-600 focus:outline-none">
                                <FontAwesomeIcon icon={faEdit} />
                              </Link>
                              <button onClick={() => handleDeleteQuestion(q._id)} className="text-red-600 focus:outline-none">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          {expandedQuestionId === q._id && <p className={`mt-2 ${darkMode ? 'text-white' : 'text-gray-600'}`}>{q.answer}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
