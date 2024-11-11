import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaQuestionCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ isOpen, onClose, children, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`p-6 rounded-lg shadow-lg max-w-md w-full relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className="absolute top-1 right-3 text-gray-600 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const AdminMail = ({ darkMode }) => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [activeEmails, setActiveEmails] = useState([]);

  const [adminEmail, setAdminEmail] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminApi, setNewAdminApi] = useState('');
  const [isApiVisible, setIsApiVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/emails');
        setEmails(data);
        const activeEmails = data.filter(email => email.isActive).map(email => email.email);
        setActiveEmails(activeEmails);
      } catch (error) {
        console.error('Error fetching emails:', error);
        toast.error('Mailleri getirirken bir hata oluştu.', {
          autoClose: 1000,
        });
      }
    };

    const fetchAdminEmail = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/admin-emails');
        if (data.length > 0) {
          setAdminEmail(data[0]);
        }
      } catch (error) {
        console.error('Error fetching admin email:', error);
        toast.error('Admin maili getirirken bir hata oluştu.', {
          autoClose: 1000,
        });
      }
    };

    fetchEmails();
    fetchAdminEmail();
  }, []);

  const addEmail = async () => {
    if (newEmail && !emails.some(email => email.email === newEmail)) {
      try {
        const { data } = await axios.post('http://localhost:5001/api/emails', { email: newEmail });
        setEmails([...emails, data]);
        setNewEmail('');
        toast.success('Mail başarıyla eklendi!', {
          autoClose: 1000,
        });
      } catch (error) {
        console.error('Error adding email:', error);
        toast.error('Mail eklenirken bir hata oluştu.', {
          autoClose: 1000,
        });
      }
    } else {
      toast.warn('Bu email zaten mevcut veya geçerli bir email değil.', {
        autoClose: 1000,
      });
    }
  };

  const removeEmail = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/emails/${id}`);
      const updatedEmails = emails.filter(email => email._id !== id);
      setEmails(updatedEmails);
      setActiveEmails(updatedEmails.filter(email => email.isActive).map(email => email.email));
      toast.success('Mail başarıyla silindi!', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error removing email:', error);
      toast.error('Mail silinirken bir hata oluştu.', {
        autoClose: 1000,
      });
    }
  };

  const toggleEmailActivation = async (id) => {
    try {
      const emailToUpdate = emails.find(email => email._id === id);
      if (emailToUpdate) {
        const updatedEmail = { ...emailToUpdate, isActive: !emailToUpdate.isActive };
        const { data } = await axios.put(`http://localhost:5001/api/emails/${id}`, updatedEmail);

        const updatedEmails = emails.map(email => 
          email._id === id ? data : email
        );
        setEmails(updatedEmails);
        setActiveEmails(updatedEmails.filter(email => email.isActive).map(email => email.email));
        toast.success(`Mail başarıyla ${data.isActive ? 'aktif edildi!' : 'deaktif edildi!'}`, {
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error('Error toggling email activation:', error);
      toast.error('Mail durumu değiştirilirken bir hata oluştu.', {
        autoClose: 1000,
      });
    }
  };

  const addAdminEmail = async () => {
    if (newAdminEmail && newAdminApi && !adminEmail) {
      try {
        const { data } = await axios.post('http://localhost:5001/api/admin-emails', {
          email: newAdminEmail,
          api: newAdminApi
        });
        setAdminEmail(data);
        setNewAdminEmail('');
        setNewAdminApi('');
        toast.success('Admin mail başarıyla eklendi!', {
          autoClose: 1000,
        });
      } catch (error) {
        console.error('Error adding admin email:', error);
        toast.error('Admin mail eklenirken bir hata oluştu.', {
          autoClose: 1000,
        });
      }
    } else {
      toast.warn('Zaten bir admin maili mevcut veya geçerli bir email değil.', {
        autoClose: 1000,
      });
    }
  };

  const removeAdminEmail = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin-emails/${id}`);
      setAdminEmail(null);
      toast.success('Admin mail başarıyla silindi!', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Error removing admin email:', error);
      toast.error('Admin mail silinirken bir hata oluştu.', {
        autoClose: 1000,
      });
    }
  };

  return (
    <div className={`container mx-auto p-6 ${darkMode ? 'bg-gray-900' : ''}`}>
      <div className={`p-8 rounded-lg shadow-lg mb-8 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-3xl font-semibold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin E-Posta Yönetimi</h2>

        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Yeni gönderici mail adresi ekle"
              className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' : 'border-gray-300 focus:ring-blue-500'} w-80`}
            />
            <div className="relative">
              <input
                type="text"
                value={newAdminApi}
                onChange={(e) => setNewAdminApi(e.target.value)}
                placeholder="Uygulama Şifresi Ekle"
                className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' : 'border-gray-300 focus:ring-blue-500'} w-80`}
              />
              <FaQuestionCircle
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${darkMode ? 'text-white' : 'text-gray-500'}`}
                size={20}
                onClick={() => setIsModalOpen(true)}
              />
            </div>
            <button
              onClick={addAdminEmail}
              className={`font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-[#F2115E] hover:bg-[#e0004a] text-white'}`}
            >
              Ekle
            </button>
          </div>
        </div>

        {adminEmail && (
          <div className="mb-8">
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Eklenen Admin Mail:</h3>
            <ul className="space-y-4">
              <li
                key={adminEmail._id}
                className={`p-4 border rounded-lg shadow-sm flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <div>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{adminEmail.email}</span>
                  <p
                    className="text-sm relative"
                    onMouseEnter={() => setIsApiVisible(true)}
                    onMouseLeave={() => setIsApiVisible(false)}
                  >
                    Uygulama Şifresi: 
                    <span className={`ml-2 ${isApiVisible ? (darkMode ? 'text-gray-100' : 'text-black') : 'text-black-300'}`}>
                      {isApiVisible ? adminEmail.api : '********'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => removeAdminEmail(adminEmail._id)}
                  className={`px-5 py-2 rounded-lg font-semibold transition duration-300 ease-in-out ${darkMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                >
                  Sil
                </button>
              </li>
            </ul>
          </div>
        )}

        <h2 className={`text-3xl font-semibold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>Yorum Bildirim Maili Yönetimi</h2>
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Yeni mail adresi ekle"
              className={`p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' : 'border-gray-300 focus:ring-blue-500'} w-80`}
            />
            <button
              onClick={addEmail}
              className={`font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-[#F2115E] hover:bg-[#e0004a] text-white'}`}
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Eklenen Mailler:</h3>
          <ul className="space-y-4">
            {emails.map((email) => (
              <li
                key={email._id}
                className={`p-4 border rounded-lg shadow-sm flex justify-between items-center ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{email.email}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleEmailActivation(email._id)}
                    className={`px-5 py-2 rounded-lg font-semibold transition duration-300 ease-in-out ${
                      email.isActive ? (darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') : (darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600')
                    } text-white`}
                  >
                    {email.isActive ? 'Deaktif Et' : 'Aktif Et'}
                  </button>
                  <button
                    onClick={() => removeEmail(email._id)}
                    className={`px-5 py-2 rounded-lg font-semibold transition duration-300 ease-in-out ${darkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {activeEmails.length > 0 && (
          <div className={`p-4 rounded-lg text-center font-semibold ${darkMode ? 'bg-green-900 text-green-200 border-green-800' : 'bg-green-100 text-green-800 border-green-200'} border`}>
            <strong>Şu anda aktif mailler:</strong> {activeEmails.join(', ')}
          </div>
        )}
      </div>
      <ToastContainer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} darkMode={darkMode}>
        <p>
          1. <strong>Google Hesabınıza Giriş Yapın:</strong> Gmail hesabınıza giriş yapın ve Google Hesabı sayfasına gidin.
        </p>
        <p>
          2. <strong>İki Adımlı Doğrulamayı Etkinleştirin:</strong> Güvenlik sekmesine gidin. İki Adımlı Doğrulama bölümüne gidin ve bu özelliği etkinleştirin.
        </p>
        <p>
          3. <strong>Uygulama Şifresi Oluşturun:</strong> Güvenlik sekmesinde, Uygulama şifreleri bölümünü bulun. Bu bölüm, iki adımlı doğrulamayı etkinleştirdikten sonra görünür hale gelir.
          Uygulama şifreleri'ne tıklayın. Posta seçeneğini ve ardından uygun cihazı seçerek şifrenizi oluşturun.
        </p>
      </Modal>
    </div>
  );
};

export default AdminMail;
