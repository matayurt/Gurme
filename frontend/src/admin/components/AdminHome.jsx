import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUnapprovedComments, getApprovedComments, approveComment, deleteComment } from '../../actions/commentActions';
import { getCategories } from '../../actions/categoryActions';
import { getRestaurants } from '../../actions/restaurantActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faComments, faEye, faStore, faUserShield, faUsers, faChartLine, faChartPie, faComment } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import loadingGif from '../../assets/loading.gif';
import UpButton from './AdminUpButton';

const AdminHome = ({ darkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeSide, setActiveSide] = useState('admin');
  const [viewType, setViewType] = useState({
    comments: 'line',
    views: 'line',
  });

  const COLORS = ['#F2115E', '#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#FF8042'];

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const commentList = useSelector((state) => state.commentList);
  const { loading: loadingUnapproved, error: errorUnapproved, comments: unapprovedComments } = commentList;

  const approvedCommentList = useSelector((state) => state.commentApprovedList);
  const { loading: loadingApproved, error: errorApproved, comments: approvedComments } = approvedCommentList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const restaurantList = useSelector((state) => state.restaurantList);
  const { restaurants } = restaurantList;

  useEffect(() => {
    dispatch(getUnapprovedComments());
    dispatch(getApprovedComments());
    dispatch(getCategories());
    dispatch(getRestaurants());
  }, [dispatch]);

  const totalViews = restaurants.reduce((acc, restaurant) => acc + (restaurant.viewCount || 0), 0);

  const [commentsChartData, setCommentsChartData] = useState([]);

  useEffect(() => {
    if (approvedComments) {
      const commentsByDate = approvedComments.reduce((acc, comment) => {
        const date = new Date(comment.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      }, {});

      setCommentsChartData(Object.keys(commentsByDate).map(date => ({
        date,
        count: commentsByDate[date],
      })));
    }
  }, [approvedComments]);

  const approveHandler = (commentId) => {
    dispatch(approveComment(commentId));
  };

  const deleteHandler = (id) => {
    dispatch(deleteComment(id));
  };

  const deleteHandlerApproved = (id) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      dispatch(deleteComment(id)).then(() => {
        dispatch(getApprovedComments());
      });
    }
  };

  const handleNavigate = (side) => {
    if (side === 'admin') {
      navigate('/admin/admin');
    } else {
      navigate('/');
    }
    setActiveSide(side);
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-[#E8EFFA] text-black'}`}>
      <div className="flex justify-center -mt-8 mb-3">
        <div
          className={`mx-4 p-4 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'client' ? 'text-[#F2115E]' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
          onClick={() => handleNavigate('client')}
        >
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <p className="mt-2 text-center">Client</p>
        </div>
        <div
          className={`mx-4 p-4 cursor-pointer hover:text-[#F2115E] transition duration-300 ${activeSide === 'admin' ? 'text-[#F2115E]' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}
          onClick={() => handleNavigate('admin')}
        >
          <FontAwesomeIcon icon={faUserShield} size="2x" className='ml-2' />
          <p className="mt-2 text-center">Admin</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
          <h2 className="text-2xl font-semibold mb-4"><FontAwesomeIcon icon={faStore} /> Tavsiye</h2>
          <p className="text-lg font-bold mb-2">Toplam Tavsiye Sayısı: <span className="text-[#F2115E] text-4xl">{restaurants.length}</span></p>
        </div>

        <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
          <h2 className="text-2xl font-semibold mb-4"><FontAwesomeIcon icon={faEye} /> Görüntülenme</h2>
          <p className="text-lg font-bold mb-4">Toplam Görüntülenme Sayısı: <span className="text-[#F2115E] text-4xl">{totalViews}</span></p>
        </div>

        <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
          <h2 className="text-2xl font-semibold mb-4"><FontAwesomeIcon icon={faComments} /> Yorum</h2>
          <p className="text-lg font-bold mb-4">Toplam Yorum Sayısı: <span className="text-[#F2115E] text-4xl">{approvedComments.length}</span></p>
        </div>
      </div>

      {/* Kullanıcı Bilgileri */}
      <div className={`p-4 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
        <h2 className="text-2xl font-semibold mb-4">Hoşgeldiniz, {userInfo?.name}</h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Son Giriş Tarihi: {userInfo?.lastLoginTime ? new Date(userInfo.lastLoginTime).toLocaleString() : 'Bilinmiyor'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Onay Bekleyen Yorumlar Widget */}
        <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} md:col-span-2 lg:col-span-2`}>
          <h2 className="text-2xl font-semibold mb-4">Onay Bekleyen Son Yorumlar</h2>
          {loadingUnapproved ? (
            <div className="flex justify-center items-center mt-10">
              <img src={loadingGif} alt="Loading..." className="w-4/6 min-h-72 object-cover" />
            </div>
          ) : errorUnapproved ? (
            <p>{errorUnapproved}</p>
          ) : (
            <ul>
              {unapprovedComments.slice(-2).reverse().map((comment) => (
                <li key={comment._id} className={`mb-4 p-4 border rounded shadow ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                  <strong>{comment.name}</strong> - {comment.restaurant ? comment.restaurant.name : 'Restoran Bulunamadı'}
                  <p className="mb-2">{comment.comment}</p>
                  <button
                    onClick={() => approveHandler(comment._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    onClick={() => deleteHandler(comment._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => navigate("/admin/comments")}
            className={`mt-4 px-4 py-2 rounded hover:bg-[#e0004a] transition duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-[#F2115E] text-white'}`}
          >
            Yorumları Yönet
          </button>
        </div>

        {/* Onaylanmış Yorumlar Widget */}
        <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-4">Son Yorumlar</h2>
          {loadingApproved ? (
            <div className="flex justify-center items-center mt-10">
              <img src={loadingGif} alt="Loading..." className="w-4/6 min-h-72 object-cover" />
            </div>
          ) : errorApproved ? (
            <p>{errorApproved}</p>
          ) : (
            <ul>
              {approvedComments.slice(-2).map((comment) => {
                const restaurantName = comment.restaurant?.name || 'Restoran Bulunamadı';
                const restaurantLocation = comment.restaurant
                  ? `${comment.restaurant.district}, ${comment.restaurant.city}, ${comment.restaurant.country}`
                  : 'Konum Bilgisi Bulunamadı';
                return (
                  <li key={comment._id} className={`p-4 mb-6 border rounded-lg shadow-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <strong className="text-lg">{comment.name}</strong>
                      <span className="text-sm">{restaurantName}</span>
                    </div>
                    <p className="mt-2">{comment.comment}</p>
                    {comment.restaurant && (
                      <div className="mt-4 text-sm">
                        <p><strong>Restoran:</strong> {restaurantName}</p>
                        <p><strong>Konum:</strong> {restaurantLocation}</p>
                      </div>
                    )}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => deleteHandlerApproved(comment._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </li>
                );
              }).reverse()}
            </ul>
          )}
          <button
            onClick={() => navigate("/admin/approvedcomments")}
            className={`mt-4 px-4 py-2 rounded hover:bg-[#e0004a] transition duration-300 ${darkMode ? 'bg-gray-700 text-white' : 'bg-[#F2115E] text-white'}`}
          >
            Onaylanmış Yorumları Yönet
          </button>
        </div>


        <div className={`p-4 rounded-lg shadow-lg col-span-3 md:col-span-3 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
          <h2 className="text-2xl font-semibold mb-4">
            <FontAwesomeIcon icon={faComments} /> Toplam Yorum Sayısı
          </h2>
          <p className="text-4xl font-bold text-[#F2115E]">{approvedComments.length}</p>
          <div className="mt-6 flex space-x-2">
            <button onClick={() => setViewType(prev => ({ ...prev, comments: 'line' }))} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-gray-900 transition duration-300">
              <FontAwesomeIcon icon={faChartLine} /> Çizgi
            </button>
            <button onClick={() => setViewType(prev => ({ ...prev, comments: 'pie' }))} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 hover:text-gray-900 transition duration-300">
              <FontAwesomeIcon icon={faChartPie} /> Pasta
            </button>
          </div>
          <div className="mt-6">
            {viewType.comments === 'line' ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={commentsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#F2115E" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={commentsChartData} dataKey="count" nameKey="date" cx="50%" cy="50%" outerRadius={100} fill="#F2115E" label>
                    {commentsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
      <UpButton />
    </div>
  );
};

export default AdminHome;
