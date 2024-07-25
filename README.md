# Proxzy

Proxzy is a fully typed simple state management library that uses the Proxy API to manage the state of your application.

## Installation

```bash
npm install proxzy
```

## Usage

The `proxzy` function takes an object as an argument and returns a Proxy object.
That object can be used to access the state of your application.

When accessing an object inside the state, you can modify its properties directly and the state will be updated automatically.

```typescript
import { proxzy } from 'proxzy';

const state = proxzy({
  user: {
    name: 'John Doe',
    age: 25,
  },
});

const user = state.user;

user.name = 'Not Jane Doe';

console.log(state.user.name); // Not Jane Doe
```

### Using with React

To make the state reactive, you can use the `useSnapshot` hook to subscribe to the state and update the component when
the state changes.

```tsx
import { useSnapshot } from 'proxzy';

const state = proxzy({
  count: 0,
});

function Counter() {
  const snap = useSnapshot(state);

  return (
    <div>
      <h1>{snap.count}</h1>
      <button onClick={() => snap.count++}>Increment</button>
    </div>
  );
}
```

The `useSnapshot` hook can also be used to make parts of the state reactive.

```tsx
import { useSnapshot } from 'proxzy';

const state = proxzy({
  user: {
    name: 'John Doe',
    age: 25,
  },
});

function User() {
  const snap = useSnapshot(state.user);

  return (
    <div>
      <h1>{snap.name}</h1>
      <button onClick={() => (snap.name = 'Not Jane Doe')}>Change Name</button>
    </div>
  );
}
```
