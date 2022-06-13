import { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useEffect } from 'react';

const TokenContext = createContext({});

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [user, setUser] = useState({});
  const url = `https://mea-aquaponics.herokuapp.com/api/v1`;

  useEffect(() => {
    if (token) setUser(jwtDecode(token));
    else setToken('');
  }, [token]);

  return <TokenContext.Provider value={{ token, setToken, user, setUser, url }}>{children}</TokenContext.Provider>;
};

export default TokenContext;
