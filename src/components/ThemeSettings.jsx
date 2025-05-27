import { useState } from 'react';

const THEME_COLORS = [
  { sidebar: 'bg-blue-200', title: 'bg-blue-900' },
  { sidebar: 'bg-green-200', title: 'bg-green-900' },
  { sidebar: 'bg-purple-200', title: 'bg-purple-900' },
  { sidebar: 'bg-red-200', title: 'bg-red-900' },
  { sidebar: 'bg-yellow-200', title: 'bg-yellow-900' },
  { sidebar: 'bg-indigo-200', title: 'bg-indigo-900' },
  { sidebar: 'bg-gray-200', title: 'bg-gray-900' },
];

export default function ThemeSettings({ onThemeChange }) {
  const [selectedTheme, setSelectedTheme] = useState(THEME_COLORS[0]);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    onThemeChange(theme);
  };

  return (
    <div className=" px-4 py-3 border-b">
      <h3 className="text-sm font-medium text-gray-600 mb-2">Theme Colors</h3>
      <div className=" flex flex-wrap gap-2">
        {THEME_COLORS.map((theme, index) => (
          <button
            key={index}
            className={`w-8 h-8 rounded-lg border-2 duration-500 drop-shadow-2xl ${theme.sidebar} ${
              selectedTheme === theme ? 'border-gray-500' : 'border-transparent'
            }`}
            onClick={() => handleThemeChange(theme)}
          />
        ))}
      </div>
    </div>
  );
}