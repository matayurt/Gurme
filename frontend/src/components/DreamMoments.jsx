import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Statue from '../assets/statue.png';
import Cami from '../assets/cami.png';
import Işık from '../assets/ışık.png';
import Statue2 from '../assets/statue2.png';

Modal.setAppElement('#root');

const DreamMoments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="">
      <h2 className="text-center text-2xl font-bold mb-4 mt-16">Eşsiz Anılar</h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <button onClick={() => openModal(Statue)} className="relative flex-none w-full md:w-[20%] h-48 md:h-[500px] group">
          <img src={Statue} alt="Statue" className="object-cover w-full h-full transition duration-300 group-hover:opacity-75" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <FontAwesomeIcon icon={faEye} size="2x" className="text-white" />
          </div>
        </button>

        <div className="flex flex-col justify-between w-full md:w-[25%] gap-4">
          <button onClick={() => openModal(Cami)} className="relative w-full h-24 md:h-[240px] group">
            <img src={Cami} alt="Cami" className="w-full h-full object-cover transition duration-300 group-hover:opacity-75" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <FontAwesomeIcon icon={faEye} size="2x" className="text-white" />
            </div>
          </button>
          <button onClick={() => openModal(Işık)} className="relative w-full h-24 md:h-[240px] group">
            <img src={Işık} alt="Işık" className="w-full h-full object-cover transition duration-300 group-hover:opacity-75" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <FontAwesomeIcon icon={faEye} size="2x" className="text-white" />
            </div>
          </button>
        </div>

        <button onClick={() => openModal(Statue2)} className="relative flex-none w-full md:w-[55%] h-48 md:h-[500px] group">
          <img src={Statue2} alt="Statue2" className="object-cover w-full h-full transition duration-300 group-hover:opacity-75" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <FontAwesomeIcon icon={faEye} size="2x" className="text-white" />
          </div>
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="relative w-[90%] max-w-[800px] max-h-[80%] bg-white rounded-lg shadow-lg overflow-hidden outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedImage && (
          <div className="relative">
            <button onClick={closeModal} className="absolute right-2 text-red-700 text-4xl">
              &times;
            </button>
            <img src={selectedImage} alt="Selected" className="w-full h-full object-contain" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DreamMoments;
