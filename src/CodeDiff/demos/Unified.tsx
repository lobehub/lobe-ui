import { CodeDiff } from '../CodeDiff';

const oldCode = `import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

export default App;`;

const newCode = `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;`;

export default () => {
  return (
    <CodeDiff
      fileName="App.tsx"
      language="tsx"
      newContent={newCode}
      oldContent={oldCode}
      viewMode="unified"
    />
  );
};
