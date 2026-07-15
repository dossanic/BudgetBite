const { theme } = require('./theme');

const appStyles = {
  loadingContainer: { padding: '50px', textAlign: 'center', color: theme.color.primary },
  savedViewContainer: { padding: '30px' },
  savedViewHeading: { color: theme.color.text, borderBottom: `2px solid ${theme.color.border}`, paddingBottom: '10px' },
  savedViewText: { color: theme.color.textMuted, fontStyle: 'italic', marginTop: '20px' }
};

module.exports = { appStyles };
