// ResourcesHelp.jsx
import { 
  FiPhone, FiDownload, FiBook, FiShield, 
  FiAlertTriangle, FiHelpCircle, FiExternalLink 
} from 'react-icons/fi';

export default function ResourcesHelp() {
  return (
    <div className="resources-help-page">
      {/* Header Section */}
      <section className="resources-header">
        <h1>Resources & Help</h1>
        <p className='para'>Access guides, emergency contacts, and helpful information to enhance your safety knowledge</p>
      </section>

      {/* Emergency Contacts */}
      <section className="emergency-contacts">
        <h2><FiPhone /> Emergency Contacts</h2>
        <p className="section-subtitle">Important numbers to call in case of emergency</p>
        
        <div className="contacts-grid">
          <div className="contact-card">
            <div className="contact-icon police">
              <FiPhone />
            </div>
            <h3>Police Emergency</h3>
            <p>For immediate police assistance</p>
            <div className="contact-number">
              <span>15</span>
              <a href="tel:15" className="call-btn">Call</a>
            </div>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon helpline">
              <FiPhone />
            </div>
            <h3>Women's Helpline</h3>
            <p>National helpline for women in distress</p>
            <div className="contact-number">
              <span>1099</span>
              <a href="tel:1099" className="call-btn">Call</a>
            </div>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon ambulance">
              <FiPhone />
            </div>
            <h3>Ambulance Service</h3>
            <p>Emergency medical services</p>
            <div className="contact-number">
              <span>1122</span>
              <a href="tel:1122" className="call-btn">Call</a>
            </div>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon support">
              <FiPhone />
            </div>
            <h3>Muhafiz Support</h3>
            <p>24/7 support for Muhafiz users</p>
            <div className="contact-number">
              <span>+92 300 1234567</span>
              <a href="tel:+923001234567" className="call-btn">Call</a>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Resources */}
      <section className="safety-resources">
        <div className="section-header">
          <h2><FiBook /> Safety Resources</h2>
          <p className="section-subtitle">Download helpful guides and materials to enhance your safety knowledge</p>
          <button className="view-all-btn">View All Resources</button>
        </div>
        
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-icon">
              <FiBook />
            </div>
            <div className="resource-info">
              <h3>Personal Safety Guide for Women</h3>
              <p>Comprehensive guide with practical safety tips for various situations</p>
              <div className="resource-meta">
                <span>PDF</span>
                <span>2.4 MB</span>
              </div>
            </div>
            <button className="download-btn">
              <FiDownload /> Download
            </button>
          </div>
          
          {/* Repeat for other resources */}
          <div className="resource-card">
            <div className="resource-icon">
              <FiBook />
            </div>
            <div className="resource-info">
              <h3>Emergency Contacts Directory</h3>
              <p>List of emergency services and helplines across major cities</p>
              <div className="resource-meta">
                <span>PDF</span>
                <span>1.8 MB</span>
              </div>
            </div>
            <button className="download-btn">
              <FiDownload /> Download
            </button>
          </div>
          
          <div className="resource-card">
            <div className="resource-icon">
              <FiBook />
            </div>
            <div className="resource-info">
              <h3>Self-Defense Basics</h3>
              <p>Illustrated guide to basic self-defense techniques for women</p>
              <div className="resource-meta">
                <span>PDF</span>
                <span>3.2 MB</span>
              </div>
            </div>
            <button className="download-btn">
              <FiDownload /> Download
            </button>
          </div>
        </div>
      </section>

      {/* Safety Topics */}
      <section className="safety-topics">
        <h2><FiShield /> Safety Topics</h2>
        
        <div className="topics-grid">
          <div className="topic-card">
            <h3>Personal Safety Tips</h3>
            <p>Practical advice for staying safe in various situations, from walking alone at night to using public transportation</p>
            <ul className="tips-list">
              <li>Stay aware of your surroundings at all times</li>
              <li>Trust your instincts if something feels wrong</li>
              <li>Keep your phone charged and accessible</li>
            </ul>
            <button className="read-guide-btn">Read Full Guide</button>
          </div>
          
          <div className="topic-card">
            <h3>Self-Defense Basics</h3>
            <p>Introduction to basic self-defense techniques and principles that can help you protect yourself</p>
            <div className="sub-topics">
              <div className="sub-topic">
                <h4>Basic Techniques</h4>
                <p>Learn fundamental moves for self-protection</p>
              </div>
              <div className="sub-topic">
                <h4>Local Classes</h4>
                <p>Find self-defense classes in your area</p>
              </div>
            </div>
            <button className="explore-btn">Explore Resources</button>
          </div>
          
          <div className="topic-card">
            <h3>Legal Rights & Reporting</h3>
            <p>Information about your legal rights and proper procedures for reporting incidents</p>
            <ul className="legal-list">
              <li>How to file police reports for different incidents</li>
              <li>Understanding harassment laws and your rights</li>
              <li>Legal resources and support organizations</li>
            </ul>
            <button className="learn-more-btn">Learn More</button>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="additional-resources">
        <h2><FiExternalLink /> Additional Resources</h2>
        <p className="section-subtitle">Links to external organizations and resources that provide support and information</p>
        
        <div className="orgs-grid">
          <div className="org-card">
            <h3>Women's Safety Coalition</h3>
            <p>National organization dedicated to women's safety and empowerment</p>
            <a href="#" className="visit-website-btn">
              <FiExternalLink /> Visit Website
            </a>
          </div>
          
          <div className="org-card">
            <h3>Safety Training Institute</h3>
            <p>Offers workshops and training programs on personal safety</p>
            <a href="#" className="visit-website-btn">
              <FiExternalLink /> Visit Website
            </a>
          </div>
          
          <div className="org-card">
            <h3>Legal Aid Society</h3>
            <p>Provides free legal assistance to women in need</p>
            <a href="#" className="visit-website-btn">
              <FiExternalLink /> Visit Website
            </a>
          </div>
          
          <div className="org-card">
            <h3>Crisis Support Center</h3>
            <p>24/7 support for women experiencing crisis situations</p>
            <a href="#" className="visit-website-btn">
              <FiExternalLink /> Visit Website
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2><FiHelpCircle /> Frequently Asked Questions</h2>
        
        <div className="faq-list">
          <div className="faq-item">
            <h3>How does Muhafiz determine safe routes?</h3>
            <p>Muhafiz uses a combination of user-reported incidents, official crime data, and environmental factors like street lighting to calculate route safety. Our AI algorithm continuously learns and improves based on community feedback and new data.</p>
          </div>
          
          <div className="faq-item">
            <h3>Is my data secure when using Guardian Monitoring?</h3>
            <p>Yes, your privacy is our priority. Location data is only shared with your pre-selected emergency contacts and is encrypted end-to-end. You can stop sharing at any time, and we never store your location history beyond the active monitoring session.</p>
          </div>
          
          <div className="faq-item">
            <h3>How can I contribute to making my community safer?</h3>
            <p>You can contribute by reporting incidents, providing feedback on routes, participating in community discussions, and sharing safety tips. Every report and piece of feedback helps improve the platform for everyone and makes your community safer.</p>
          </div>
          
          <div className="faq-item">
            <h3>What should I do in an emergency situation?</h3>
            <p>In an emergency, your first priority should be to reach safety and contact emergency services (15 for police). Muhafiz's SOS feature can help by alerting your emergency contacts with your location, but it should not replace calling emergency services directly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}