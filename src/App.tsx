import { MantineProvider, Button } from "@mantine/core";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}withGlobalStyles withNormalizeCSS>
      <div className="App">
        <TestComponent />
      </div>
    </MantineProvider>
  );
}

export default App;
