import React, { useState, useEffect } from 'react';
import { X, Send, Trash2, MessageSquare, User } from 'lucide-react';
import { fetchTaskComments, createComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CommentsDrawer = ({ task, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (task) {
      loadComments();
    }
  }, [task]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await fetchTaskComments(task.taskId);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const created = await createComment(
        task.taskId,
        user ? user.userId : 1,
        newComment,
        user ? user.fullName : 'Current User'
      );
      setComments(prev => [...prev, created]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.commentId !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) return null;

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <MessageSquare size={18} color="#4f46e5" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' }}>Task Discussion</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{task.taskTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Comment List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading comments...</p>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
              <p style={{ fontSize: '0.9rem' }}>No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map(c => (
              <div 
                key={c.commentId}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} color="#4f46e5" />
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{c.userName || `User #${c.userId}`}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                    {(user?.userId === c.userId || user?.role === 'Admin') && (
                      <button 
                        onClick={() => handleDelete(c.commentId)}
                        style={{ background: 'transparent', border: 'none', color: '#e11d48', cursor: 'pointer' }}
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.4' }}>
                  {c.commentText}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Type your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="gradient-button">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
