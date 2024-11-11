import React, { useState } from 'react';
import Chef from '../assets/default-chef.png';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Gönderiliyor...');
  
    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setStatus('Mesaj başarıyla gönderildi!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Hata:', error);
      setStatus('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-12">
      <h1 className="text-3xl font-bold mb-6">İletişim</h1>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adı Soyadı</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='Adınız Soyadınız'
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-Posta Adresi</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder='E-Posta Adresiniz'
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mesaj</label>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder='Mesajınız'
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#e14b00] text-white py-2 rounded-lg hover:bg-[#d13b00] transition duration-300">
              Gönder
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            {status || 'Ya da '}
            <a href="mailto:info@enesingunlugu.com" className="text-orange-600 underline">info@enesingunlugu.com</a> adresine e-posta gönderebilirsiniz.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img src={Chef} alt="Chef" className="max-w-xs rounded-full shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
