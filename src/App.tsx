import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Page } from './pages/base/Page';
import { HomePage } from './pages/home/HomePage';
import { VisualizerPage } from './pages/visualizer/VisualizerPage';
import { useStore } from './store';

export function App(): JSX.Element {
  const theme = useStore(state => state.theme);
  const preferredColorScheme = useColorScheme();

  const colorScheme = theme === 'system' ? preferredColorScheme : theme;

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
      <BrowserRouter basename="/imc-prosperity-visualizer/">
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
