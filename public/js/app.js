const API = "/api";

/* ===============================
   IMAGE SLIDER
=============================== */
function ImageSlider() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const slides = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=400&fit=crop'
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      ))}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

/* ===============================
   AUTO-SCROLLING NEWS TICKER
=============================== */
function NewsTicker() {
  const [news, setNews] = React.useState([]);

  React.useEffect(() => {
    fetch(`${API}/news`)
      .then(res => res.json())
      .then(setNews)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="news-ticker-container">
      <div className="news-ticker-label">📰 Latest Updates</div>
      <div className="news-ticker-content">
        <div className="news-ticker-scroll">
          {news.map(n => (
            <div key={n.id} className="ticker-item">
              <strong>{n.title}</strong> - {n.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   HOMEPAGE
=============================== */
function HomePage() {
  const [news, setNews] = React.useState([]);

  React.useEffect(() => {
    fetch(`${API}/news`)
      .then(res => res.json())
      .then(setNews)
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <ImageSlider />
      <NewsTicker />
      
      <div className="home-content">
        {/* Welcome Section */}
        <section className="section welcome-section">
          <div className="container">
            <div className="welcome-box">
              <div className="emblem">🛡️</div>
              <h1>Sainik Defense College</h1>
              <p className="tagline">Hingonia, Jaipur, Rajasthan</p>
              <p className="motto">"Discipline • Character • Excellence"</p>
              <div className="welcome-text">
                <p>
                  Established with the vision to provide quality education combined with 
                  discipline and character building, Sainik Defense College stands as a 
                  premier institution in preparing young minds for a bright future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <section className="section">
          <div className="container">
            <div className="two-column-layout">
              {/* Latest News Sidebar */}
              <div className="news-sidebar">
                <div className="sidebar-header">
                  <h3>📢 Latest News & Announcements</h3>
                </div>
                <div className="news-scroll-container">
                  {news.length === 0 ? (
                    <p className="no-news">No announcements at this time</p>
                  ) : (
                    news.map(n => (
                      <div key={n.id} className="news-item-vertical">
                        <div className="news-date">
                          {new Date(n.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="news-content">
                          <h4>{n.title}</h4>
                          <p>{n.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="main-content-area">
                <div className="info-cards">
                  <div className="info-card">
                    <div className="card-icon">📚</div>
                    <h4>Academic Excellence</h4>
                    <p>Comprehensive curriculum designed to nurture intellectual growth and critical thinking</p>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">🎯</div>
                    <h4>Discipline & Training</h4>
                    <p>Structured daily routine with focus on physical fitness and mental discipline</p>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">🏆</div>
                    <h4>Character Building</h4>
                    <p>Emphasis on values, ethics, and leadership development for future citizens</p>
                  </div>
                  <div className="info-card">
                    <div className="card-icon">🌟</div>
                    <h4>Co-curricular Activities</h4>
                    <p>Sports, NCC, scouts & guides, and various clubs for holistic development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ===============================
   DIRECTOR'S DESK
=============================== */
function DirectorPage() {
  return (
    <>
      <ImageSlider />
      <NewsTicker />
      
      <div className="page-content">
        <section className="section">
          <div className="container">
            <div className="director-container">
              <div className="director-photo">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop" alt="Director" />
                <div className="director-name-plate">
                  <h3>Col. Rajesh Kumar (Retd.)</h3>
                  <p>Director</p>
                </div>
              </div>
              <div className="director-message">
                <h2>From the Director's Desk</h2>
                <div className="message-content">
                  <p>Dear Students, Parents, and Well-wishers,</p>
                  
                  <p>
                    It gives me immense pleasure to welcome you to Sainik Defense College, Hingonia. 
                    Our institution stands as a beacon of excellence in education, combining academic 
                    rigor with discipline and character building.
                  </p>
                  
                  <p>
                    At Sainik Defense College, we believe that education is not merely about acquiring 
                    knowledge but about developing well-rounded individuals who are prepared to face 
                    the challenges of tomorrow. Our comprehensive curriculum, experienced faculty, and 
                    state-of-the-art facilities ensure that every student receives the best possible 
                    education.
                  </p>
                  
                  <p>
                    We emphasize the importance of discipline, physical fitness, and moral values 
                    alongside academic excellence. Our students are trained to be leaders, decision-makers, 
                    and responsible citizens who can contribute meaningfully to society and the nation.
                  </p>
                  
                  <p>
                    I invite you to join our family and embark on a transformative journey of learning 
                    and growth. Together, we shall strive for excellence and uphold the proud traditions 
                    of our institution.
                  </p>
                  
                  <div className="signature">
                    <p><strong>Col. Rajesh Kumar (Retd.)</strong></p>
                    <p>Director</p>
                    <p>Sainik Defense College</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ===============================
   GALLERY
=============================== */
function GalleryPage() {
  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', title: 'Campus View' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', title: 'Classroom' },
    { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600', title: 'Library' },
    { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600', title: 'Sports Ground' },
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', title: 'Laboratory' },
    { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600', title: 'Auditorium' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600', title: 'Annual Day' },
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', title: 'Computer Lab' },
    { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600', title: 'Parade Ground' }
  ];

  return (
    <>
      <ImageSlider />
      <NewsTicker />
      
      <div className="page-content">
        <section className="section">
          <div className="container">
            <h2 className="page-title">📸 Photo Gallery</h2>
            <div className="gallery-grid">
              {galleryImages.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img src={img.url} alt={img.title} />
                  <div className="gallery-overlay">
                    <span>{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ===============================
   ADMISSION FORM (Same as before)
=============================== */
function AdmissionPage() {
  const [form, setForm] = React.useState({
    studentName: '', fatherName: '', motherName: '', dob: '', gender: '',
    email: '', phone: '', address: '', previousSchool: '', 
    classApplying: '', bloodGroup: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API}/admission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Application submitted successfully! We will contact you soon.');
        setForm({
          studentName: '', fatherName: '', motherName: '', dob: '', gender: '',
          email: '', phone: '', address: '', previousSchool: '', 
          classApplying: '', bloodGroup: ''
        });
      } else {
        setMessage('❌ ' + (data.error || 'Failed to submit'));
      }
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageSlider />
      <NewsTicker />
      
      <div className="page-content">
        <section className="section">
          <div className="container">
            <h2 className="page-title">📝 Admission Form</h2>
            
            {message && (
              <div className={message.includes('✅') ? 'alert success' : 'alert error'}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="admission-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Student Name *</label>
                  <input
                    required
                    value={form.studentName}
                    onChange={e => setForm({...form, studentName: e.target.value})}
                    placeholder="Enter student's full name"
                  />
                </div>

                <div className="form-group">
                  <label>Father's Name *</label>
                  <input
                    required
                    value={form.fatherName}
                    onChange={e => setForm({...form, fatherName: e.target.value})}
                    placeholder="Enter father's name"
                  />
                </div>

                <div className="form-group">
                  <label>Mother's Name *</label>
                  <input
                    required
                    value={form.motherName}
                    onChange={e => setForm({...form, motherName: e.target.value})}
                    placeholder="Enter mother's name"
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={form.dob}
                    onChange={e => setForm({...form, dob: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    required
                    value={form.gender}
                    onChange={e => setForm({...form, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Class Applying For *</label>
                  <select
                    required
                    value={form.classApplying}
                    onChange={e => setForm({...form, classApplying: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={e => setForm({...form, bloodGroup: e.target.value})}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Previous School</label>
                  <input
                    value={form.previousSchool}
                    onChange={e => setForm({...form, previousSchool: e.target.value})}
                    placeholder="Name of previous school (if any)"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    required
                    value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    placeholder="Complete residential address"
                    rows="3"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary btn-large">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

/* ===============================
   CONTACT PAGE (Same structure, with slider)
=============================== */
function ContactPage() {
  const [form, setForm] = React.useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Message sent successfully! We will get back to you soon.');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setMessage('❌ ' + (data.error || 'Failed to send'));
      }
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageSlider />
      <NewsTicker />
      
      <div className="page-content">
        <section className="section">
          <div className="container">
            <h2 className="page-title">📞 Contact Us</h2>
            
            <div className="contact-info-grid">
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h4>Address</h4>
                <p>Sainik Defense College<br/>Hingonia, Jaipur<br/>Rajasthan - 302026<br/>India</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h4>Email</h4>
                <p>info@sainikdefense.com<br/>admissions@sainikdefense.com</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📱</div>
                <h4>Phone</h4>
                <p>+91 141 XXXXXXX<br/>+91 XXXXX XXXXX</p>
              </div>
            </div>

            {message && (
              <div className={message.includes('✅') ? 'alert success' : 'alert error'}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    required
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    placeholder="Message subject"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Type your message here..."
                    rows="5"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary btn-large">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

/* ===============================
   ADMIN LOGIN (Same as before)
=============================== */
function AdminLogin({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onSuccess();
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-emblem">🛡️</div>
        <h2>Admin Panel</h2>
        <p className="subtitle">Sainik Defense College</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@sainik.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary btn-large">
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   ADMIN DASHBOARD - ENHANCED
=============================== */
function AdminDashboard() {
  const [tab, setTab] = React.useState('news');
  const [admissions, setAdmissions] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [news, setNews] = React.useState([]);
  const [newsForm, setNewsForm] = React.useState({ id: null, title: '', content: '' });
  const [message, setMessage] = React.useState('');
  const token = localStorage.getItem('token');

  const loadData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [admRes, contRes, newsRes] = await Promise.all([
        fetch(`${API}/admin/admissions`, { headers }),
        fetch(`${API}/admin/contacts`, { headers }),
        fetch(`${API}/news`)
      ]);

      setAdmissions(await admRes.json());
      setContacts(await contRes.json());
      setNews(await newsRes.json());
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const saveNews = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const url = newsForm.id ? `${API}/admin/news/${newsForm.id}` : `${API}/admin/news`;
      const method = newsForm.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newsForm)
      });

      if (res.ok) {
        setMessage('✅ News published successfully!');
        setNewsForm({ id: null, title: '', content: '' });
        loadData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('❌ Failed to save news');
    }
  };

  const deleteNews = async (id) => {
    if (!confirm('Delete this news item?')) return;
    
    try {
      await fetch(`${API}/admin/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ News deleted');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Delete failed');
    }
  };

  const downloadCSV = (type) => {
    const data = type === 'admissions' ? admissions : contacts;
    const headers = type === 'admissions' 
      ? ['ID', 'Student Name', 'Father', 'Mother', 'DOB', 'Gender', 'Email', 'Phone', 'Class', 'Submitted']
      : ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted'];
    
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
      if (type === 'admissions') {
        csvContent += [
          row.id, row.student_name, row.father_name, row.mother_name,
          row.dob, row.gender, row.email, row.phone, row.class_applying,
          new Date(row.submitted_at).toLocaleString()
        ].join(',') + '\n';
      } else {
        csvContent += [
          row.id, row.name, row.email, row.phone, row.subject,
          `"${row.message.replace(/"/g, '""')}"`,
          new Date(row.submitted_at).toLocaleString()
        ].join(',') + '\n';
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const downloadPDF = async (admissionId) => {
    try {
      const res = await fetch(`${API}/admin/admission-pdf/${admissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admission_form_${admissionId}.pdf`;
      a.click();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const logout = () => {
    if (confirm('Logout from admin panel?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-brand">
          <span className="admin-icon">🛡️</span>
          <span>Sainik Defense College - Admin Panel</span>
        </div>
        <div className="admin-nav-links">
          <button 
            onClick={() => setTab('news')} 
            className={`admin-tab ${tab === 'news' ? 'active' : ''}`}
          >
            📰 News Management
          </button>
          <button 
            onClick={() => setTab('admissions')} 
            className={`admin-tab ${tab === 'admissions' ? 'active' : ''}`}
          >
            📝 Admissions ({admissions.length})
          </button>
          <button 
            onClick={() => setTab('contacts')} 
            className={`admin-tab ${tab === 'contacts' ? 'active' : ''}`}
          >
            📧 Enquiries ({contacts.length})
          </button>
          <button onClick={logout} className="admin-logout">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="admin-content">
        {message && (
          <div className={`admin-alert ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {tab === 'news' && (
          <div className="admin-panel">
            <div className="panel-header">
              <h2>📢 News & Announcements Management</h2>
              <p>Create and manage news items that appear on the homepage</p>
            </div>
            
            <div className="news-editor">
              <h3>{newsForm.id ? 'Edit News Item' : 'Publish New Announcement'}</h3>
              <form onSubmit={saveNews}>
                <div className="form-group">
                  <label>News Title *</label>
                  <input
                    placeholder="Enter news headline..."
                    value={newsForm.title}
                    onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>News Content *</label>
                  <textarea
                    placeholder="Write the full news content here..."
                    value={newsForm.content}
                    onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                    required
                    rows="5"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {newsForm.id ? '✓ Update News' : '📤 Publish News'}
                  </button>
                  {newsForm.id && (
                    <button 
                      type="button" 
                      onClick={() => setNewsForm({ id: null, title: '', content: '' })} 
                      className="btn-secondary"
                    >
                      ✕ Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="published-news">
              <h3>📋 Published News ({news.length})</h3>
              <div className="news-list-admin">
                {news.map(n => (
                  <div key={n.id} className="news-card-admin">
                    <div className="news-meta">
                      <span className="news-id">ID: {n.id}</span>
                      <span className="news-date-admin">
                        {new Date(n.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <h4>{n.title}</h4>
                    <p>{n.content}</p>
                    <div className="news-actions">
                      <button onClick={() => setNewsForm(n)} className="btn-edit">
                        ✏️ Edit
                      </button>
                      <button onClick={() => deleteNews(n.id)} className="btn-delete">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'admissions' && (
          <div className="admin-panel">
            <div className="panel-header">
              <h2>📝 Admission Applications</h2>
              <div className="panel-actions">
                <button onClick={() => downloadCSV('admissions')} className="btn-download">
                  📊 Download CSV
                </button>
              </div>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Father's Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Class</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td><strong>{a.student_name}</strong></td>
                      <td>{a.father_name}</td>
                      <td>{a.email}</td>
                      <td>{a.phone}</td>
                      <td><span className="class-badge">{a.class_applying}</span></td>
                      <td>{new Date(a.submitted_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button 
                          onClick={() => downloadPDF(a.id)} 
                          className="btn-pdf"
                          title="Download PDF"
                        >
                          📄 PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="admin-panel">
            <div className="panel-header">
              <h2>📧 Contact Enquiries</h2>
              <div className="panel-actions">
                <button onClick={() => downloadCSV('contacts')} className="btn-download">
                  📊 Download CSV
                </button>
              </div>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.subject}</td>
                      <td className="message-cell">{c.message}</td>
                      <td>{new Date(c.submitted_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ===============================
   MAIN APP
=============================== */
function App() {
  const [page, setPage] = React.useState('home');
  const [isAdmin, setIsAdmin] = React.useState(!!localStorage.getItem('token'));

  if (page === 'admin') {
    return isAdmin 
      ? <AdminDashboard /> 
      : <AdminLogin onSuccess={() => setIsAdmin(true)} />;
  }

  return (
    <>
      {/* Top Header Bar */}
      <div className="top-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <span className="header-item">📧 info@sainikdefense.com</span>
              <span className="header-item">📞 +91 141 XXXXXXX</span>
            </div>
            <div className="header-right">
              <button onClick={() => setPage('contact')} className="header-btn">
                📞 Contact Us
              </button>
              <button onClick={() => setPage('admin')} className="header-btn admin-btn">
                🔐 Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo-section">
              <div className="logo-emblem">🛡️</div>
              <div className="logo-text">
                <h1>Sainik Defense College</h1>
                <p>Hingonia, Jaipur</p>
              </div>
            </div>
            <div className="nav-menu">
              <button 
                onClick={() => setPage('home')} 
                className={`nav-link ${page === 'home' ? 'active' : ''}`}
              >
                Home
              </button>
              <button 
                onClick={() => setPage('director')} 
                className={`nav-link ${page === 'director' ? 'active' : ''}`}
              >
                Director's Desk
              </button>
              <button 
                onClick={() => setPage('gallery')} 
                className={`nav-link ${page === 'gallery' ? 'active' : ''}`}
              >
                Gallery
              </button>
              <button 
                onClick={() => setPage('admission')} 
                className={`nav-link ${page === 'admission' ? 'active' : ''}`}
              >
                Admission
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {page === 'home' && <HomePage />}
      {page === 'director' && <DirectorPage />}
      {page === 'gallery' && <GalleryPage />}
      {page === 'admission' && <AdmissionPage />}
      {page === 'contact' && <ContactPage />}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Sainik Defense College</h4>
              <p>Hingonia, Jaipur, Rajasthan - 302026</p>
              <p>Affiliated to CBSE, New Delhi</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#" onClick={() => setPage('home')}>Home</a>
              <a href="#" onClick={() => setPage('admission')}>Admission</a>
              <a href="#" onClick={() => setPage('contact')}>Contact</a>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@sainikdefense.com</p>
              <p>Phone: +91 9928889381</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Sainik Defense College. All Rights Reserved.</p>
         <p>&copy; <b>Designed and developed by Rahul Web Solution.</b></p>
          </div>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
