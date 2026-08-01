import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Search, Plus, Calendar, User, Eye, CheckSquare } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { fetchTasks, fetchEmployeeTasks, fetchProjects, fetchEmployees, createTask, updateTask, updateTaskStatus, deleteTask, getUserName } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'kanban' or 'table'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes] = await Promise.all([
        fetchProjects(),
        fetchEmployees()
      ]);
      setProjects(pRes);
      setEmployees(eRes);

      if (user?.role === 'Admin') {
        const allTasks = await fetchTasks();
        setTasks(allTasks);
      } else if (user?.role === 'Manager') {
        const allTasks = await fetchTasks();
        const managedProjIds = pRes.filter(p => Number(p.managerId) === Number(user.userId)).map(p => Number(p.projectId));
        const managerTasks = allTasks.filter(t => managedProjIds.includes(Number(t.projectId)) || Number(t.assignedBy) === Number(user.userId));
        setTasks(managerTasks);
      } else if (user?.role === 'Employee') {
        const myTasks = await fetchEmployeeTasks(user.userId);
        setTasks(myTasks);
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error(err);
      loadData();
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.taskId, taskData);
    } else {
      await createTask(taskData);
    }
    loadData();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.taskId !== taskId));
    }
  };

  const getProjectName = (projId) => {
    const proj = projects.find(p => Number(p.projectId) === Number(projId));
    return proj ? proj.projectName : `Project #${projId}`;
  };

  // Filtered Tasks for Table View
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.taskTitle?.toLowerCase().includes(search.toLowerCase()) || t.taskDescription?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    const matchesProject = selectedProject === 'ALL' || String(t.projectId) === String(selectedProject);
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const canCreateTask = user?.role === 'Manager' || user?.role === 'Admin';
  const canEditTaskDetails = user?.role === 'Manager' || user?.role === 'Admin';

  if (loading) {
    return <div style={{ color: '#64748b', padding: '2rem' }}>Loading Tasks...</div>;
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Controls Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* View Toggle */}
          <div style={{ background: '#f1f5f9', padding: '3px', borderRadius: '10px', display: 'flex', gap: '2px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                color: viewMode === 'kanban' ? '#4f46e5' : '#64748b',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'kanban' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <LayoutGrid size={15} /> Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#4f46e5' : '#64748b',
                fontWeight: '700',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'table' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <List size={15} /> Table List
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              style={{ width: '180px', paddingLeft: '2.2rem' }}
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select className="glass-input" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select className="glass-input" value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select className="glass-input" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
            ))}
          </select>
        </div>

        {canCreateTask && (
          <button className="gradient-button" onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          projects={projects}
          users={employees}
          onStatusChange={handleStatusChange}
          onOpenComments={(task) => setSelectedTaskDetails(task)}
          onTaskClick={(task) => setSelectedTaskDetails(task)}
          onCreateTask={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
          onEditTask={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
          onDeleteTask={handleDeleteTask}
          canEdit={canEditTaskDetails}
          canCreate={canCreateTask}
          roleTitle={user?.role === 'Employee' ? 'My Assigned Tasks' : user?.role === 'Manager' ? 'Managed Tasks' : 'All Enterprise Tasks'}
        />
      ) : (
        /* Professional Table View */
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto', background: '#ffffff' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckSquare size={36} style={{ opacity: 0.3, marginBottom: '6px' }} />
              <p>No tasks found matching current filters.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Task Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Project</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Assigned Employee</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.taskId} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setSelectedTaskDetails(task)}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0f172a' }}>{task.taskTitle}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#4338ca', fontWeight: '600' }}>{getProjectName(task.projectId)}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#0f172a', fontWeight: '600' }}>{getUserName(task.assignedTo)}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge badge-${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'inprogress' : 'pending'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge badge-${task.priority?.toLowerCase() === 'urgent' ? 'urgent' : task.priority?.toLowerCase() === 'high' ? 'high' : 'medium'}`}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedTaskDetails(task)}
                        style={{ background: '#e0e7ff', border: '1px solid #c7d2fe', color: '#4338ca', borderRadius: '6px', padding: '4px 8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> Open Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        projects={projects.filter(p => user?.role === 'Admin' || Number(p.managerId) === Number(user?.userId))}
        employees={employees}
        initialData={editingTask}
      />

      {/* Jira/Trello Style Complete Task Details Screen */}
      <TaskDetailsModal
        task={selectedTaskDetails}
        isOpen={Boolean(selectedTaskDetails)}
        onClose={() => setSelectedTaskDetails(null)}
        projects={projects}
        employees={employees}
        onEditTask={(task) => { setEditingTask(task); setIsTaskModalOpen(true); }}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};