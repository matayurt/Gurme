import React, { useState } from 'react';

const CategoryTreeSelect = ({ categories, selectedCategory, onSelectCategory }) => {
  const renderCategoryTree = (categoryList, level = 0) => {
    return categoryList.map((category) => (
      <div key={category._id} style={{ marginLeft: level * 20 }} className="m-1">
        <div 
          onClick={() => onSelectCategory(category._id)}
          className={`cursor-pointer p-2 border rounded ${selectedCategory === category._id ? 'bg-[#F2115E] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          {category.name}
        </div>
        {category.children && renderCategoryTree(category.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="border p-4 rounded max-h-64 overflow-y-auto bg-white">
      {renderCategoryTree(categories)}
    </div>
  );
};

export default CategoryTreeSelect;
