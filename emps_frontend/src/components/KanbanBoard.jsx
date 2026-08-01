import React, { useState } from 'react';
import { MessageSquare, Calendar, User, Plus, Edit2, Trash2 } from 'lucide-react';

export const KanbanBoard = ({ 
  tasks = [], 
  projects = [], 
  users = [],
  onStatusChange, 
  onTaskClick,
  onOpenComments, 
  onCreateTask,
  onEditTask,
  onDeleteTask,
  canEdit = true,
  canCreate = true,
  roleTitle = 'Tasks'
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  const columns = [
    { id: 'Pending', title: 'Pending', color: '#d97706', bg: 'rgba(254, 243, 199, 0.5)', border: '#fde68a' },
    { id: 'In Progress', title: 'In Progress', color: '#0284c7', bg: 'rgba(224, 242, 254, 0.5)', border: '#bae6fd' },
    { id: 'Completed', title: 'Completed', color: '#059669', bg: 'rgba(209, 250, 229, 0.5)', border: '#a7f3d0' }
  ];

  // Filtering
  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProjectId === 'ALL' || String(task.projectId) === String(selectedProjectId);
    const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
    const matchesSearch = task.taskTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.taskDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesPriority && matchesSearch;
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'badge badge-urgent';
      case 'high': return 'badge badge-high';
      case 'medium': return 'badge badge-medium';
      default: return 'badge badge-low';
    }
  };

  const getAssigneeName = (userId) => {
    const user = users.find(u => Number(u.userId) === Number(userId));
    return user ? user.fullName : `User #${userId}`;
  };

  const getProjectName = (projId) => {
    const proj = projects.find(p => Number(p.projectId) === Number(projId));
    return proj ? proj.projectName : `Project #${projId}`;
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskIdStr) {
      const taskId = Number(taskIdStr);
      onStatusChange(taskId, columnStatus);
      setDraggedTaskId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Controls / Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', flex: '1 1 300px' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '200px' }}
          />

          <select 
            className="glass-input" 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
            ))}
          </select>

          <select 
            className="glass-input" 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
            ({roleTitle})
          </span>
        </div>

        {canCreate && (
          <button className="gradient-button" onClick={onCreateTask}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Kanban Columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="glass-panel"
              style={{
                backgroundColor: col.bg,
                borderColor: col.border,
                minHeight: '520px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: `1px solid ${col.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col.color }}></span>
                  <h4 style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{col.title}</h4>
                </div>
                <span className="badge" style={{ backgroundColor: '#ffffff', color: col.color, border: `1px solid ${col.border}`, fontSize: '0.8rem', fontWeight: '700' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
                {colTasks.length === 0 ? (
                  <div style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '12px',
                    color: '#94a3b8',
                    fontSize: '0.85rem'
                  }}>
                    No {col.title.toLowerCase()} tasks
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.taskId}
                      draggable={true} // Employees & Managers can drag to update status
                      onDragStart={(e) => handleDragStart(e, task.taskId)}
                      className="glass-panel glass-panel-hover"
                      style={{
                        padding: '1rem',
                        cursor: 'grab',
                        borderLeft: `4px solid ${col.color}`,
                        position: 'relative',
                        background: '#ffffff'
                      }}
                    >
                      {/* Priority and Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className={getPriorityBadgeClass(task.priority)}>
                          {task.priority || 'Medium'}
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => onOpenComments(task)} 
                            title="Task Comments"
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                          >
                            <MessageSquare size={15} />
                          </button>
                          {canEdit && (
                            <>
                              <button 
                                onClick={() => onEditTask(task)} 
                                title="Edit Task"
                                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                              >
                                <Edit2 size={15} />
                              </button>
                              <button 
                                onClick={() => onDeleteTask(task.taskId)} 
                                title="Delete Task"
                                style={{ background: 'transparent', border: 'none', color: '#e11d48', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h5 
                        onClick={() => onTaskClick && onTaskClick(task)}
                        style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem', cursor: 'pointer' }}
                      >
                        {task.taskTitle}
                      </h5>
                      <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.taskDescription}
                      </p>

                      {/* Project Tag */}
                      <div style={{ fontSize: '0.73rem', color: '#4338ca', fontWeight: '600', marginBottom: '0.75rem', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                        {getProjectName(task.projectId)}
                      </div>

                      {/* Footer Details: Assignee & Due Date */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={13} color="#4f46e5" />
                          <span style={{ color: '#0f172a', fontWeight: '600' }}>{getAssigneeName(task.assignedTo)}</span>
                        </div>

                        {task.dueDate && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} color="#64748b" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};