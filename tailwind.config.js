/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grafana theme colors - using actual values for Tailwind generation
        grafana: {
          primary: '#007acc',
          secondary: '#6c757d',
          error: '#d44a3a',
          warning: '#f2cc0c',
          success: '#299c46',
          background: {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            tertiary: '#e9ecef',
          },
          text: {
            primary: '#212529',
            secondary: '#6c757d',
          },
          border: '#dee2e6',
        },
      },
      borderRadius: {
        grafana: '8px',
      },
      fontSize: {
        xs: '10px',
        sm: '11px',
        base: '12px',
        lg: '14px',
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        'grafana-light': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'grafana-medium': '0 2px 6px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
