// https://frontend-take-home.fetch.com/?fbclid=IwAR2g_BOoX5zmJXsqKPir1eKEGV6qsaQ5wvgzrFZhtpkPdW-6oLIqYeNNjcw

import { useState } from 'react';

import { UserContext } from './UserContext';
import LoginPage from './LoginPage';
import BrowsePage from './BrowsePage';

export default function App() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    authenticated: false
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {user.authenticated ? <BrowsePage /> : <LoginPage />}
    </UserContext.Provider>
  );
}