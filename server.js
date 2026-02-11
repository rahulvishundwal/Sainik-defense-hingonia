
const API = "/api";

// Sample images for slider
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200",
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200"
];

/* ===============================
   HOMEPAGE
=============================== */
function HomePage() {
  const [news, setNews] = React.useState([]);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    fetch(`${API}/news`)
      .then(res => res.json())
      .then(setNews)
      .catch(err => console.error(err));
  }, []);

  // Auto-advance slider
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Duplicate news for continuous scrolling
  const duplicatedNews = [...news, ...news];

  return (
    <div className="page">
      {/* Hero Section with Slider */}
      <section className="hero">
        <div className="hero-slider">
          {HERO_IMAGES.map((img, idx) => (
            <div key={idx} className={`slide ${idx === currentSlide ? 'active' : ''}`}>
              <img src={img} alt={`Slide ${idx + 1}`} />
            </div>
          ))}
          <div className="hero-content">
            <h1>Sainik Defense College</h1>
            <p>Hingonia, Jaipur</p>
            <p className="tagline">Discipline • Character • Excellence</p>
          </div>
          <div className="slider-nav">
            {HERO_IMAGES.map((_, idx) => (
              <div
                key={idx}
                className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Bulletin Section - Government Style */}
      <section className="news-bulletin-section">
        <div className="news-bulletin-container">
          <div className="news-bulletin-header">
            <h2>
              📰 Latest News & Updates
              <span className="live-indicator">
                <span className="live-dot"></span>
                LIVE
              </span>
            </h2>
          </div>
          
          {/* Scrolling Ticker */}
          {news.length > 0 && (
            <div className="news-ticker-wrapper">
              <div className="news-ticker">
                {duplicatedNews.map((n, idx) => (
                  <div key={idx} className="ticker-item">
                    <span className="ticker-icon">🔔</span>
                    <span>{n.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Grid */}
          <div className="news-grid-container">
            <div className="news-grid">
              {news.length === 0 ? (
                <p style={{textAlign: 'center', gridColumn: '1/-1', padding: '2rem'}}>
                  No news available at the moment
                </p>
              ) : (
                news.map(n => (
                  <div key={n.id} className="news-card">
                    <div className="news-card-header">
                      <h3>{n.title}</h3>
                    </div>
                    <div className="news-card-body">
                      <p>{n.content}</p>
                    </div>
                    <div className="news-card-footer">
                      <span className="news-date">
                        📅 {new Date(n.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="news-badge">Latest</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">About Our School</h2>
          <p className="text-center">
            Sainik Defense College is committed to providing quality education with a focus on 
            discipline, character building, and academic excellence. We prepare young minds for 
            a bright future through a perfect blend of academics and co-curricular activities.
            Our institution stands as a beacon of knowledge and values, nurturing students to become
            responsible citizens and future leaders of our nation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ===============================
   ADMISSION FORM WITH PHOTO UPLOAD
=============================== */
function AdmissionPage() {
  const [form, setForm] = React.useState({
    studentName: '', fatherName: '', motherName: '', dob: '', gender: '',
    email: '', phone: '', address: '', previousSchool: '', 
    classApplying: '', bloodGroup: '', photo: null
  });
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage('❌ Photo size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm({...form, photo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

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
          classApplying: '', bloodGroup: '', photo: null
        });
        setPhotoPreview(null);
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
    <div className="page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">📝 Admission Form</h2>
          
          {message && (
            <div className={message.includes('✅') ? 'alert success' : 'alert error'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admission-form">
            {/* Photo Upload */}
            <div className="form-group full-width">
              <label>Student Photo *</label>
              <div className="file-upload-wrapper">
                <label className="file-upload-label" htmlFor="photo-upload">
                  <span>📷</span>
                  <span>{photoPreview ? 'Change Photo' : 'Upload Student Photo (Max 2MB)'}</span>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="file-upload-input"
                  onChange={handlePhotoChange}
                  required={!photoPreview}
                />
              </div>
              {photoPreview && (
                <div className="file-preview">
                  <img src={photoPreview} alt="Student preview" />
                </div>
              )}
            </div>

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
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
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

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><span className="loading-spinner"></span> Submitting...</> : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ===============================
   CONTACT PAGE
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
    <div className="page">
      <section className="section">
        <div className="container">
          <h2 className="section-title">📞 Contact Us</h2>
          
          <div className="contact-info">
            <div className="info-card">
              <div className="info-card-icon">📍</div>
              <h3>Address</h3>
              <p>Sainik Defense College<br/>Hingonia, Jaipur<br/>Rajasthan, India</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">📧</div>
              <h3>Email</h3>
              <p>info@sainikdefense.com<br/>admissions@sainikdefense.com</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">📱</div>
              <h3>Phone</h3>
              <p>+91 XXXXX XXXXX<br/>+91 XXXXX XXXXX</p>
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

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? <><span className="loading-spinner"></span> Sending...</> : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ===============================
   FOOTER COMPONENT
=============================== */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Sainik Defense College</h3>
          <p>
            A premier educational institution dedicated to nurturing young minds 
            with discipline, character, and academic excellence since its inception.
          </p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <a href="#home">Home</a>
          <a href="#admission">Admissions</a>
          <a href="#contact">Contact Us</a>
          <a href="#admin">Admin Portal</a>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📍 Hingonia, Jaipur, Rajasthan</p>
          <p>📧 info@sainikdefense.com</p>
          <p>📱 +91 XXXXX XXXXX</p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" title="Facebook">📘</a>
            <a href="#" title="Twitter">🐦</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="LinkedIn">💼</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Sainik Defense College. All rights reserved. | Designed with ❤️ for Excellence</p>
      </div>
    </footer>
  );
}

/* ===============================
   ADMIN LOGIN
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
        <h2>🔐 Admin Login</h2>
        <p className="subtitle">Sainik Defense College</p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
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

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <><span className="loading-spinner"></span> Logging in...</> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   ADMIN DASHBOARD WITH BETTER PDF
=============================== */
function AdminDashboard({ onBackToHome }) {
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
        setMessage('✅ News saved successfully!');
        setNewsForm({ id: null, title: '', content: '' });
        loadData();
      }
    } catch (err) {
      setMessage('❌ Failed to save news');
    }
  };

  const deleteNews = async (id) => {
    if (!confirm('Delete this news?')) return;
    
    try {
      await fetch(`${API}/admin/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ News deleted');
      loadData();
    } catch (err) {
      setMessage('❌ Delete failed');
    }
  };

  const downloadCSV = (type) => {
    const data = type === 'admissions' ? admissions : contacts;
    const headers = type === 'admissions' 
      ? ['ID', 'Student Name', 'Father', 'Mother', 'DOB', 'Gender', 'Email', 'Phone', 'Class', 'Blood Group', 'Previous School', 'Address', 'Submitted']
      : ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted'];
    
    let csvContent = headers.join(',') + '\n';
    
    data.forEach(row => {
      if (type === 'admissions') {
        csvContent += [
          row.id,
          `"${row.student_name}"`,
          `"${row.father_name}"`,
          `"${row.mother_name}"`,
          row.dob,
          row.gender,
          row.email,
          row.phone,
          row.class_applying,
          row.blood_group || '',
          `"${row.previous_school || ''}"`,
          `"${row.address.replace(/"/g, '""')}"`,
          new Date(row.submitted_at).toLocaleString()
        ].join(',') + '\n';
      } else {
        csvContent += [
          row.id,
          `"${row.name}"`,
          row.email,
          row.phone,
          `"${row.subject}"`,
          `"${row.message.replace(/"/g, '""')}"`,
          new Date(row.submitted_at).toLocaleString()
        ].join(',') + '\n';
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    if (confirm('Logout from admin panel?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="admin-nav">
        <div className="nav-brand">🎓 Admin Dashboard</div>
        <div className="nav-links">
          <span onClick={onBackToHome} className="home-link">🏠 Back to Home</span>
          <span onClick={() => setTab('news')} className={tab === 'news' ? 'active' : ''}>📰 News</span>
          <span onClick={() => setTab('admissions')} className={tab === 'admissions' ? 'active' : ''}>📝 Admissions ({admissions.length})</span>
          <span onClick={() => setTab('contacts')} className={tab === 'contacts' ? 'active' : ''}>📧 Contacts ({contacts.length})</span>
          <span onClick={logout} className="logout">🚪 Logout</span>
        </div>
      </nav>

      <div className="admin-content">
        {message && (
          <div className={message.includes('✅') ? 'alert success' : 'alert error'}>
            {message}
          </div>
        )}

        {tab === 'news' && (
          <div className="admin-section">
            <h2>📰 Manage News & Updates</h2>
            
            <form onSubmit={saveNews} className="admin-form">
              <input
                placeholder="News Title"
                value={newsForm.title}
                onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="News Content"
                value={newsForm.content}
                onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                required
                rows="4"
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {newsForm.id ? '✏️ Update News' : '➕ Add News'}
                </button>
                {newsForm.id && (
                  <button type="button" onClick={() => setNewsForm({ id: null, title: '', content: '' })} className="btn-secondary">
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="data-list">
              {news.map(n => (
                <div key={n.id} className="data-card">
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                  <small>📅 {new Date(n.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</small>
                  <div className="card-actions">
                    <button onClick={() => setNewsForm(n)} className="btn-sm btn-primary">✏️ Edit</button>
                    <button onClick={() => deleteNews(n.id)} className="btn-sm btn-danger">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'admissions' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📝 Admission Applications ({admissions.length})</h2>
              <button onClick={() => downloadCSV('admissions')} className="btn-primary">
                📥 Download CSV
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Student</th>
                    <th>Father</th>
                    <th>Mother</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Class</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map(a => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>
                        {a.photo ? (
                          <img src={a.photo} alt="Student" style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                        ) : (
                          '👤'
                        )}
                      </td>
                      <td>{a.student_name}</td>
                      <td>{a.father_name}</td>
                      <td>{a.mother_name}</td>
                      <td>{new Date(a.dob).toLocaleDateString()}</td>
                      <td>{a.gender}</td>
                      <td>{a.email}</td>
                      <td>{a.phone}</td>
                      <td>{a.class_applying}</td>
                      <td>{new Date(a.submitted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>📧 Contact Enquiries ({contacts.length})</h2>
              <button onClick={() => downloadCSV('contacts')} className="btn-primary">
                📥 Download CSV
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.subject}</td>
                      <td>{c.message.substring(0, 50)}...</td>
                      <td>{new Date(c.submitted_at).toLocaleDateString()}</td>
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
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setPage('home');
    scrollToTop();
  };

  if (page === 'admin') {
    return isAdmin 
      ? <AdminDashboard onBackToHome={goToHome} /> 
      : <AdminLogin onSuccess={() => setIsAdmin(true)} />;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">🎓 Sainik Defense College</div>
        <div className="nav-links">
          <span onClick={() => { setPage('home'); scrollToTop(); }} className={page === 'home' ? 'active' : ''}>🏠 Home</span>
          <span onClick={() => { setPage('admission'); scrollToTop(); }} className={page === 'admission' ? 'active' : ''}>📝 Admission</span>
          <span onClick={() => { setPage('contact'); scrollToTop(); }} className={page === 'contact' ? 'active' : ''}>📞 Contact</span>
          <span onClick={() => { setPage('admin'); scrollToTop(); }} className="admin-link">🔐 Admin</span>
        </div>
      </nav>

      {page === 'home' && <HomePage />}
      {page === 'admission' && <AdmissionPage />}
      {page === 'contact' && <ContactPage />}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button className="scroll-top show" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

