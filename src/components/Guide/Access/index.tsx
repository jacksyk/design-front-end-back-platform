import { useNavigate } from '@umijs/max';
import { useEffect } from 'react';

type AccessTypes = {
  children: React.ReactNode;
};

export const AccessComp: React.FC<AccessTypes> = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  return <>{children}</>;
};
