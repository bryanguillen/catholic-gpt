import { AppInitializer, Toaster } from '@/components';
import { Home } from '@/pages/home';

const App = () => {
  return (
    <AppInitializer>
      <Home />
      <Toaster />
    </AppInitializer>
  );
};

export default App;
