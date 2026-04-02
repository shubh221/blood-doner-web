import { useState } from 'react';
import api from '../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BADGE_COLORS = {
  'A+': '#dc2626', 'A-': '#b91c1c',
  'B+': '#2563eb', 'B-': '#1d4ed8',
  'AB+': '#7c3aed', 'AB-': '#6d28d9',
  'O+': '#059669', 'O-': '#047857',
};

export default function SearchDonors() {
  const [filters, setFilters] = useState({ bloodGroup: '', location: '' });
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(false);

    try {
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.location) params.location = filters.location;

      const { data } = await api.get('/donors', { params });
      setDonors(data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ bloodGroup: '', location: '' });
    setDonors([]);
    setSearched(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Find a Donor</h1>
          <p style={styles.pageSubtitle}>
            Search for blood donors by blood group or location
          </p>
        </div>

        {/* Search form */}
        <div style={styles.searchCard}>
          <form onSubmit={handleSearch} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={filters.bloodGroup}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Any blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Location</label>
                <input
                  name="location"
                  value={filters.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Delhi..."
                  style={styles.input}
                />
              </div>


              <div style={styles.btnGroup}>
                <button type="submit" disabled={loading} style={styles.searchBtn}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {searched && (
                  <button type="button" onClick={handleReset} style={styles.resetBtn}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Results */}
        {searched && (
          <div>
            <p style={styles.resultCount}>
              {donors.length === 0
                ? 'No donors found matching your criteria.'
                : `${donors.length} donor${donors.length !== 1 ? 's' : ''} found`}
            </p>

            <div style={styles.donorGrid}>
              {donors.map((donor, i) => (
                <div key={i} style={styles.donorCard}>
                  <div style={styles.donorAvatar}>
                    {donor.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.donorInfo}>
                    <p style={styles.donorName}>{donor.name}</p>
                    <p style={styles.donorLocation}>📍 {donor.location}</p>
                    {donor.contact && (
                      <a href={`tel:${donor.contact}`} style={styles.callBtn}>
                        📞 Call
                      </a>
                    )}
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      background: BADGE_COLORS[donor.bloodGroup] || '#6b7280',
                    }}
                  >
                    {donor.bloodGroup}
                  </span>
                </div>
              ))}
            </div>

            {donors.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>🔍</p>
                <p style={styles.emptyText}>Try a different blood group or location.</p>
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🩸</p>
            <p style={styles.emptyText}>Use the filters above to find donors near you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#f9fafb', minHeight: 'calc(100vh - 60px)', padding: '2rem 1rem' },
  container: { maxWidth: '720px', margin: '0 auto' },
  pageHeader: { marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '0.9rem', color: '#6b7280', margin: 0 },
  searchCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  callBtn: {
  display: 'inline-block',
  marginTop: '6px',
  fontSize: '0.75rem',
  color: '#059669',
  textDecoration: 'none',
  fontWeight: '600',
  border: '1px solid #d1fae5',
  padding: '4px 10px',
  borderRadius: '6px',
  background: '#ecfdf5',
},
  form: {},
  formRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '140px' },
  label: { fontSize: '0.8rem', fontWeight: '500', color: '#374151' },
  input: {
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    color: '#111827',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnGroup: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
  searchBtn: {
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  resetBtn: {
    background: 'none',
    color: '#6b7280',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '9px 14px',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
  resultCount: { fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' },
  donorGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  donorCard: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  donorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#fef2f2',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  donorInfo: { flex: 1 },
  donorName: { fontSize: '0.95rem', fontWeight: '600', color: '#111827', margin: '0 0 2px' },
  donorLocation: { fontSize: '0.8rem', color: '#6b7280', margin: 0 },
  badge: {
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    flexShrink: 0,
  },
  emptyState: { textAlign: 'center', padding: '3rem 0', color: '#9ca3af' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  emptyText: { fontSize: '0.9rem' },
};
