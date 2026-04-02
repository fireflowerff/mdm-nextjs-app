# Technical Reference of using Hooks

### Summary Table for Quick Review

| Hook          | Purpose                      | Does it trigger re-render?  |
| :------------ | :--------------------------- | :-------------------------- |
| `useState`    | Manage data                  | **Yes**                     |
| `useEffect`   | Sync with external systems   | No (it runs _after_ render) |
| `useRef`      | Grab DOM/Store "silent" data | **No**                      |
| `useMemo`     | Cache a value/result         | No                          |
| `useCallback` | Cache a function             | No                          |

---

## 1. useState

**The "Memory" Hook.**
This is how a component remembers things between renders. When you update a state variable, React re-renders the component to show the new data.

- **Usage:** For anything that changes on the screen (form inputs, toggles, data from an API).
- **Example:** `const [count, setCount] = useState(0);`

---

## ??? . `useEffect` (Lifecycle & Synchronization)

**Feature:** Handles "Side Effects" like fetching data when the URL changes or focusing a UI element when a modal opens.

### Code Snippet: Route-based Data Loading

```typescript
useEffect(() => {
  if (routePmtNo && !hasQueryRun.current) {
    hasQueryRun.current = true; // Prevents double-loading
    handleCmdPopOk(routePmtNo);
  }
}, [routePmtNo]);
```

**The "Side Effect" Hook.**
This tells React: "After you finish rendering, run this extra bit of code." It’s for synchronization with systems outside of React.

- **Usage:** Fetching data, setting up subscriptions, or manually changing the DOM.
- **The Dependency Array:** \* `[]`: Runs only once (on mount).
  - `[data]`: Runs every time `data` changes.

---

## ??? . `useReducer` + `useContext` (State Management)

**Feature:** This is the "Central Brain" pattern. It avoids "Prop Drilling" by providing a global state to all child components (Header, Tabs, Modals).

### Code Snippet: The Reducer Pattern

```typescript
// Centralized logic for complex state updates
function ccl10100Reducer(
  state: CCL10100State,
  action: CCL10100Action,
): CCL10100State {
  switch (action.type) {
    case "SET_PAYMENT_FIELD":
      // Immutability: Always spread the old state (...)
      return {
        ...state,
        payment: {
          ...state.payment,
          [action.payload.field]: action.payload.value,
        },
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}
```

---

## ??? . `useCallback` (Performance & Stability)

**Feature:** Memoizes functions to prevent unnecessary re-renders of child components (like `CriteriaBlock`) when the parent state changes.

### Code Snippet: Stable Event Handlers

```typescript
const handleHeaderChange = useCallback(
  (field: keyof PaymentHeader, value: string) => {
    dispatch({ type: "SET_HEADER_FIELD", payload: { field, value } });
  },
  [],
); // Empty array means this function instance never changes
```

---

## ??? . `useRef` (Persistence without Re-render)

**Feature:** Used for two critical purposes:

1. **AbortController:** Canceling "stale" API requests.
2. **Value Peeking:** Accessing the latest state inside a memoized function without making the function a dependency.

### Code Snippet: The Search Guard

```typescript
const criteriaRef = useRef(criteria);
criteriaRef.current = criteria; // Updates every render, but doesn't trigger one

const handleFind = useCallback(async () => {
  const currentCriteria = criteriaRef.current; // Always gets latest values
  // ... execute search logic
}, []);
```

**The "Persistence" Hook.**
A ref is a box that holds a value that stays the same across renders, but **changing it does not trigger a re-render.**

- **Usage:** 1. Accessing a DOM element directly (e.g., focusing an input). 2. Storing a value that you need to keep track of (like a timer ID) without making the UI refresh.

---

## ??? . `useMemo` (Derived State)

**Feature:** Calculates a value based on other state variables and caches it. It only recalculates if the inputs change.

### Code Snippet: Aggregating Errors

```typescript
const validationErrors = useMemo(
  () => ({
    pmt_no: paymentValidation.error,
    cust_no: customerValidation.error,
    // ... other errors
  }),
  [paymentValidation.error, customerValidation.error],
);
```

These two are often confused because they both exist for **performance optimization (memoization).**

| Hook              | What it caches (memoizes)     | Use Case                                                                                        |
| :---------------- | :---------------------------- | :---------------------------------------------------------------------------------------------- |
| **`useMemo`**     | The **result** of a function. | Avoid recalculating expensive math or filtering large arrays on every render.                   |
| **`useCallback`** | The **function itself**.      | Prevent a child component from re-rendering unnecessarily because a function "looks new" to it. |

---
