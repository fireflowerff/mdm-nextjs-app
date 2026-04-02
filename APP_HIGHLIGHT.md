That is a great idea. Having a "Technical Playbook" for this specific project will make your future Next.js and React tasks much easier, as these patterns are common in professional enterprise apps.

Here is a structured markdown reference for the **CCL10100 Technical Library**.

---

# Technical Reference: CCL10100 React Patterns

This document summarizes the core React Hooks and architectural patterns used in the **Maintain Payment / Receipt** module.

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

---

## Summary of Data Flow Patterns

| Pattern                   | Usage in CCL10100                                                                              |
| :------------------------ | :--------------------------------------------------------------------------------------------- |
| **Master-Detail**         | Using `paymentEntries` (List) and `payment` (Active Record) to manage data focus.              |
| **BFF Proxy**             | Using Vite `server.proxy` to route `/api` calls from port 3000 to 3001.                        |
| **LOV Modal**             | A reusable `LovModal` component that fetches dynamic data based on a passed `endpoint`.        |
| **Smart/Dumb Components** | The Page handles logic (Smart), while `HeaderBlock` and `PaymentTab` only display data (Dumb). |

---

**Does this look like a good summary for your technical library, or would you like me to add more detail on the TypeScript `interface` structures as well?**
