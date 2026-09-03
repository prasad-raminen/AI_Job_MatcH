'use client';

export default function LoadingSpinner({ text = 'Processing...' }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  );
}
