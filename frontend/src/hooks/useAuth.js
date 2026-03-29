import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isLoading,
    isError,
    isSuccess,
    message,
    isAuthenticated: !!user,
  };
};

export default useAuth;
