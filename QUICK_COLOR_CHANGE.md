# Quick Color Change Guide

## 🎨 Change Colors in 3 Simple Steps

### Step 1: Open the Theme File
```bash
Open: client/src/app/globals.css
```

### Step 2: Find the :root Section
Look for this section (around line 120):

```css
:root {
  /* ============================================
     CENTRALIZED THEME COLOR SYSTEM
     All colors are defined here. Update these
     values to change the entire site theme.
     ============================================ */
```

### Step 3: Edit the Colors You Want
Change any of these values:

```css
/* PRIMARY BRAND COLOR (buttons, accents, highlights) */
--primary: #36e27b;              /* ← Change this! */
--primary-hover: #2ec56a;        /* ← And this for hover state */

/* BACKGROUND COLORS */
--background: #112117;           /* ← Main background */
--background-darker: #0b1610;    /* ← Darker sections */

/* TEXT COLORS */
--text-secondary: #95c6a9;       /* ← Secondary text */
--text-on-primary: #112117;      /* ← Text on buttons */

/* BORDER COLORS */
--border: #254632;               /* ← Main borders */
--border-dark: #366348;          /* ← Darker borders */
```

## 💡 Popular Theme Examples

### Blue Professional Theme
```css
--primary: #3b82f6;
--primary-hover: #2563eb;
--primary-light: #60a5fa;
```

### Purple Modern Theme
```css
--primary: #8b5cf6;
--primary-hover: #7c3aed;
--primary-light: #a78bfa;
```

### Orange Energetic Theme
```css
--primary: #f97316;
--primary-hover: #ea580c;
--primary-light: #fb923c;
```

### Red Bold Theme
```css
--primary: #ef4444;
--primary-hover: #dc2626;
--primary-light: #f87171;
```

## 🌓 Lighter Background Example

For a less dark background:
```css
--background: #1a2620;           /* Lighter */
--background-darker: #152019;    /* Still darker for contrast */
--surface-dark: #243c30;         /* Lighter surfaces */
```

## 🎯 Save & See Changes

1. Save the file
2. The dev server reloads automatically
3. Changes appear instantly!

## ⚠️ Important Tips

- ✅ Always use hex colors (#rrggbb format)
- ✅ Test contrast for readability
- ✅ Change all three primary colors together (primary, primary-hover, primary-light)
- ✅ Keep dark backgrounds darker than surfaces
- ❌ Don't remove variables, only change their values

## 📖 Need More Details?

See `THEME_SYSTEM.md` for complete documentation.
