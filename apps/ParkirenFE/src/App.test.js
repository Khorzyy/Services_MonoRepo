import { render } from '@testing-library/react';
import { AppWrapper } from './components/common/PageMeta';
import App from './App';

test('renders the home page', () => {
  render(
    <AppWrapper>
      <App />
    </AppWrapper>
  );
});
