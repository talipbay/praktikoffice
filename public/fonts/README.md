# Melodrama Font Setup

To complete the Melodrama font setup, you need to add the font files to this directory:

## Required Files:

- `Melodrama-Regular.woff2`
- `Melodrama-Regular.woff`
- `Melodrama-Bold.woff2`
- `Melodrama-Bold.woff`

## Where to get Melodrama font:

1. Purchase from the official foundry or authorized distributors
2. If you already have the font files, place them in this `/public/fonts/` directory

## Usage in your components:

Once the font files are added, you can use the Melodrama font in your CSS classes:

```css
.melodrama-text {
  font-family: var(--font-melodrama);
}
```

Or with Tailwind CSS (after adding to tailwind.config):

```jsx
<h1 className="font-melodrama">Your text here</h1>
```

The font is already configured in your CSS with proper fallbacks to serif fonts.
