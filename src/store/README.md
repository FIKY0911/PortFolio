# Redux Store Documentation

## 📚 Struktur Redux

```
src/store/
├── store.js              # Redux store configuration
├── hooks.js              # Custom Redux hooks
└── slices/
    ├── themeSlice.js     # Theme state (dark/light)
    ├── languageSlice.js  # Language state (id/en)
    └── dataSlice.js      # Portfolio data (tools, projects)
```

## 🎯 Kenapa Menggunakan Redux?

### ✅ Kapan Gunakan Redux:
- **Global State**: State yang dibutuhkan banyak komponen (theme, auth, language)
- **Complex State Logic**: State dengan logic yang kompleks
- **State Sharing**: State yang di-share across many components
- **Time-Travel Debugging**: Butuh debugging dengan Redux DevTools
- **Predictable State**: Butuh state yang predictable dan traceable

### ❌ Kapan TIDAK Gunakan Redux:
- **Simple Local State**: Gunakan `useState` untuk state lokal
- **1-2 Components**: Jika hanya 1-2 komponen yang butuh state
- **Form State**: Gunakan form libraries (React Hook Form, Formik)
- **Server State**: Gunakan React Query atau SWR

## 🚀 Cara Penggunaan

### 1. Theme Management

```jsx
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { toggleTheme, selectIsDark } from '../store/slices/themeSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  const isDark = useAppSelector(selectIsDark)
  
  return (
    <button onClick={() => dispatch(toggleTheme())}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

### 2. Language Management

```jsx
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setLanguage, selectLanguage } from '../store/slices/languageSlice'

function LanguageSelector() {
  const dispatch = useAppDispatch()
  const language = useAppSelector(selectLanguage)
  
  return (
    <button onClick={() => dispatch(setLanguage('en'))}>
      Current: {language}
    </button>
  )
}
```

### 3. Portfolio Data

```jsx
import { usePortfolioData } from '../store/hooks'

function ToolsList() {
  const { tools, filteredTools, setToolFilter } = usePortfolioData()
  
  return (
    <div>
      <button onClick={() => setToolFilter('Beginner')}>
        Show Beginner Tools
      </button>
      {filteredTools.map(tool => (
        <div key={tool.id}>{tool.name}</div>
      ))}
    </div>
  )
}
```

## 🔧 Redux DevTools

### Install Extension:
- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### Features:
- **Time Travel**: Undo/redo state changes
- **State Inspector**: Inspect current state
- **Action Logger**: See all dispatched actions
- **State Diff**: See what changed in state

## 📊 State Structure

```javascript
{
  theme: {
    mode: 'dark' | 'light'
  },
  language: {
    current: 'id' | 'en',
    loading: false,
    error: null
  },
  data: {
    profile: { name, image_url },
    tools: [...],
    projects: [...],
    filters: {
      toolLevel: 'all',
      projectTech: 'all'
    }
  }
}
```

## 🎓 Best Practices

### 1. Use Selectors
```jsx
// ✅ Good - Use selector
const isDark = useAppSelector(selectIsDark)

// ❌ Bad - Direct state access
const isDark = useAppSelector(state => state.theme.mode === 'dark')
```

### 2. Memoize Selectors (Advanced)
```jsx
import { createSelector } from '@reduxjs/toolkit'

export const selectExpensiveData = createSelector(
  [selectTools, selectFilters],
  (tools, filters) => {
    // Expensive computation here
    return tools.filter(/* ... */)
  }
)
```

### 3. Keep State Normalized
```jsx
// ✅ Good - Flat structure
{
  users: { 1: { id: 1, name: 'John' } },
  posts: { 1: { id: 1, userId: 1 } }
}

// ❌ Bad - Nested structure
{
  users: [
    { id: 1, name: 'John', posts: [...] }
  ]
}
```

### 4. Use TypeScript (Optional)
```typescript
// Define types for better DX
interface ThemeState {
  mode: 'light' | 'dark'
}

const initialState: ThemeState = {
  mode: 'light'
}
```

## 🔄 Redux Flow

```
Component → dispatch(action) → Reducer → Update State → Re-render Component
```

1. **Component** calls `dispatch(action)`
2. **Action** is sent to **Reducer**
3. **Reducer** updates **State** (immutably)
4. **State** change triggers **Re-render**
5. **Component** gets new state via `useSelector`

## 🧪 Testing

```jsx
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'

describe('Theme Slice', () => {
  it('should toggle theme', () => {
    const store = configureStore({
      reducer: { theme: themeReducer }
    })
    
    store.dispatch(toggleTheme())
    expect(store.getState().theme.mode).toBe('dark')
  })
})
```

## 📈 Performance Tips

1. **Use Selectors**: Memoize expensive computations
2. **Split State**: Don't put everything in Redux
3. **Normalize Data**: Keep state flat
4. **Use React.memo**: Prevent unnecessary re-renders
5. **Batch Updates**: Redux automatically batches updates

## 🔗 Resources

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Redux Best Practices](https://redux.js.org/style-guide/style-guide)
- [When to Use Redux](https://redux.js.org/faq/general#when-should-i-use-redux)
