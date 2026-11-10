import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { sendNotification } from '../services/api';

const SendNotification = ({ token }) => {
  const [recipientId] = useState(2); // Regular user ID 2 as per requirement
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, text: '' });

  const predefinedTemplates = [
    'System maintenance scheduled for tonight at 23:00 UTC.',
    'Your account profile was reviewed and approved successfully.',
    'Reminder: Please submit your weekly progress report.',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setFeedback({ type: 'error', text: 'Notification message cannot be empty.' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: null, text: '' });

    try {
      await sendNotification(recipientId, message.trim(), token);
      setFeedback({
        type: 'success',
        text: `Private notification delivered to User ID ${recipientId} via WebSocket room user:${recipientId}`,
      });
      setMessage('');
    } catch (err) {
      const errDetail =
        err.response?.data?.message || err.message || 'Failed to dispatch notification';
      setFeedback({
        type: 'error',
        text: errDetail,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card send-card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Send Private Notification</h2>
          <p className="card-subtitle">
            Targeted real-time WebSocket dispatch to User ID <strong>{recipientId}</strong>
          </p>
        </div>
        <span className="badge badge-admin">Admin Feature</span>
      </div>

      <form onSubmit={handleSubmit} className="send-form">
        <div className="form-group">
          <label className="form-label" htmlFor="recipient-display">
            Target Recipient
          </label>
          <div className="recipient-input-wrapper">
            <input
              id="recipient-display"
              type="text"
              value={`User ID: ${recipientId} (user@example.com)`}
              disabled
              className="input-disabled"
            />
          </div>
          <p className="field-hint">
            The backend router directs this directly to room <code>{`user:${recipientId}`}</code>.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="notification-message">
            Notification Message
          </label>
          <textarea
            id="notification-message"
            className="input-textarea"
            rows={3}
            placeholder="Type a real-time message to send to the user..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (feedback.type) setFeedback({ type: null, text: '' });
            }}
            disabled={isLoading}
          />
        </div>

        <div className="templates-row">
          <span className="templates-label">
            <Sparkles size={13} /> Quick templates:
          </span>
          <div className="templates-chips">
            {predefinedTemplates.map((tpl, idx) => (
              <button
                key={idx}
                type="button"
                className="chip-btn"
                onClick={() => setMessage(tpl)}
                disabled={isLoading}
              >
                Template {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {feedback.text && (
          <div className={`feedback-alert alert-${feedback.type}`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} className="feedback-icon" />
            ) : (
              <AlertCircle size={16} className="feedback-icon" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Emitting to WebSocket...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Private Notification</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendNotification;
