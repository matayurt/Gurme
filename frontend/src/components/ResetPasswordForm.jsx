import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../actions/userActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Arkaplan from '../assets/arkaplan.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { token } = useParams();

  const userResetPassword = useSelector((state) => state.userResetPassword);
  const { loading, error, success } = userResetPassword;

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor.', { autoClose: 1000 });
      return;
    }
    dispatch(resetPassword(token, password));
    toast.success('Şifreniz başarıyla sıfırlandı.', { autoClose: 1000 });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('${Arkaplan}')`,
      }}
    >
      <div className="bg-white border border-gray-400 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full hover:shadow-2xl transition duration-300 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Şifre Sıfırla</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Yeni şifrenizi girin"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-1 right-0 pr-3 flex items-center text-gray-700"
              >
                <FaEyeSlash size={25} className={`${showPassword ? '' : 'hidden'}`} />
                <FaEye size={25} className={`${showPassword ? 'hidden' : ''}`} />
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              Şifreyi Onayla
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Şifrenizi tekrar girin"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full md:w-auto"
          >
            Şifreyi Sıfırla
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

export default ResetPasswordForm;
