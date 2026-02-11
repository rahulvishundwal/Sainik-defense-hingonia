const API = "/api";

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
    <div className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Sainik Defense College</h1>
          <p>Hingonia, Jaipur</p>
          <p className="tagline">Discipline • Character • Excellence</p>
        </div>
      </section>

      {/* News Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">📰 Latest News & Updates</h2>
          <div className="news-grid">
            {news.length === 0 ? (
              <p>No news available</p>
            ) : (
              news.map(n => (
                <div key={n.id} className="news-card">
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                  <small>{new Date(n.date).toLocaleDateString()}</small>
                </div>
              ))
            )}
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
          </p>
        </div>
      </section>
    </div>
  );
}

/* ===============================
   ADMISSION FORM
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
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
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
              <h3>📍 Address</h3>
              <p>Sainik Defense College<br/>Hingonia, Jaipur<br/>Rajasthan, India</p>
            </div>
            <div className="info-card">
              <h3>📧 Email</h3>
              <p>info@sainikdefense.com</p>
            </div>
            <div className="info-card">
              <h3>📱 Phone</h3>
              <p>+91 XXXXX XXXXX</p>
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
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   ADMIN DASHBOARD
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

  const downloadPDF = (type) => {
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

  const logout = () => {
    if (confirm('Logout?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="admin-nav">
        <div className="nav-brand">Admin Dashboard</div>
        <div className="nav-links">
          <span onClick={() => setTab('news')} className={tab === 'news' ? 'active' : ''}>📰 News</span>
          <span onClick={() => setTab('admissions')} className={tab === 'admissions' ? 'active' : ''}>📝 Admissions</span>
          <span onClick={() => setTab('contacts')} className={tab === 'contacts' ? 'active' : ''}>📧 Contacts</span>
          <span onClick={logout} className="logout">🚪 Logout</span>
        </div>
      </nav>

      <div className="admin-content">
        {message && <div className="alert success">{message}</div>}

        {tab === 'news' && (
          <div className="admin-section">
            <h2>📰 Manage News</h2>
            
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
                  {newsForm.id ? 'Update' : 'Add'} News
                </button>
                {newsForm.id && (
                  <button type="button" onClick={() => setNewsForm({ id: null, title: '', content: '' })} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="data-list">
              {news.map(n => (
                <div key={n.id} className="data-card">
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                  <small>{new Date(n.date).toLocaleDateString()}</small>
                  <div className="card-actions">
                    <button onClick={() => setNewsForm(n)} className="btn-sm">Edit</button>
                    <button onClick={() => deleteNews(n.id)} className="btn-sm btn-danger">Delete</button>
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
              <button onClick={() => downloadPDF('admissions')} className="btn-primary">
                📥 Download CSV
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Father</th>
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
                      <td>{a.student_name}</td>
                      <td>{a.father_name}</td>
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
              <button onClick={() => downloadPDF('contacts')} className="btn-primary">
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

  if (page === 'admin') {
    return isAdmin 
      ? <AdminDashboard /> 
      : <AdminLogin onSuccess={() => setIsAdmin(true)} />;
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Sainik Defense College</div>
        <div className="nav-links">
          <span onClick={() => setPage('home')} className={page === 'home' ? 'active' : ''}>Home</span>
          <span onClick={() => setPage('admission')} className={page === 'admission' ? 'active' : ''}>Admission</span>
          <span onClick={() => setPage('contact')} className={page === 'contact' ? 'active' : ''}>Contact</span>
          <span onClick={() => setPage('admin')} className="admin-link">Admin</span>
        </div>
      </nav>

      {page === 'home' && <HomePage />}
      {page === 'admission' && <AdmissionPage />}
      {page === 'contact' && <ContactPage />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
