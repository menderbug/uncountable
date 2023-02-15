import { MantineProvider } from '@mantine/core';
import TestComponent from './components/TestComponent';

function App() {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
    <div className="App">
  
     <TestComponent />
     
    </div>
    </MantineProvider>

  );
}

export default App;