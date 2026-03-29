import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { LogIn, Layers } from 'lucide-react';
import '../../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="sidebar-brand-icon">
            <Layers size={22} strokeWidth={2.5} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-pro">PRO</span>
            <span className="brand-xima">XIMA</span>
          </div>
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to Proxima to continue.</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Enter Email Address"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            <LogIn size={18} />
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
