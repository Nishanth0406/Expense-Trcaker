import { createRoot } from 'react-dom/client';
import App from './App'; // Fix the import path to match the actual location
import './index.css';

createRoot(document.getElementById("root")).render(<App />);
