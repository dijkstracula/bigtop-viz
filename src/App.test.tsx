import React from 'react';
import ReactDOM from 'react-dom';

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/bigtop/i);
  expect(linkElement.length).toBeGreaterThan(0);
  expect(linkElement[0]).toBeInTheDocument();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

