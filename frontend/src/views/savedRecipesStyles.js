const { theme } = require('../theme');

const savedRecipesStyles = {
  container: { padding: '30px', minHeight: '100vh' },
  contentWrapper: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
  heading: { color: theme.color.text, borderBottom: `2px solid ${theme.color.border}`, paddingBottom: '10px', marginBottom: '20px' },
  subtitle: { color: theme.color.textMuted, fontSize: '1.05em', lineHeight: '1.5', maxWidth: '640px', margin: '0 0 25px 0' },
  loadingText: { color: theme.color.primary, fontWeight: 'bold', fontSize: '1.1em' },
  errorText: { color: theme.color.danger, fontWeight: 'bold' },
  empty: {
    color: theme.color.textFaint,
    textAlign: 'center',
    padding: '40px 20px',
    border: `1px dashed ${theme.color.primaryBorder}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.primaryLight,
    fontStyle: 'italic'
  },
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
  recipeTitle: { margin: '14px 0 6px 0', fontSize: '1.25em', color: theme.color.text },
  recipeSource: { margin: '0 0 16px 0', color: theme.color.textMuted, fontSize: '0.9em' },
  recipeLink: {
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
  }
};

module.exports = { savedRecipesStyles };
