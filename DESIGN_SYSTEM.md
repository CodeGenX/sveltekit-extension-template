# QB Chrome Extension - Design System Reference

**Version:** 2.0.0
**Component Library:** Skeleton UI 4.2.2
**CSS Framework:** Tailwind CSS v4
**Typography:** Inter font family

---

## Overview

This design system establishes a consistent visual language for the QB Chrome Extension using Skeleton UI components and Tailwind CSS v4 utility classes. All design tokens are defined using Tailwind v4's `@theme` directive in `src/app.css`.

---

## Color Palette

### Primary (Blue)

Used for primary actions, links, and interactive elements.

```css
--color-primary-50: #eff6ff;
--color-primary-500: #3b82f6; /* Base */
--color-primary-600: #2563eb; /* Hover */
--color-primary-900: #1e3a8a; /* Dark */
```

**Tailwind Classes:** `bg-primary-500`, `text-primary-600`, `border-primary-300`

### Secondary (Slate/Gray)

Used for secondary elements, backgrounds, and borders.

```css
--color-secondary-50: #f8fafc;
--color-secondary-500: #64748b; /* Base */
--color-secondary-900: #0f172a; /* Dark */
```

**Tailwind Classes:** `bg-secondary-100`, `text-secondary-700`, `border-secondary-300`

### Success (Green)

Used for success messages, confirmations, and positive states.

```css
--color-success-50: #f0fdf4;
--color-success-500: #22c55e; /* Base */
--color-success-700: #15803d; /* Dark */
```

**Tailwind Classes:** `bg-success-500`, `text-success-700`, `border-success-300`

### Error (Red)

Used for error messages, warnings, and destructive actions.

```css
--color-error-50: #fef2f2;
--color-error-500: #ef4444; /* Base */
--color-error-700: #b91c1c; /* Dark */
```

**Tailwind Classes:** `bg-error-500`, `text-error-700`, `border-error-300`

All color palettes include full shade scales (50-900) for maximum flexibility.

---

## Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Oxygen-Sans', Ubuntu, Cantarell, sans-serif;
```

Inter font loaded from Google Fonts with weights: 400, 500, 600, 700.

### Typography Scale

| Class       | Size   | Use Case                   |
| ----------- | ------ | -------------------------- |
| `text-xs`   | 12px   | Small labels, captions     |
| `text-sm`   | 14px   | Secondary text, helper     |
| `text-base` | 16px   | Body text (default)        |
| `text-lg`   | 18px   | Emphasized text            |
| `text-xl`   | 20px   | Large headings             |
| `text-2xl`  | 24px   | Section headings           |
| `text-3xl`  | 30px   | Page headings              |
| `text-4xl`  | 36px   | Hero headings              |

### Base Styles

- **Font Size:** 16px
- **Line Height:** 1.5
- **Font Weights:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

---

## Spacing

Spacing uses a **4px base unit** (Tailwind's default scale):

| Class  | Size  | Pixels |
| ------ | ----- | ------ |
| `p-1`  | 0.25rem | 4px    |
| `p-2`  | 0.5rem  | 8px    |
| `p-3`  | 0.75rem | 12px   |
| `p-4`  | 1rem    | 16px   |
| `p-5`  | 1.25rem | 20px   |
| `p-6`  | 1.5rem  | 24px   |
| `p-8`  | 2rem    | 32px   |

Custom spacing tokens:
- `--spacing-18`: 4.5rem (72px)
- `--spacing-22`: 5.5rem (88px)

---

## Border Radius

Default border radius: **8px** (rounded-lg)

| Class        | Size    | Pixels | Use Case               |
| ------------ | ------- | ------ | ---------------------- |
| `rounded-sm` | 0.25rem | 4px    | Small elements         |
| `rounded`    | 0.5rem  | 8px    | Default (cards, inputs)|
| `rounded-lg` | 0.5rem  | 8px    | Cards, panels          |
| `rounded-xl` | 0.75rem | 12px   | Enhanced cards         |
| `rounded-2xl`| 1rem    | 16px   | Hero elements          |

---

## Component Library

### Skeleton UI Components

All components imported from `@skeletonlabs/skeleton-svelte`:

```typescript
import { Button } from '@skeletonlabs/skeleton-svelte';
```

#### Button Component

**Variants:** `filled`, `ghost`, `outlined`
**Colors:** `primary`, `secondary`, `success`, `error`
**Sizes:** `sm`, `md`, `lg`

```svelte
<Button variant="filled" color="primary">Click Me</Button>
<Button variant="ghost" color="success">Success</Button>
<Button variant="outlined" color="error">Delete</Button>
```

#### Form Components

- **Input:** Text, email, password fields
- **Select:** Dropdown menus
- **Checkbox:** Boolean selection
- **Radio:** Single selection from group
- **Textarea:** Multi-line text input

All form components use Tailwind utilities for styling and support focus states with `focus:ring-2 focus:ring-primary-500`.

#### Card Component

Custom card styling using Tailwind utilities:

```svelte
<div class="card bg-white p-6 rounded-lg shadow-md border border-secondary-200">
  <h3 class="text-xl font-semibold mb-2">Card Title</h3>
  <p class="text-secondary-600">Card content...</p>
</div>
```

---

## Dark Mode

### Infrastructure

Dark mode uses **class-based** strategy configured with `@custom-variant dark`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

### Dark Mode Colors

```css
/* Backgrounds */
--color-dark-bg-primary: #1a1a1a;
--color-dark-bg-secondary: #2a2a2a;
--color-dark-bg-tertiary: #3a3a3a;

/* Text */
--color-dark-text-primary: #f5f5f5;
--color-dark-text-secondary: #e5e5e5;
--color-dark-text-tertiary: #d5d5d5;
```

### Activation

Dark mode is **configured but not enabled** in Phase 1.

To activate (future story 1.3.5):
```javascript
document.documentElement.classList.add('dark');
```

Use `dark:` variants in Tailwind classes:
```html
<div class="bg-white dark:bg-dark-bg-primary text-secondary-900 dark:text-dark-text-primary">
```

---

## Accessibility

- **WCAG 2.1 Level AA Compliance:** All color combinations meet contrast requirements
- **Focus States:** All interactive elements have visible focus indicators
- **Keyboard Navigation:** All components support keyboard interaction
- **Semantic HTML:** Proper heading hierarchy and ARIA labels where needed

---

## Performance

- **Bundle Size:** Skeleton UI adds ~15KB gzipped
- **CSS Purging:** Tailwind removes unused utilities in production
- **Tree-Shaking:** Only imported Skeleton components are bundled
- **Font Loading:** Inter font loaded with `display=swap` for better performance

---

## Usage Examples

### Primary Button with Icon
```svelte
<Button variant="filled" color="primary" class="flex items-center gap-2">
  <IconPlus />
  Add Bill
</Button>
```

### Form Input with Validation
```svelte
<div>
  <label for="vendor" class="block text-sm font-medium text-secondary-700 mb-1">
    Vendor Name
  </label>
  <input
    id="vendor"
    type="text"
    class="w-full px-4 py-2 border border-secondary-300 rounded-lg
           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
           outline-none"
    placeholder="Enter vendor name..."
  />
</div>
```

### Success Card with Action
```svelte
<div class="card bg-success-50 p-6 rounded-lg border border-success-200">
  <h3 class="text-xl font-semibold text-success-700 mb-2">
    Bill Submitted Successfully
  </h3>
  <p class="text-success-600 mb-4">
    Your bill has been sent to QuickBooks Desktop.
  </p>
  <Button variant="filled" color="success" size="sm">
    View Details
  </Button>
</div>
```

---

## Testing

Component showcase available at `/test-components` route for visual verification.

### Manual Testing Checklist

- [ ] All color scales render correctly
- [ ] Typography uses Inter font family
- [ ] Buttons render in all variants and colors
- [ ] Form components are interactive
- [ ] Cards display with correct spacing and radius
- [ ] Dark mode classes are defined in CSS

---

## Future Enhancements

- **Dark Mode Toggle** (Story 1.3.5): User preference toggle in settings
- **Custom Icons** (Future): Replace placeholder icons with custom QB branding
- **Animation System** (Epic 1.2): Page transition and micro-interactions
- **Component Variants** (As needed): Additional component states and configurations

---

## References

- [Skeleton UI Documentation](https://www.skeleton.dev/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
