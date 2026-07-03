import { Spinner as BSSpinner } from 'react-bootstrap';

const Spinner = ({ fullPage = false, text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <BSSpinner animation="border" variant="primary" style={{ width: 48, height: 48 }} />
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{text}</p>
      </div>
    );
  }
  return (
    <div className="tb-spinner-wrapper">
      <BSSpinner animation="border" variant="primary" />
    </div>
  );
};

export default Spinner;
