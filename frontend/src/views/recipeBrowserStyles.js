const recipeBrowserStyles = {
  container: { padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh' },
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  heading: { color: '#333', borderBottom: '2px solid #fff3ee', paddingBottom: '10px', marginBottom: '20px' },
  actionsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '30px', alignItems: 'center' },
  searchForm: { display: 'flex', gap: '10px', flexGrow: 1, maxWidth: '500px' },
  input: {
    padding: '12px',
    fontSize: '1em',
    borderRadius: '6px',
    border: '1px solid #ffbb9e',
    outline: 'none',
    width: '100%'
  },
  button: {
    padding: '12px 24px',
    background: '#ff6b35',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 6px rgba(255, 107, 53, 0.1)'
  },
  getAllButton: {
    padding: '12px 24px',
    background: '#fff3ee',
    color: '#ff6b35',
    border: '2px solid #ff6b35',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  loadingText: { color: '#ff6b35', fontWeight: 'bold', fontSize: '1.1em' },
  errorText: { color: '#d9381e', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: {
    border: '1px solid #fff3ee',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column'
  },
  image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' },
  title: { margin: '14px 0 6px 0', fontSize: '1.25em', color: '#333' },
  source: { margin: '0 0 16px 0', color: '#777', fontSize: '0.9em' },
  link: {
    display: 'block',
    textAlign: 'center',
    marginTop: 'auto',
    padding: '10px',
    background: '#ff6b35',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.95em'
  },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '30px', flexWrap: 'wrap' },
  paginationButton: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: '1px solid #ff6b35',
    backgroundColor: '#fff',
    color: '#ff6b35',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: { color: '#555', fontWeight: 'bold' }
};

module.exports = { recipeBrowserStyles };
