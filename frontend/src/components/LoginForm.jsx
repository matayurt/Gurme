import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Arkaplan from '../assets/arkaplan.png';
import { useUserContext } from '../context/UserContext'; 

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, loading, error, login } = useUserContext();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Lütfen reCAPTCHA doğrulamasını tamamlayın.',
        timer: 1500,
        showConfirmButton: false,
        position: 'center', 
      });
      return;
    }

    console.log('Login işlemi başlatıldı:', email, password);
    await login(email, password);
  };

  useEffect(() => {
    console.log('Durum değişti:', { loading, error, userInfo });

    if (loading) {
      Swal.fire({
        title: 'Giriş yapılıyor...',
        text: 'Lütfen bekleyin.',
        allowOutsideClick: false,
        position: 'center',
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Yanlış email veya şifre girdiniz!',
        timer: 1500,
        showConfirmButton: false,
        position: 'center', 
      });
    } else if (userInfo) {
      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'Başarılı bir şekilde giriş yapıldı!',
        timer: 1500,
        showConfirmButton: false,
        position: 'center',
      }).then(() => {
        navigate('/');
        window.location.reload();
      });
    }
  }, [loading, error, userInfo, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const forgotPasswordRedirect = () => {
    navigate('/forgot-password');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url('${Arkaplan}')`,
      }}
    >
      <div className="bg-white border border-gray-400 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full hover:shadow-2xl transition duration-300 relative z-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">Giriş Yap</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email adresinizi girin"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Şifrenizi girin"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-1 right-0 pr-3 flex items-center text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <ReCAPTCHA
              sitekey="Your-Site-Key"
              onChange={(value) => setCaptchaValue(value)}
              hl="tr"
              className="flex justify-center md:justify-start"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full md:w-auto"
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={forgotPasswordRedirect}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Şifremi Unuttum?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
