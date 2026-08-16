import Counter from './Counter.jsx';

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>React + Vite（Oxc）</h1>
        <Counter />
      </div>
    </main>
  );
}
