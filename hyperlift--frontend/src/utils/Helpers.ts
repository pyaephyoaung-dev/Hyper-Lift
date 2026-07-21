export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getUser = (): any | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getUser();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN';
};

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

export interface PasswordStrength {
  score: number; 
  level: PasswordStrengthLevel;
  label: string;
  color: string;
}

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, level: 'weak', label: '', color: 'bg-gray-700' };
  }

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return { score: 1, level: 'weak', label: 'Weak', color: 'bg-red-500' };
  }
  if (score <= 2) {
    return { score: 2, level: 'medium', label: 'Medium', color: 'bg-yellow-500' };
  }
  return { score: 3, level: 'strong', label: 'Strong', color: 'bg-green-500' };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-orange-100 text-orange-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getMuscleGroupColor = (group: string): string => {
  const colors: Record<string, string> = {
    chest: 'bg-blue-100 text-blue-800',
    back: 'bg-purple-100 text-purple-800',
    shoulders: 'bg-indigo-100 text-indigo-800',
    biceps: 'bg-pink-100 text-pink-800',
    triceps: 'bg-rose-100 text-rose-800',
    legs: 'bg-emerald-100 text-emerald-800',
    quadriceps: 'bg-teal-100 text-teal-800',
    hamstrings: 'bg-cyan-100 text-cyan-800',
    glutes: 'bg-lime-100 text-lime-800',
    calves: 'bg-amber-100 text-amber-800',
    abs: 'bg-orange-100 text-orange-800',
    core: 'bg-yellow-100 text-yellow-800',
    'full body': 'bg-violet-100 text-violet-800',
  };
  return colors[group?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
