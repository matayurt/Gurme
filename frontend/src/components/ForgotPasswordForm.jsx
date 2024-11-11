import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/userActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Arkaplan from '../assets/arkaplan.png';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const userForgotPassword = useSelector((state) => state.userForgotPassword);
  const { loading, error, success } = userForgotPassword;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Lütfen email adresinizi girin.', { autoClose: 1000 });
      return;
    }
    dispatch(forgotPassword(email));
    toast.success('Şifre sıfırlama bağlantısı gönderildi.', { autoClose: 1000 });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('${Arkaplan}')`,
      }}
    >
      <div className="bg-white border border-gray-400 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full hover:shadow-2xl transition duration-300 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Şifremi Unuttum</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="forgot-email">
              Email Adresi
            </label>
            <input
              type="email"
              id="forgot-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email adresinizi girin"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full md:w-auto"
          >
            Şifre Sıfırlama Bağlantısı Gönder
          </button>
          {loading && <p className="mt-4 text-center text-red-500">İşlem yapılıyor...</p>}
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          {success && <p className="mt-4 text-center text-green-500">{success}</p>}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
