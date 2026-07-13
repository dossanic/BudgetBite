const dashboardStyles = {
  container: { padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd', minHeight: '100vh' },
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  heading: { color: '#333', borderBottom: '2px solid #fff3ee', paddingBottom: '10px' },
  loadingText: { color: '#ff6b35', fontWeight: 'bold', fontSize: '1.1em' },
  errorText: { color: '#d9381e', fontWeight: 'bold' },
  gridSection: { marginTop: '40px' },
  gridTitle: { color: '#222', fontSize: '1.5em', marginBottom: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: {
    border: '1px solid #fff3ee',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s'
  },
  image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' },
  recipeTitle: { margin: '14px 0 6px 0', fontSize: '1.25em', color: '#333' },
  recipeSource: { margin: '0 0 16px 0', color: '#777', fontSize: '0.9em' },
  recipeLink: {
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
  placeholder: { color: '#888', marginTop: '25px', fontStyle: 'italic' }
};

module.exports = { dashboardStyles };
