// Calculate student readiness score based on profile and progress
// Based on profile completion, college list balance, and task completion

// Note: This file doesn't use hooks directly - it's a utility file

export interface ReadinessFactors {
  profileCompletion: number; // 0-100
  collegeListBalance: number; // 0-100 (based on reach/target/safety distribution)
  taskProgress: number; // 0-100 (based on completed tasks)
  hasMatches: boolean;
}

export function calculateReadinessScore(factors: ReadinessFactors): number {
  // Weighted calculation
  const weights = {
    profileCompletion: 0.4,
    collegeListBalance: 0.3,
    taskProgress: 0.2,
    hasMatches: 0.1,
  };

  let score = 0;

  // Profile completion (40%)
  score += factors.profileCompletion * weights.profileCompletion;

  // College list balance (30%)
  score += factors.collegeListBalance * weights.collegeListBalance;

  // Task progress (20%)
  score += factors.taskProgress * weights.taskProgress;

  // Has matches bonus (10%)
  if (factors.hasMatches) {
    score += 10 * weights.hasMatches;
  }

  return Math.round(Math.min(100, Math.max(0, score)));
}

export function calculateCollegeListBalance(
  reachCount: number,
  targetCount: number,
  safetyCount: number
): number {
  const total = reachCount + targetCount + safetyCount;
  if (total === 0) return 0;

  // Ideal distribution: 30% reach, 40% target, 30% safety
  const idealReach = total * 0.3;
  const idealTarget = total * 0.4;
  const idealSafety = total * 0.3;

  // Calculate how close we are to ideal
  const reachDiff = Math.abs(reachCount - idealReach) / idealReach;
  const targetDiff = Math.abs(targetCount - idealTarget) / idealTarget;
  const safetyDiff = Math.abs(safetyCount - idealSafety) / idealSafety;

  // Average difference (lower is better)
  const avgDiff = (reachDiff + targetDiff + safetyDiff) / 3;

  // Convert to score (0-100, where 0 diff = 100 score)
  return Math.round(Math.max(0, 100 - avgDiff * 100));
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  phase?: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'done';
  priority?: 'high' | 'medium' | 'low';
}

export function getNextStep(
  profileCompletion: number,
  collegeCount: number,
  tasks: Task[] = []
): {
  title: string;
  description: string;
  ctaLabel: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
  taskId?: string;
} {
  // Find the next pending task (prioritize high priority, then by due date)
  const pendingTasks = tasks.filter((t) => t.status === 'not_started' || t.status === 'in_progress');
  
  if (pendingTasks.length > 0) {
    // Sort by priority (high first) and then by due date
    const sortedTasks = [...pendingTasks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // If same priority, sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
    
    const nextTask = sortedTasks[0];
    const dueDateText = nextTask.dueDate 
      ? ` Due ${new Date(nextTask.dueDate).toLocaleDateString()}`
      : '';
    
    return {
      title: nextTask.title,
      description: nextTask.description || `Complete this task to stay on track.${dueDateText}`,
      ctaLabel: 'View Task',
      priority: nextTask.priority || 'medium',
      action: () => {
        // Navigate to task - will be handled by component using React Router
        if (typeof window !== 'undefined') {
          const basePath = import.meta.env.PROD ? '/univera' : '';
          window.location.href = `${basePath}/tasks/${nextTask.id}`;
        }
      },
      taskId: nextTask.id,
    };
  }

  // Determine next step based on current state
  if (profileCompletion < 50) {
    return {
      title: 'Complete Your Profile',
      description: 'Add more information about your academics, activities, and preferences to get better college matches.',
      ctaLabel: 'Update Profile',
      priority: 'high',
      action: () => {
        // Navigate to profile - will be handled by component using React Router
        if (typeof window !== 'undefined') {
          const basePath = import.meta.env.PROD ? '/univera' : '';
          window.location.href = `${basePath}/profile`;
        }
      },
    };
  }

  if (collegeCount === 0) {
    return {
      title: 'Explore Colleges',
      description: 'Start exploring colleges that match your profile and build your list.',
      ctaLabel: 'View Colleges',
      priority: 'high',
      action: () => {
        const basePath = import.meta.env.PROD ? '/univera' : '';
        window.location.href = `${basePath}/colleges`;
      },
    };
  }

  if (collegeCount < 5) {
    return {
      title: 'Build Your College List',
      description: 'Add more colleges to your list to have a balanced mix of reach, target, and safety schools.',
      ctaLabel: 'Explore More',
      priority: 'medium',
      action: () => {
        const basePath = import.meta.env.PROD ? '/univera' : '';
        window.location.href = `${basePath}/colleges`;
      },
    };
  }

  if (tasks.length === 0) {
    return {
      title: 'Review Your Timeline',
      description: 'Check out your personalized timeline and tasks to stay on track with applications.',
      ctaLabel: 'View Tasks',
      priority: 'medium',
      action: () => {
        // Navigate to tasks - will be handled by component using React Router
        if (typeof window !== 'undefined') {
          const basePath = import.meta.env.PROD ? '/univera' : '';
          window.location.href = `${basePath}/tasks`;
        }
      },
    };
  }

  return {
    title: 'Keep Making Progress',
    description: "You're doing great! Continue updating your profile and exploring colleges.",
    ctaLabel: 'View Dashboard',
    priority: 'low',
    action: () => {
      // Already on dashboard
    },
  };
}

