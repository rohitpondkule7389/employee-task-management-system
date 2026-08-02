import React, { useState, useEffect } from 'react';
import { X, Calendar, User, CheckSquare, MessageSquare, Send, Trash2, Edit2, Clock, AlertCircle } from 'lucide-react';
import { fetchTaskComments, createComment, deleteComment, getUserName } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const TaskDetailsModal = ({ task, isOpen, onClose, projects = [], employees = [], onEditTask, onDeleteTask }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (task) {
      loadComments();
    }
  }, [task]);

  const loadComments = async () => {
    if (!task) return;
    setLoadingComments(true);
    try {
      const data = await fetchTaskComments(task.taskId);
      setComments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !task) return;

    try {
      const currentUserName = user ? user.fullName : 'Current User';
      const created = await createComment(
        task.taskId,
        user ? user.userId : 1,
        newCommentText,
        currentUserName
      );
      setComments(prev => [...prev, created]);
      setNewCommentText('');
      loadComments(); // Auto refresh conversation
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.commentId !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !task) return null;

  const project = projects.find(p => Number(p.projectId) === Number(task.projectId));
  const assigneeName = getUserName(task.assignedTo);
  const managerName = getUserName(task.assignedBy);

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'badge badge-urgent';
      case 'high': return 'badge badge-high';
      case 'medium': return 'badge badge-medium';
      default: return 'badge badge-low';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge badge-completed';
      case 'in progress': return 'badge badge-inprogress';
      default: return 'badge badge-pending';
    }
  };

  const canManage = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="modal-backdrop">
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          borderRadius: '20px'
        }}
      >
        {/* Modal Top Header */}
        <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={getStatusBadgeClass(task.status)}>{task.status}</span>
            <span className={getPriorityBadgeClass(task.priority)}>{task.priority} Priority</span>
            <span style={{ fontSize: '0.8rem', color: '#4338ca', fontWeight: '700', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>
              {project ? project.projectName : `Project #${task.projectId}`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canManage && (
              <>
                <button
                  onClick={() => { onClose(); onEditTask(task); }}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit2 size={14} /> Edit Task
                </button>
                <button
                  onClick={() => { onClose(); onDeleteTask(task.taskId); }}
                  style={{ background: '#ffe4e6', border: '1px solid #fecdd3', color: '#be123c', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Main Body (Split View) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflowY: 'auto' }}>
          {/* Left Details Panel */}
          <div style={{ padding: '1.5rem 1.75rem', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.3', marginBottom: '0.5rem' }}>
                {task.taskTitle}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                {task.taskDescription || 'No description provided.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#4f46e5" /> Assigned Employee:
                </span>
                <strong style={{ color: '#0f172a' }}>{assigneeName}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#0284c7" /> Assigned By Manager:
                </span>
                <strong style={{ color: '#0f172a' }}>{managerName}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#059669" /> Start Date:
                </span>
                <strong style={{ color: '#0f172a' }}>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#d97706" /> Due Date:
                </span>
                <strong style={{ color: '#b45309' }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</strong>
              </div>
            </div>
          </div>

          {/* Right Panel: Jira-Style Conversation & Comments */}
          <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <MessageSquare size={18} color="#4f46e5" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>Team Discussion & Comments</h4>
            </div>

            {/* Conversation Log */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.5rem', minHeight: '260px' }}>
              {loadingComments ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading conversation...</p>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                  <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '6px' }} />
                  <p style={{ fontSize: '0.85rem' }}>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                comments.map(c => {
                  const authorName = c.userName || getUserName(c.userId);
                  const isMe = user?.userId === c.userId;
                  return (
                    <div 
                      key={c.commentId}
                      style={{
                        background: isMe ? '#e0e7ff' : '#f8fafc',
                        border: `1px solid ${isMe ? '#c7d2fe' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '90%'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <strong style={{ fontSize: '0.8rem', color: isMe ? '#3730a3' : '#0f172a' }}>{authorName}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                          {(user?.userId === c.userId || user?.role === 'Admin') && (
                            <button 
                              onClick={() => handleDeleteComment(c.commentId)}
                              style={{ background: 'transparent', border: 'none', color: '#e11d48', cursor: 'pointer', padding: 0 }}
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
                        {c.commentText}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', marginTop: 'auto', borderTop: '1px solid #e2e8f0' }}>
              <input
                type="text"
                className="glass-input"
                placeholder="Type your message..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="gradient-button">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
