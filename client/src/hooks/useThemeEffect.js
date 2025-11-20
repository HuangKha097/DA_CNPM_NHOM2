import { useEffect } from 'react';
import { useStore } from '../zustand/store';

export const useThemeEffect = () => {
  const { theme } = useStore();

  useEffect(() => {
    const root = document.body;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
};