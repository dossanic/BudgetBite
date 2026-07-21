const { theme } = require('../theme');

const recipeDetailsStyles = {
  container: { padding: '30px', backgroundColor: theme.color.background, minHeight: '100vh' },
  contentWrapper: { maxWidth: '800px', margin: '0 auto', width: '100%' },
  backButton: {
    background: 'none',
    border: 'none',
    color: theme.color.primary,
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '20px'
  },
  loadingText: { color: theme.color.primary, fontWeight: 'bold', fontSize: '1.1em' },
  errorText: { color: theme.color.danger, fontWeight: 'bold' },
  panel: {
    backgroundColor: theme.color.white,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
    padding: '28px'
  },
  image: { width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: theme.radius.md },
  title: { margin: '20px 0 6px 0', fontSize: '1.8em', color: theme.color.text },
  source: { margin: '0 0 16px 0', color: theme.color.textMuted, fontSize: '0.95em' },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    background: theme.color.primary,
    color: theme.color.white,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontWeight: 'bold',
    fontSize: '0.95em',
    marginBottom: '20px'
  },
  costSummary: {
    margin: '0 0 20px 0',
    padding: '14px 18px',
    backgroundColor: theme.color.primaryLight,
    border: `1px solid ${theme.color.primaryBorder}`,
    borderRadius: theme.radius.md,
    color: '#d94814',
    fontWeight: 'bold',
    fontSize: '1.05em'
  },
  sectionTitle: { color: theme.color.text, fontSize: '1.3em', margin: '10px 0 12px 0' },
  ingredientList: { listStyle: 'none', margin: 0, padding: 0 },
  ingredientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '10px 0',
    borderBottom: `1px solid ${theme.color.border}`,
    gap: '12px'
  },
  ingredientText: { color: theme.color.text },
  ingredientPrice: { color: theme.color.textMuted, whiteSpace: 'nowrap', fontWeight: '600' }
};

module.exports = { recipeDetailsStyles };
