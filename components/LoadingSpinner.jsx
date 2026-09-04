'use client';

export default function LoadingSpinner({ text = 'Processing...' }) {
  return (
    <div className="spinner-overlay">
      <div className="orbital-spinner">
        <div className="orbital-dot" />
        <div className="orbital-dot" />
        <div className="orbital-dot" />
      </div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}
