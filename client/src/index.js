import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { TokenProvider } from './context/TokenProvider';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<TokenProvider>
			<App />
		</TokenProvider>
	</React.StrictMode>,
);
