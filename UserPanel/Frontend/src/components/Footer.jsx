import { FiShield } from 'react-icons/fi';

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <FiShield className="footer-icon" />
            <h3>Muhafiz</h3>
            <p>Enhancing women's safety through technology & community</p>
          </div>
          
          <div className="footer-links">
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Features</li>
                <li>Reports</li>
              </ul>
            </div>
            
            <div>
              <h4>Resources</h4>
              <ul>
                <li>Community</li>
                <li>Safety Tips</li>
                <li>Privacy Policy</li>
                <li>Terms</li>
              </ul>
            </div>
            
            <div>
              <h4>Contact</h4>
              <ul>
                <li>support@muhafiz.com</li>
                <li>+92 300 1234567</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          © 2025 Muhafiz. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
