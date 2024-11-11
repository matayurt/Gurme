import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../actions/categoryActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UpButton from '../../components/UpButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faArrowTrendDown, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';


const AdminHomeCategoryList = () => {
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
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      dispatch(deleteCategory(id))
        .then(() => dispatch(getCategories()));
    }
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
    const colors = ['border-red-200', 'border-blue-200', 'border-green-200', 'border-purple-200'];
    const borderColor = colors[depth % colors.length];

    return (
      <Droppable droppableId={parentId || 'root'}>
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
            {categories
              .filter(category => category.parentId === parentId).slice(0, 4)
              .map((category, index) => {
                const hasSubCategories = categories.some(cat => cat.parentId === category._id);

                return (
                  <Draggable key={category._id} draggableId={category._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2 border ${borderColor}`}
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => hasSubCategories && toggleCategoryExpansion(category._id)}
                        >
                          <div className="flex items-center space-x-2">
                            {hasSubCategories && (
                              <button
                                className="text-gray-600 hover:text-gray-900 transition duration-300"
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
                              <FontAwesomeIcon icon={faArrowTrendDown} />
                            </button>
                          </div>
                        </div>
                        {editingCategoryId === category._id && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                              onClick={() => editCategoryHandler(category._id)}
                              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded hover:bg-blue-500 transition duration-300"
                            >
                              Kaydet
                            </button>
                            <button
                              onClick={() => setEditingCategoryId(null)}
                              className="bg-gray-600 text-white px-4 py-2 mt-2 rounded hover:bg-gray-500 transition duration-300"
                            >
                              İptal
                            </button>
                          </div>
                        )}
                        {addingSubCategoryId === category._id && (
                          <div className="mt-2 pl-4">
                            <input
                              type="text"
                              placeholder="Alt kategori adı"
                              value={newSubCategoryName}
                              onChange={(e) => setNewSubCategoryName(e.target.value)}
                              className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button
                              onClick={() => addSubCategoryHandler(category._id)}
                              className="bg-red-800 text-white px-4 py-2 mt-2 rounded hover:bg-red-700 transition duration-300"
                            >
                              Alt Kategori Ekle
                            </button>
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
                className="border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring focus:ring-[#F2115E] focus:border-[#F2115E] focus:outline-none transition duration-300"
              />
              <button
                onClick={addCategoryHandler}
                className="bg-[#F2115E] text-white px-4 py-2 rounded hover:bg-[#e0004a] transition duration-300"
              >
                Ekle
              </button>
            </div>
            {renderCategoryList()}
          </div>
        )}
        <UpButton />
      </div>
    </DragDropContext>
  )
}

export default AdminHomeCategoryList;