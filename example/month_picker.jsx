import React from 'react';
import { render } from 'react-dom';
import App from '../src/index.app';

render(<App display={false} />, document.getElementById('content'));
