export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    accent: string;
    rating: string;
  };
  preview: {
    gradient: string[];
    image: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Classic Red',
    colors: {
      primary: '#ff4757',
      background: '#000000',
      card: '#1a1a1a',
      text: '#ffffff',
      border: '#333333',
      accent: '#ff4757',
      rating: '#ffd700',
    },
    preview: {
      gradient: ['#ff4757', '#ff6b81'],
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60',
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#00bcd4',
      background: '#051b2c',
      card: '#0a2942',
      text: '#ffffff',
      border: '#1a3f5c',
      accent: '#00bcd4',
      rating: '#4dd0e1',
    },
    preview: {
      gradient: ['#00bcd4', '#00acc1'],
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60',
    },
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    colors: {
      primary: '#a855f7',
      background: '#0f172a',
      card: '#1e293b',
      text: '#ffffff',
      border: '#334155',
      accent: '#a855f7',
      rating: '#38bdf8',
    },
    preview: {
      gradient: ['#a855f7', '#38bdf8'],
      image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&auto=format&fit=crop&q=60',
    },
  },
  {
    id: 'sunset',
    name: 'Golden Hour',
    colors: {
      primary: '#f59e0b',
      background: '#27272a',
      card: '#3f3f46',
      text: '#ffffff',
      border: '#52525b',
      accent: '#f59e0b',
      rating: '#fbbf24',
    },
    preview: {
      gradient: ['#f59e0b', '#d97706'],
      image: 'https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&auto=format&fit=crop&q=60',
    },
  },
];