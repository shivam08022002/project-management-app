import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { UserPlus, Layers } from 'lucide-react';
import '../../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate('/');
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
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
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start collaborating with Proxima.</p>
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
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
              minLength="6"
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            <UserPlus size={18} />
            {isLoading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
