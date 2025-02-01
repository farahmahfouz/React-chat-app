// import { UserContextProvider } from "./Context/UserContext";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './Pages/auth';
import Profile from './Pages/profile/Profile';
import Chat from './Pages/chat';
import { useAppStore } from './store';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to='/auth' />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to='/chat' /> : children
}

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, {
          withCredentials: true
        });
        console.log(res.data.data)
        if (res.status === 200 && res.data.data.id) {
          setUserInfo(res.data?.data)
        } else {
          setUserInfo(undefined)
        }
      } catch (err) {
        console.log(err)
        if (err.res?.status === 401 || err.res?.status === 403) {
          setUserInfo(undefined);
        }
      } finally {
        setLoading(false)
      }
    };
    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo]);

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-40 h-40 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } />
        <Route path='/chat' element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>} />
        <Route path='/*' element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
