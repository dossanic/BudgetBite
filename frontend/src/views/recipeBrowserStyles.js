const { theme } = require('../theme');

const recipeBrowserStyles = {
  container: { padding: '30px', minHeight: '100vh' },
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  heading: { color: theme.color.text, borderBottom: `2px solid ${theme.color.border}`, paddingBottom: '10px', marginBottom: '20px' },
  actionsRow: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '30px', alignItems: 'center' },
  searchForm: { display: 'flex', gap: '10px', flexGrow: 1, maxWidth: '500px' },
  input: {
    padding: '12px',
    fontSize: '1em',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.color.primaryBorder}`,
    outline: 'none',
    width: '100%'
  },
  button: {
    padding: '12px 24px',
    background: theme.color.primary,
    color: theme.color.white,
    border: 'none',
    borderRadius: theme.radius.sm,
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: theme.shadow.button
  },
  loadingText: { color: theme.color.primary, fontWeight: 'bold', fontSize: '1.1em' },
  errorText: { color: theme.color.danger, fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: {
    position: 'relative',
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.lg,
    padding: '16px',
    backgroundColor: theme.color.white,
    boxShadow: theme.shadow.card,
    display: 'flex',
    flexDirection: 'column'
  },
  image: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: theme.radius.md },
  title: { margin: '14px 0 6px 0', fontSize: '1.25em', color: theme.color.text },
  source: { margin: '0 0 16px 0', color: theme.color.textMuted, fontSize: '0.9em' },
  link: {
    display: 'block',
    textAlign: 'center',
    marginTop: 'auto',
    padding: '10px',
    background: theme.color.primary,
    color: theme.color.white,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontWeight: 'bold',
    fontSize: '0.95em'
  },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '30px', flexWrap: 'wrap' },
  paginationButton: {
    padding: '10px 16px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.color.primary}`,
    backgroundColor: theme.color.white,
    color: theme.color.primary,
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
