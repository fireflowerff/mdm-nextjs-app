# Technical Reference of using Hooks

## 1. `useReducer` + `useContext` (State Management)

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

## 2. `useCallback` (Performance & Stability)

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

## 3. `useRef` (Persistence without Re-render)

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

## 4. `useEffect` (Lifecycle & Synchronization)

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

### 2. useEffect

**The "Side Effect" Hook.**
This tells React: "After you finish rendering, run this extra bit of code." It’s for synchronization with systems outside of React.

- **Usage:** Fetching data, setting up subscriptions, or manually changing the DOM.
- **The Dependency Array:** \* `[]`: Runs only once (on mount).
  - `[data]`: Runs every time `data` changes.

## 5. `useMemo` (Derived State)

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

## Summary of Data Flow Patterns

| Pattern                   | Usage in CCL10100                                                                              |
| :------------------------ | :--------------------------------------------------------------------------------------------- |
| **Master-Detail**         | Using `paymentEntries` (List) and `payment` (Active Record) to manage data focus.              |
| **BFF Proxy**             | Using Vite `server.proxy` to route `/api` calls from port 3000 to 3001.                        |
| **LOV Modal**             | A reusable `LovModal` component that fetches dynamic data based on a passed `endpoint`.        |
| **Smart/Dumb Components** | The Page handles logic (Smart), while `HeaderBlock` and `PaymentTab` only display data (Dumb). |

---

It sounds like you're diving into the "big five" of React hooks! Reviewing a boss's code can be intimidating, but understanding these hooks will make the logic much clearer.

Think of **State** hooks as the data that changes, and **Effect/Memoization** hooks as the tools that control _when_ and _how_ that data updates.

---

### 1. useState

**The "Memory" Hook.**
This is how a component remembers things between renders. When you update a state variable, React re-renders the component to show the new data.

- **Usage:** For anything that changes on the screen (form inputs, toggles, data from an API).
- **Example:** `const [count, setCount] = useState(0);`

---

### 4.

### Summary Table for Quick Review

| Hook          | Purpose                      | Does it trigger re-render?  |
| :------------ | :--------------------------- | :-------------------------- |
| `useState`    | Manage data                  | **Yes**                     |
| `useEffect`   | Sync with external systems   | No (it runs _after_ render) |
| `useRef`      | Grab DOM/Store "silent" data | **No**                      |
| `useMemo`     | Cache a value/result         | No                          |
| `useCallback` | Cache a function             | No                          |

---

### A Tip for your Code Review

If you see `useMemo` or `useCallback` used everywhere, keep an eye out. Sometimes developers "over-memoize," which can actually make the code harder to read without providing a real performance boost. React is usually fast enough without them unless you're dealing with huge data sets or complex animations!

**Would you like me to look at a specific snippet of your boss's code to explain how these hooks are interacting in that context?**
