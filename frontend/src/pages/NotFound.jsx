import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <AlertTriangle size={64} className="notfound-icon" />
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">Page not found. You seem to be lost.</p>
      <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
    </div>
  );
};

export default NotFound;
