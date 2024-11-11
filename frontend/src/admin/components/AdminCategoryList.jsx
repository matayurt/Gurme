import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../actions/categoryActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UpButton from './AdminUpButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faChevronDown, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCategoryList = ({ darkMode }) => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [addingSubCategoryId, setAddingSubCategoryId] = useState(null);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const addCategoryHandler = () => {
    dispatch(addCategory({ name: newCategoryName }))
      .then(() => dispatch(getCategories()));
    setNewCategoryName('');
  };

  const addSubCategoryHandler = (parentId) => {
    dispatch(addCategory({ name: newSubCategoryName, parentId }))
      .then(() => dispatch(getCategories()));
    setNewSubCategoryName('');
    setAddingSubCategoryId(null);
  };

  const editCategoryHandler = (id) => {
    dispatch(updateCategory({ id, name: editCategoryName }))
      .then(() => dispatch(getCategories()));
    setEditingCategoryId(null);
    setEditCategoryName('');
  };

  const deleteCategoryHandler = (id) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="text-lg font-semibold mb-4">Bu kategoriyi silmek istediğinize emin misiniz?</p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => confirmDeletion(id, closeToast)}
            >
              Evet
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeToast}
            >
              Hayır
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        className: `${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg shadow-lg p-5 border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`,
      }
    );
  };

  const confirmDeletion = (id, closeToast) => {
    dispatch(deleteCategory(id))
      .then(() => {
        toast.success('Kategori başarıyla silindi!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(getCategories());
      })
      .catch(() => {
        toast.error('Kategori silinemedi. Lütfen tekrar deneyin.', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

    closeToast();
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId || destination.index !== source.index) {
      const draggedCategory = categories.find(category => category._id === draggableId);
      dispatch(updateCategory({
        id: draggableId,
        name: draggedCategory.name,
        parentId: destination.droppableId !== 'root' ? destination.droppableId : null
      })).then(() => dispatch(getCategories()));
    }
  };

  const renderCategoryList = (parentId = null, depth = 0) => {
    const indent = depth * 20;
    const colors = ['border-red-200', 'border-blue-200', 'border-green-200', 'border-purple-200'];
    const borderColor = colors[depth % colors.length];

    return (
      <Droppable droppableId={parentId || 'root'}>
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {categories
              .filter(category => category.parentId === parentId)
              .map((category, index) => {
                const hasSubCategories = categories.some(cat => cat.parentId === category._id);

                return (
                  <Draggable key={category._id} draggableId={category._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-lg shadow-md flex flex-col space-y-2 border ${borderColor} ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}
                        style={{ marginLeft: `${indent}px` }}
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => hasSubCategories && toggleCategoryExpansion(category._id)}
                        >
                          <div className="flex items-center space-x-2">
                            {hasSubCategories && (
                              <button
                                className={`text-gray-600 hover:text-gray-900 transition duration-300 ${darkMode ? 'text-gray-300' : ''}`}
                              >
                                <FontAwesomeIcon
                                  icon={expandedCategories[category._id] ? faChevronDown : faChevronRight}
                                />
                              </button>
                            )}
                            <span className="text-lg font-medium">{category.name}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategoryId(category._id);
                                setEditCategoryName(category.name);
                              }}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 transition duration-300"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCategoryHandler(category._id);
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-300"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddingSubCategoryId(category._id);
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition duration-300"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </div>
                        {editingCategoryId === category._id && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className={`border rounded w-full py-2 px-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'focus:ring-2 focus:ring-red-500'}`}
                            />
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => editCategoryHandler(category._id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-300"
                              >
                                Kaydet
                              </button>
                              <button
                                onClick={() => setEditingCategoryId(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-300"
                              >
                                İptal
                              </button>
                            </div>
                          </div>
                        )}
                        {addingSubCategoryId === category._id && (
                          <div className="mt-2 pl-4">
                            <input
                              type="text"
                              placeholder="Alt kategori adı"
                              value={newSubCategoryName}
                              onChange={(e) => setNewSubCategoryName(e.target.value)}
                              className={`border rounded w-full py-2 px-3 focus:outline-none ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'focus:ring-2 focus:ring-red-500'}`}
                            />
                            <div className="mt-2 flex space-x-2">
                              <button
                                onClick={() => addSubCategoryHandler(category._id)}
                                className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                              >
                                Alt Kategori Ekle
                              </button>
                              <button onClick={() => setAddingSubCategoryId(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-300"
                              >
                                İptal
                              </button>
                            </div>
                          </div>
                        )}
                        {expandedCategories[category._id] && (
                          <ul className="pl-6 space-y-2">
                            {renderCategoryList(category._id, depth + 1)}
                          </ul>
                        )}
                      </li>
                    )}
                  </Draggable>
                );
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
        <h2 className="text-2xl font-semibold flex items-center justify-center">Kategori Yönetimi</h2>
      </div>
      <div className="container mx-auto p-6">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <div className="mb-6 flex items-center space-x-4">
              <input
                type="text"
                placeholder="Yeni kategori adı"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={`border rounded-lg w-full py-2 px-3 focus:ring focus:border-[#F2115E] focus:outline-none transition duration-300 ${darkMode ? 'bg-gray-600 text-white border-gray-700' : 'border-gray-300'}`}
              />
              <button
                onClick={addCategoryHandler}
                className="bg-[#F2115E] text-white px-4 py-2 rounded hover:bg-[#e0004a] transition duration-300"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <UpButton />
            </div>
            {renderCategoryList()}
          </div>
        )}
      </div>
      <ToastContainer />
    </DragDropContext>
  );
};

export default AdminCategoryList;
