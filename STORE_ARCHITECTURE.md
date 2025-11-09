# Store Architecture

**QB Chrome Extension - State Management**

---

## Overview

The QB Chrome Extension uses **Svelte stores** for reactive state management with **Chrome Storage persistence**. All application state is backed by Chrome's storage APIs, providing automatic persistence across extension reloads, updates, and browser restarts.

---

## Architecture Principles

### 1. **Feature-Based Organization**

Stores are organized by feature domain:
- `vendors.ts` - Vendor configuration
- `bills.ts` - Bill cache and reminders
- `preferences.ts` - User preferences
- `ui.ts` - UI state (backend URL, connection status)

### 2. **Persistent by Default**

All stores use the `persistentStore` utility for automatic Chrome Storage sync:
- **Bidirectional sync**: Store changes write to Chrome Storage, storage changes update stores
- **Typed**: Full TypeScript support with generics
- **Immutable updates**: Required pattern for reactivity

### 3. **Derived Stores for Computed Values**

Derived stores automatically update when source stores change:
- `vendorsByName` - Alphabetically sorted vendors
- `upcomingReminders` - Bills due within reminder lead time
- `filteredBillsByStatus` - Bills filtered by status

---

## Storage Keys

### Chrome Storage Local (5MB limit)
- `vendors` - Vendor configuration array
- `bill-cache` - Cached bills array
- `backend-url` - Backend API URL string
- `current-route` - Current Side Panel route

### Chrome Storage Sync (100KB limit)
- `user-preferences` - User preferences object (syncs across devices)

---

## Core Utilities

### `persistentStore<T>()`

Creates a Svelte writable store with Chrome Storage persistence.

**Signature:**
```typescript
function persistentStore<T>(
  key: string,
  initialValue: T,
  storageType: 'local' | 'sync' = 'local'
): Writable<T>
```

**Example:**
```typescript
import { persistentStore } from '$lib/utils/persistentStore';

const vendors = persistentStore<Vendor[]>('vendors', [], 'local');

// Subscribe to changes
vendors.subscribe(value => console.log('Vendors:', value));

// Update store (automatically syncs to Chrome Storage)
vendors.update(v => [...v, newVendor]);
```

**How it works:**
1. Initializes from Chrome Storage on creation
2. Subscribes to store changes and writes to Chrome Storage
3. Listens to `chrome.storage.onChanged` and updates store
4. Prevents circular updates with `isInitializing` flag

---

## Store Usage Patterns

### 1. Subscribe in Svelte Components

Use the `$` reactive syntax for automatic subscriptions:

```svelte
<script>
  import { vendorConfig, billCache } from '$lib/stores';

  // Reactive - updates automatically when stores change
  $: vendors = $vendorConfig;
  $: bills = $billCache;
</script>

<p>Vendors: {vendors.length}</p>
<p>Bills: {bills.length}</p>
```

### 2. Immutable Updates (REQUIRED)

**Never mutate store state directly:**

```typescript
// ❌ WRONG - Mutates state
billCache.update(bills => {
  bills.push(newBill);
  return bills;
});

// ✅ CORRECT - Immutable update
billCache.update(bills => [...bills, newBill]);
```

### 3. Helper Functions

Use store-specific helper functions for common operations:

```typescript
import { addVendor, updateVendor, deleteVendor } from '$lib/stores';

// Add vendor
addVendor('Acme Corp', 'GL-1000');

// Update vendor
updateVendor(vendorId, { name: 'Acme Corporation' });

// Delete vendor (marks as inactive)
deleteVendor(vendorId);
```

### 4. Derived Stores

Derived stores automatically update when dependencies change:

```typescript
import { vendorsByName, upcomingReminders } from '$lib/stores';

// Subscribe to sorted vendors
vendorsByName.subscribe(vendors => {
  console.log('Sorted vendors:', vendors);
});

// Subscribe to upcoming bill reminders
upcomingReminders.subscribe(bills => {
  console.log(`${bills.length} bills need attention`);
});
```

---

## Storage Quota Monitoring

### Quota Limits
- **chrome.storage.local**: 5MB (5,242,880 bytes)
- **chrome.storage.sync**: 100KB (102,400 bytes)

### Thresholds
- **OK**: <80% used
- **Warning**: 80-90% used
- **Critical**: >90% used (triggers auto-cleanup)

### Monitoring Functions

```typescript
import { checkStorageQuota, monitorAndCleanup } from '$lib/stores';

// Check current quota
const quota = await checkStorageQuota();
console.log(`Using ${quota.percentUsed}% of storage`);

// Monitor and auto-cleanup if needed
await monitorAndCleanup(); // Cleans up if >90% used
```

### Cleanup Strategy

When storage quota exceeds 95%:
1. Removes oldest bills first
2. Keeps minimum of 10 most recent bills
3. Targets 70% usage after cleanup

---

## Extension Lifecycle

### First Install
- All stores initialize with default empty values
- No data in Chrome Storage yet

### Extension Update
- Existing Chrome Storage data preserved
- Stores load previous state on initialization

### Extension Uninstall
- Chrome automatically clears ALL storage
- No manual cleanup required

### Data Migration
The `persistentStore` utility includes migration detection (v1 → v2 format) for future schema changes.

---

## Type Safety

All stores are fully typed with TypeScript:

```typescript
import type { Vendor, Bill, UserPreferences } from '$lib/stores';

// Type-safe store access
const vendors: Vendor[] = get(vendorConfig);
const prefs: UserPreferences = get(userPreferences);
```

**TypeScript Strict Mode:**
- No `any` types allowed
- All functions have explicit type annotations
- Full type inference in derived stores

---

## Testing

### Unit Tests
Test store logic in isolation:

```typescript
import { vendorConfig, addVendor } from '$lib/stores';

test('adds vendor to store', () => {
  addVendor('Test Vendor', 'GL-1000');
  const vendors = get(vendorConfig);
  expect(vendors).toHaveLength(1);
  expect(vendors[0].name).toBe('Test Vendor');
});
```

### Integration Tests
Test Chrome Storage sync with mocked APIs:

```typescript
// Mock chrome.storage API
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      getBytesInUse: vi.fn()
    },
    onChanged: {
      addListener: vi.fn()
    }
  }
};
```

### Reactivity Tests
Test UI updates with Svelte component rendering:

```svelte
<!-- test-stores/+page.svelte -->
<script>
  import { vendorConfig } from '$lib/stores';

  function testReactivity() {
    vendorConfig.update(v => [...v, newVendor]);
    // Verify UI updates automatically
  }
</script>
```

---

## Performance

### State Reactivity
- Store updates trigger re-renders: <50ms
- Chrome Storage writes: <100ms (asynchronous)
- Derived store calculations: <10ms

### Storage Operations
- Reads from cache (in-memory stores) are instant
- Writes to Chrome Storage are debounced/batched
- Quota checks run every 5 minutes (background)

---

## Best Practices

1. **Always use immutable updates** - Spread operators, Array.map(), Array.filter()
2. **Use helper functions** - addVendor(), updateBill(), etc. for common operations
3. **Subscribe in components** - Use `$store` syntax for automatic cleanup
4. **Avoid direct chrome.storage calls** - Use stores for all state management
5. **Monitor quota** - Initialize monitoring on app startup
6. **Test reactivity** - Verify store subscriptions trigger UI updates

---

## Troubleshooting

### Store not updating UI
- Verify you're using `$store` syntax, not `get(store)`
- Check for direct mutations instead of immutable updates

### Chrome Storage not syncing
- Verify `storage` permission in manifest.json
- Check browser console for chrome.storage errors
- Confirm storage key matches architecture specification

### Quota exceeded
- Run `checkStorageQuota()` to see current usage
- Use `cleanupOldData()` to remove old bills
- Consider moving large data to IndexedDB (Phase 3)

---

## Future Enhancements

- **Phase 2**: Approval queue store for bill approvals
- **Phase 3**: IndexedDB integration for ML training data
- **Phase 3**: Feature flags store for freemium tier management

---

## References

- [Svelte Store Documentation](https://svelte.dev/docs/svelte-store)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [QB Chrome Extension Architecture](../docs/architecture.md)
