import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTasksStore } from '@/stores/tasksStore';
import './TaskDetailScreen.css';

export const TaskDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { tasks, updateTaskStatus } = useTasksStore();

  const task = tasks.find((t) => t.id === id);

  useEffect(() => {
    if (!task && tasks.length > 0) {
      // Task not found, redirect back
      navigate('/tasks');
    }
  }, [task, tasks.length, navigate]);

  if (!task) {
    return (
      <ScreenContainer data-page="task-detail-error">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Task not found</p>
          <Button variant="primary" onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
        </div>
      </ScreenContainer>
    );
  }

  const handleStatusChange = (newStatus: 'not_started' | 'in_progress' | 'done') => {
    updateTaskStatus(task.id, newStatus);
  };

  return (
    <ScreenContainer className="task-detail-screen" data-page="task-detail">
      <div className="task-detail-screen__content">
        <div className="task-detail-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/tasks')}
            className="task-detail-screen__back-button"
          >
            ← Back
          </Button>
        </div>

        <Card className="task-detail-screen__card">
          <div className="task-detail-screen__header-section">
            <h1 className="task-detail-screen__title">{task.title}</h1>
            <span
              className="task-detail-screen__phase-badge"
              style={{ backgroundColor: 'var(--color-surface-hover)' }}
            >
              {task.phase}
            </span>
          </div>

          {task.description && (
            <div className="task-detail-screen__description-section">
              <h2 className="task-detail-screen__section-title">Description</h2>
              <p className="task-detail-screen__description">{task.description}</p>
            </div>
          )}

          {task.dueDate && (
            <div className="task-detail-screen__due-date-section">
              <h2 className="task-detail-screen__section-title">Due Date</h2>
              <p className="task-detail-screen__due-date">{task.dueDate}</p>
            </div>
          )}

          <div className="task-detail-screen__status-section">
            <h2 className="task-detail-screen__section-title">Status</h2>
            <div className="task-detail-screen__status-buttons">
              <Button
                variant={task.status === 'not_started' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange('not_started')}
                className="task-detail-screen__status-button"
              >
                Not Started
              </Button>
              <Button
                variant={task.status === 'in_progress' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange('in_progress')}
                className="task-detail-screen__status-button"
              >
                In Progress
              </Button>
              <Button
                variant={task.status === 'done' ? 'primary' : 'secondary'}
                onClick={() => handleStatusChange('done')}
                className="task-detail-screen__status-button"
              >
                Done
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ScreenContainer>
  );
};

