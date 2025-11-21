import { useNavigate } from 'react-router-dom';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTasksStore } from '@/stores/tasksStore';
import './TasksScreen.css';

export const TasksScreen = () => {
  const navigate = useNavigate();
  const { tasks, getTasksByPhase } = useTasksStore();

  // Group tasks by phase
  const phases = Array.from(new Set(tasks.map((t) => t.phase))).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'var(--color-success)';
      case 'in_progress':
        return 'var(--color-primary)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done':
        return 'Done';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  return (
    <ScreenContainer className="tasks-screen" data-page="tasks-list">
      <div className="tasks-screen__content">
        <div className="tasks-screen__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="tasks-screen__back-button"
          >
            ← Dashboard
          </Button>
          <h1 className="tasks-screen__title">Tasks & Timeline</h1>
        </div>

        {tasks.length === 0 ? (
          <Card className="tasks-screen__empty">
            <p className="tasks-screen__empty-text">
              Your personalized timeline is being prepared. Check back soon!
            </p>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="tasks-screen__phases">
            {phases.map((phase) => {
              const phaseTasks = getTasksByPhase(phase);
              return (
                <div key={phase} className="tasks-screen__phase">
                  <h2 className="tasks-screen__phase-title">{phase}</h2>
                  <div className="tasks-screen__tasks-list">
                    {phaseTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="tasks-screen__task-card"
                        interactive
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        <div className="tasks-screen__task-header">
                          <h3 className="tasks-screen__task-title">{task.title}</h3>
                          <span
                            className="tasks-screen__task-status"
                            style={{ color: getStatusColor(task.status) }}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                        {task.description && (
                          <p className="tasks-screen__task-description">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <p className="tasks-screen__task-due-date">Due: {task.dueDate}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
};

