// src/views/InformationPage.jsx
import React from 'react';
const { theme } = require('../theme');

// Content for footer pages is kept together so wording and layout remain
// consistent. Each section has a heading and one or more short paragraphs.
const pages = {
  about: {
    eyebrow: 'About the project',
    title: 'Helping you cook more and waste less',
    intro:
      'CheapChomp is a meal-planning web application that helps people discover affordable recipes using ingredients they already have at home.',
    sections: [
      {
        title: 'How it works',
        paragraphs: [
          'Add ingredients to your virtual pantry, search for matching recipes, and review estimated costs before deciding what to cook.',
          'Registered users can keep their experience personal through secure accounts and saved recipe features.'
        ]
      },
      {
        title: 'Why we built it',
        paragraphs: [
          'Food costs and food waste affect many households. CheapChomp was created to make everyday meal decisions simpler, more affordable, and more mindful.'
        ]
      }
    ]
  },
  goals: {
    eyebrow: 'Our goals',
    title: 'A smarter way to plan everyday meals',
    intro:
      'Our goal is to help users make better use of their pantry while reducing unnecessary grocery spending and food waste.',
    sections: [
      {
        title: 'Make meal planning easier',
        paragraphs: [
          'We want recipe discovery to begin with what a user already owns, instead of requiring a completely new shopping list.'
        ]
      },
      {
        title: 'Support realistic budgets',
        paragraphs: [
          'Ingredient price estimates give users more context when comparing recipes and deciding what fits their budget.'
        ]
      },
      {
        title: 'Grow responsibly',
        paragraphs: [
          'Future improvements may include smarter recommendations, stronger pantry tracking, personalized meal plans, and a mobile-friendly experience.'
        ]
      }
    ]
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Your account information matters',
    intro:
      'CheapChomp uses account and application data only to provide features such as authentication, pantry management, and saved recipes.',
    sections: [
      {
        title: 'Information used by the app',
        paragraphs: [
          'Account details may include your email address, profile information, pantry ingredients, and recipes you choose to save.',
          'Passwords are handled by Supabase Authentication and are not stored directly by the CheapChomp frontend.'
        ]
      },
      {
        title: 'Service providers',
        paragraphs: [
          'CheapChomp uses services such as Supabase for authentication and database features and Edamam for recipe information. Requests sent to these services are subject to their own privacy practices.'
        ]
      },
      {
        title: 'Capstone project notice',
        paragraphs: [
          'CheapChomp is currently an educational capstone project. Users should avoid entering sensitive personal information beyond what is required to test the application.'
        ]
      }
    ]
  },
  safety: {
    eyebrow: 'Food safety',
    title: 'Cook with care',
    intro:
      'CheapChomp provides recipe and cost-planning information, but it does not replace professional medical, nutritional, or food-safety advice.',
    sections: [
      {
        title: 'Allergies and dietary needs',
        paragraphs: [
          'Always review the original recipe and ingredient labels before cooking. Recipe results may contain allergens or ingredients that do not meet every dietary requirement.'
        ]
      },
      {
        title: 'Safe preparation',
        paragraphs: [
          'Use appropriate storage, preparation, and cooking temperatures. Discard ingredients that appear spoiled or have been stored unsafely.'
        ]
      },
      {
        title: 'Estimates and external data',
        paragraphs: [
          'Ingredient prices, nutrition details, and recipe information may be estimates or come from third-party services. Confirm important information with the original source.'
        ]
      }
    ]
  },
  credits: {
    eyebrow: 'Credits',
    title: 'The people and tools behind CheapChomp',
    intro:
      'CheapChomp was created as a capstone project by Group 25A, also known as DEVilish.',
    sections: [
      {
        title: 'Project team',
        paragraphs: [
          'The team collaborated on planning, interface design, frontend development, backend services, database integration, testing, and project documentation.'
        ]
      },
      {
        title: 'Technology',
        paragraphs: [
          'The application is built with React and uses Supabase for authentication and database features. Recipe information is supplied by the Edamam Recipe API, and supporting backend services provide ingredient price estimates.'
        ]
      },
      {
        title: 'Thank you',
        paragraphs: [
          'We appreciate the instructors, classmates, testers, and open-source communities who supported the development of this project.'
        ]
      }
    ]
  }
};

function InformationPage({ page, setView }) {
  const content = pages[page] || pages.about;

  const styles = {
    page: { maxWidth: '1000px', margin: '0 auto', padding: '55px 24px 30px' },
    hero: {
      padding: '42px',
      borderRadius: theme.radius.lg,
      background: `linear-gradient(135deg, ${theme.color.primaryLight}, ${theme.color.white})`,
      border: `1px solid ${theme.color.primaryBorder}`,
      boxShadow: theme.shadow.panel
    },
    eyebrow: {
      margin: '0 0 10px',
      color: theme.color.primary,
      fontSize: '0.82em',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    },
    title: { margin: '0 0 16px', color: theme.color.text, fontSize: '2.35em', lineHeight: 1.15 },
    intro: { margin: 0, color: theme.color.textMuted, fontSize: '1.08em', lineHeight: 1.7, maxWidth: '760px' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '28px'
    },
    card: {
      padding: '26px',
      borderRadius: theme.radius.lg,
      background: theme.color.white,
      border: `1px solid ${theme.color.border}`,
      boxShadow: theme.shadow.card
    },
    cardTitle: { margin: '0 0 12px', color: theme.color.primary, fontSize: '1.15em' },
    paragraph: { margin: '0 0 12px', color: theme.color.textMuted, lineHeight: 1.65 },
    backButton: {
      marginTop: '28px',
      padding: '11px 18px',
      borderRadius: theme.radius.sm,
      border: `1px solid ${theme.color.primary}`,
      background: theme.color.white,
      color: theme.color.primary,
      fontWeight: '700',
      cursor: 'pointer'
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.hero}>
        <p style={styles.eyebrow}>{content.eyebrow}</p>
        <h2 style={styles.title}>{content.title}</h2>
        <p style={styles.intro}>{content.intro}</p>
      </div>

      <div style={styles.grid}>
        {content.sections.map((section) => (
          <article key={section.title} style={styles.card} className="bb-card">
            <h3 style={styles.cardTitle}>{section.title}</h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} style={styles.paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={styles.backButton}
        className="bb-btn-outline"
      >
        Back to Home
      </button>
    </section>
  );
}

export default InformationPage;
