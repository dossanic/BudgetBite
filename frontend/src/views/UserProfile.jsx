// src/views/UserProfile.jsx
import React, { useEffect, useState } from 'react';
const { supabase } = require('../services/supabaseClient');
const { theme } = require('../theme');

// Account details page for the currently authenticated Supabase user.
function UserProfile({ user }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [createdAt, setCreatedAt] = useState(user?.created_at || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uiError, setUiError] = useState(null);
  const [uiSuccess, setUiSuccess] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setUiError(null);

      // Profile fields live in public.users; login email remains owned by Auth.
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setUiError(`Could not load profile: ${error.message}`);
      }

      const metadata = user.user_metadata || {};
      const legacyNameParts = (data?.name || metadata.name || '').trim().split(/\s+/);

      setFirstName(data?.first_name || metadata.first_name || legacyNameParts[0] || '');
      setLastName(
        data?.last_name || metadata.last_name || legacyNameParts.slice(1).join(' ') || ''
      );
      setCreatedAt(data?.created_at || user.created_at || '');
      setLoading(false);
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setUiError(null);
    setUiSuccess(null);

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!cleanFirstName || !cleanLastName) {
      setUiError('First name and last name are required.');
      return;
    }

    setSaving(true);

    // Keep Auth metadata current so the header can immediately use the name.
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        first_name: cleanFirstName,
        last_name: cleanLastName,
        name: `${cleanFirstName} ${cleanLastName}`
      }
    });

    if (authError) {
      setUiError(`Could not update account details: ${authError.message}`);
      setSaving(false);
      return;
    }

    // Upsert supports both existing accounts and accounts created before the
    // public.users trigger was installed.
    const { data, error: profileError } = await supabase
      .from('users')
      .upsert(
        {
          user_id: user.id,
          first_name: cleanFirstName,
          last_name: cleanLastName,
          name: `${cleanFirstName} ${cleanLastName}`,
          email: user.email
        },
        { onConflict: 'user_id' }
      )
      .select('created_at')
      .single();

    if (profileError) {
      setUiError(
        `Your login profile was updated, but the database profile could not be saved: ${profileError.message}`
      );
    } else {
      setFirstName(cleanFirstName);
      setLastName(cleanLastName);
      setCreatedAt(data?.created_at || createdAt);
      setUiSuccess('Profile details saved successfully.');
    }

    setSaving(false);
  }

  const styles = {
    wrapper: { maxWidth: '760px', margin: '0 auto', padding: '40px 20px 60px' },
    heading: { margin: '0 0 8px', color: theme.color.text, fontSize: '2em' },
    intro: { margin: '0 0 24px', color: theme.color.textMuted },
    card: {
      background: theme.color.white,
      border: `1px solid ${theme.color.border}`,
      borderRadius: theme.radius.lg,
      boxShadow: theme.shadow.panel,
      overflow: 'hidden'
    },
    section: { padding: '28px', borderBottom: `1px solid ${theme.color.border}` },
    sectionTitle: { margin: '0 0 20px', color: theme.color.primary, fontSize: '1.2em' },
    row: { display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', marginBottom: '18px' },
    label: { color: theme.color.text, fontWeight: '700', paddingTop: '11px' },
    input: {
      width: '100%',
      padding: '11px 12px',
      border: `1px solid ${theme.color.primaryBorder}`,
      borderRadius: theme.radius.sm,
      background: theme.color.inputBg,
      fontSize: '1em'
    },
    readOnly: {
      padding: '11px 12px',
      border: `1px solid ${theme.color.border}`,
      borderRadius: theme.radius.sm,
      background: '#f5f5f5',
      color: theme.color.textMuted,
      overflowWrap: 'anywhere'
    },
    hint: { margin: '7px 0 0', color: theme.color.textFaint, fontSize: '0.85em' },
    actions: { padding: '22px 28px', display: 'flex', justifyContent: 'flex-end' },
    button: {
      padding: '11px 20px',
      border: 'none',
      borderRadius: theme.radius.sm,
      background: theme.color.primary,
      color: theme.color.white,
      fontWeight: '700',
      cursor: saving ? 'not-allowed' : 'pointer',
      opacity: saving ? 0.7 : 1
    },
    message: { padding: '12px', borderRadius: theme.radius.sm, marginBottom: '18px' },
    loading: { padding: '50px', textAlign: 'center', color: theme.color.textMuted }
  };

  if (loading) {
    return <div style={styles.loading}>Loading account details...</div>;
  }

  return (
    <section style={styles.wrapper}>
      <h2 style={styles.heading}>Account Details</h2>
      <p style={styles.intro}>Review and update the personal details connected to your account.</p>

      {uiError && (
        <div style={{ ...styles.message, color: theme.color.danger, background: theme.color.dangerBg }}>
          {uiError}
        </div>
      )}
      {uiSuccess && (
        <div style={{ ...styles.message, color: theme.color.success, background: theme.color.successBg }}>
          {uiSuccess}
        </div>
      )}

      <form onSubmit={handleSave} style={styles.card}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal information</h3>

          <div style={styles.row}>
            <label htmlFor="profile-first-name" style={styles.label}>First name</label>
            <input
              id="profile-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={styles.input}
              className="bb-input"
              autoComplete="given-name"
              required
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="profile-last-name" style={styles.label}>Last name</label>
            <input
              id="profile-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={styles.input}
              className="bb-input"
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Account information</h3>

          <div style={styles.row}>
            <span style={styles.label}>Login email</span>
            <div>
              <div style={styles.readOnly}>{user.email}</div>
              <p style={styles.hint}>
                This email is managed securely by Supabase Authentication and is separate from editable profile fields.
              </p>
            </div>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Member since</span>
            <div style={styles.readOnly}>
              {createdAt ? new Date(createdAt).toLocaleDateString() : 'Not available'}
            </div>
          </div>

          <div style={{ ...styles.row, marginBottom: 0 }}>
            <span style={styles.label}>Account ID</span>
            <div style={styles.readOnly}>{user.id}</div>
          </div>
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.button} className="bb-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default UserProfile;
