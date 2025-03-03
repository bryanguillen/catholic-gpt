import { AppInitializer, Toaster } from '@/components';
import { Home } from '@/pages/home';

const App = () => {
  return (
    <>
      <Toaster closeButton />
      <AppInitializer>
        <Home />
      </AppInitializer>
    </>
  );
};

export default App;
