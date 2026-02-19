import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { AnalysisProvider } from './context/AnalysisContext';
import { router } from './routes';

export default function App() {
  return (
    <AnalysisProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AnalysisProvider>
  );
}
