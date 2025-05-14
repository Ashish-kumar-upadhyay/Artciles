import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={{ 
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      padding: '1.2rem 2.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        color: '#FFD700', 
        fontWeight: 'bold', 
        fontSize: '2.2rem',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        letterSpacing: '2px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        padding: '0.5rem 1rem',
        ':hover': {
          transform: 'scale(1.05)',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
        }
      }}>
        MyBlog
      </div>
      <div style={{ 
        display: 'flex', 
        gap: '35px', 
        alignItems: 'center' 
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-3px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Home
        </Link>
        <Link 
          to="/article" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-3px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Write Articles
        </Link>
        <Link 
          to="/my-articles" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500',
            padding: '10px 20px',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-3px)',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          MyArticles
        </Link>
        <button 
          style={{ 
            background: 'linear-gradient(45deg, #ff4757, #ff6b81)',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            ':hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(255, 71, 87, 0.5)',
              background: 'linear-gradient(45deg, #ff6b81, #ff4757)'
            }
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
