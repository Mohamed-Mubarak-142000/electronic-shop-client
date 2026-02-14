# Centralized Theme System Documentation

## Overview

This project now uses a centralized theming system that allows you to control all colors from a single location. All color values are defined as CSS variables in `src/app/globals.css`, and the entire application has been refactored to use these variables instead of hardcoded colors.

## How to Change Colors

To change the website colors, edit the CSS variables in **`src/app/globals.css`** in the `:root` section. Changes will automatically reflect across the entire application.

### Location of Theme Variables

File: `src/app/globals.css`
Section: `:root { ... }`

## Color System Structure

### Background Colors
```css
--background-light: #f6f8f7;       /* Light mode background */
--background: #112117;             /* Main dark background */
--background-dark: #112117;        /* Alias for background */
--background-darker: #0b1610;      /* Darker variant for sections */
--background-darkest: #0a140e;     /* Darkest variant for emphasis */
```

**Usage in Tailwind:**
- `bg-background-light`
- `bg-background`
- `bg-background-dark`
- `bg-background-darker`
- `bg-background-darkest`

### Surface Colors (Cards, Panels, Containers)
```css
--surface-dark: #1c3326;           /* Main surface color */
--surface-highlight: #254632;      /* Highlighted surface */
--card: #1c3024;                   /* Card background */
--card-dark: #1c3024;              /* Alias for card */
```

**Usage in Tailwind:**
- `bg-surface-dark`
- `bg-surface-highlight`
- `bg-card`
- `bg-card-dark`

### Text Colors
```css
--foreground: #ffffff;             /* Primary text color */
--text-primary: #ffffff;           /* Alias for foreground */
--text-secondary: #95c6a9;         /* Secondary/muted text */
--text-muted: #95c6a9;             /* Alias for muted text */
--text-on-primary: #112117;        /* Text on primary color */
--text-on-primary-alt: #122118;    /* Alternative text on primary */
--text-on-primary-dark: #0b1610;   /* Dark text on primary */
```

**Usage in Tailwind:**
- `text-foreground`
- `text-primary`
- `text-secondary`
- `text-muted`
- `text-on-primary`
- `text-on-primary-alt`
- `text-on-primary-dark`

### Primary Brand Colors
```css
--primary: #36e27b;                /* Main brand color */
--primary-foreground: #112117;     /* Text on primary */
--primary-hover: #2ec56a;          /* Primary hover state */
--primary-light: #48f58d;          /* Lighter primary variant */
```

**Usage in Tailwind:**
- `bg-primary` / `text-primary`
- `bg-primary-foreground`
- `bg-primary-hover` / `hover:bg-primary-hover`
- `bg-primary-light`

### Secondary Colors
```css
--secondary: #254632;              /* Secondary brand color */
--secondary-foreground: #ffffff;   /* Text on secondary */
```

**Usage in Tailwind:**
- `bg-secondary` / `text-secondary`
- `text-secondary-foreground`

### Border Colors
```css
--border: #254632;                 /* Main border color */
--border-dark: #366348;            /* Darker border variant */
--border-light: #1a3324;           /* Lighter border variant */
--border-subtle: #2a5340;          /* Subtle border */
```

**Usage in Tailwind:**
- `border-border`
- `border-border-dark`
- `border-border-light`
- `border-border-subtle`

### Input Colors
```css
--input: #254632;                  /* Input border color */
--input-background: #1c3326;       /* Input background */
```

**Usage in Tailwind:**
- `border-input`
- `bg-input-background`

### Semantic Colors
```css
--success: #36e27b;                /* Success state */
--error: #ef4444;                  /* Error state */
--warning: #f59e0b;                /* Warning state */
--info: #3b82f6;                   /* Info state */
```

**Usage in Tailwind:**
- `bg-success` / `text-success`
- `bg-error` / `text-error`
- `bg-warning` / `text-warning`
- `bg-info` / `text-info`

## Example: Changing the Primary Brand Color

To change the primary brand color from green to blue:

1. Open `src/app/globals.css`
2. Find the `:root` section
3. Update the primary color variables:

```css
:root {
  /* Change from green to blue */
  --primary: #3b82f6;              /* Blue instead of #36e27b */
  --primary-hover: #2563eb;        /* Darker blue for hover */
  --primary-light: #60a5fa;        /* Lighter blue variant */
  
  /* You may also want to adjust text colors for better contrast */
  --primary-foreground: #ffffff;   /* White text on blue background */
}
```

4. Save the file - changes will reflect immediately in development mode!

## Example: Creating a Light Theme

The system is already set up for light mode. To activate it:

1. The `.light` class in `globals.css` contains light theme colors
2. Apply this class to your root element to switch themes
3. You can toggle between themes dynamically

## Example: Changing Background Colors

To make the background lighter or darker:

```css
:root {
  /* For a lighter dark theme */
  --background: #1a2620;           /* Lighter than #112117 */
  --background-darker: #152019;    /* Adjust accordingly */
  
  /* For surfaces */
  --surface-dark: #243c30;         /* Lighter surface */
  --surface-highlight: #2f5040;    /* Lighter highlight */
}
```

## Custom Color Variables

To add your own custom colors:

1. Add the variable to `:root` in `globals.css`:
```css
:root {
  --my-custom-color: #ff6b6b;
}
```

2. Add the Tailwind mapping in `@theme inline`:
```css
@theme inline {
  --color-my-custom: var(--my-custom-color);
}
```

3. Use it in your components:
```tsx
<div className="bg-my-custom text-white">
  Custom colored element
</div>
```

## Best Practices

1. **Always use theme variables** instead of hardcoded colors
2. **Never use hex colors directly** in component files (e.g., avoid `bg-[#36e27b]`)
3. **Use semantic names** when adding new colors
4. **Test in both light and dark modes** if implementing theme switching
5. **Keep color contrast accessible** (WCAG AA minimum)

## Files That Use Theme Variables

The theme system has been applied to:

### Customer Pages
- Home page (`/`)
- Shop page (`/shop`)
- Product details (`/product/[id]`)
- Portfolio (`/portfolio`)
- About, Contact, Support pages
- Cart, Checkout, Wishlist
- Track Order page

### Admin Pages
- Dashboard (`/admin`)
- Products management
- Orders management
- Customers management
- Categories & Brands
- Settings
- Profile
- Messages
- Jobs & Schedules
- Portfolio management

### Components
- Layout (Navbar, Footer)
- Product cards
- Shop filters and toolbar
- Checkout dialog
- Admin tables and forms
- Authentication forms
- Shared UI components (buttons, inputs, etc.)

## Troubleshooting

### Colors not updating?
1. Make sure you're editing `src/app/globals.css`
2. Check that the dev server is running
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Verify CSS variable names match Tailwind class names

### Variable not working?
1. Ensure it's defined in `:root`
2. Check it's mapped in `@theme inline`
3. Use the correct Tailwind prefix (e.g., `bg-`, `text-`, `border-`)

### Need help?
Review this document or check `src/app/globals.css` for all available color variables.

## Migration Notes

All hardcoded colors have been replaced with theme variables:
- `#95c6a9` → `text-secondary`
- `#366348` → `border-dark`
- `#0b1610` → `background-darker`
- `#122118` → `text-on-primary-alt`
- `#112117` → `background`
- And many more...

The complete mapping is documented in the `:root` section of `globals.css`.
