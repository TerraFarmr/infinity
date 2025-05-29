import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode, selectMode, setMode, toggleDarkMode } from '../../utils/redux/canvasSlice';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectMode);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Toggle between draw and view modes
  const toggleMode = () => dispatch(setMode(mode === 'view' ? 'draw' : 'view'));

  // Toggle dark/light theme
  const toggleTheme = () => dispatch(toggleDarkMode());

  return (
    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex justify-between items-center">
      <button
        onClick={toggleMode}
        className={`px-4 py-2 text-white border-none rounded ${
          isDarkMode
            ? 'bg-zinc-300 hover:bg-zinc-700 text-zinc-900 hover:text-zinc-300'
            : 'bg-zinc-900 hover:bg-zinc-300 text-zinc-300 hover:text-zinc-900'
        }`}
      >
        {mode === 'draw' ? '⌘+V - Switch to View ' : '⌘+D - Switch to Draw'}
      </button>

      <button onClick={toggleTheme} className="px-4 py-2 border-none rounded">
        {isDarkMode
          ? <SunIcon className="w-5 h-5 text-zinc-300" />
          : <MoonIcon className="w-5 h-5" />
        }
      </button>
    </div>
  );
};

export default Toolbar;
