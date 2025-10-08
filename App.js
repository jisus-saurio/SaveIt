import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation/Navegation';

export default function App() {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}