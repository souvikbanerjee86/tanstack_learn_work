---
name: design-standards
description: >-
  Enforces the EazyAI Glassmorphism Design System, OKLCH color palettes, Tailwind CSS v4 tokens,
  typography, dark/light themes, ambient animations, and accessible component patterns.
---

# EazyAI Design Standards & Glassmorphism System

EazyAI uses a custom, futuristic **Global Glassmorphism Theme** built on **Tailwind CSS v4**, **OKLCH Color Space**, and **Geist/Outfit Typography**.

---

## 1. Glass Tokens & Utility Classes

Defined in [`src/styles.css`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/styles.css) and [`design.md`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/design.md):

| Utility Class        | Purpose & Location                                    | Recommended Styles                                                                                    |
| :------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **`glass-header`**   | Sticky top navigation and dashboard headers           | `bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-border/40`                          |
| **`glass-sidebar`**  | App sidebar and collapsibles                          | `bg-sidebar/40 backdrop-blur-2xl border-r border-sidebar-border/10`                                   |
| **`glass-card`**     | Dashboard statistics, cards, charts, and modal panels | `bg-card/30 backdrop-blur-lg border border-border/10 shadow-lg hover:border-border/30 transition-all` |
| **`glass-morphism`** | General-purpose floating dialogs and command palette  | `bg-background/60 backdrop-blur-xl border border-border/10 shadow-2xl`                                |

---

## 2. Typography Guidelines

Fonts are imported via `@fontsource-variable/*` in [`src/styles.css`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/styles.css):

```css
@import '@fontsource-variable/geist'; /* Sans-Serif Body */
@import '@fontsource-variable/outfit'; /* Headings & Brand */
@import '@fontsource-variable/geist-mono'; /* Monospace & Code */
```

### Hierarchy Rules:

- **Hero & Primary Headings**: Font: `Outfit Variable`, classes: `font-heading font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-foreground`.
- **Section & Card Titles**: Font: `Outfit Variable`, classes: `font-heading font-bold tracking-tight text-lg sm:text-xl text-foreground`.
- **Metric Numbers & Scores**: Font: `Outfit Variable`, classes: `font-heading font-black text-2xl tracking-tighter`.
- **Badges & Meta Labels**: Font: `Geist Sans`, classes: `text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground`.
- **Technical IDs & Code**: Font: `Geist Mono`, classes: `font-mono text-xs text-muted-foreground/80`.

---

## 3. OKLCH Color Palette & Semantic Tokens

EazyAI uses perceptually uniform OKLCH colors configured via CSS variables:

### Key Roles:

- **Primary**: `oklch(0.646 0.222 41.116)` (Light) / `oklch(0.705 0.213 47.604)` (Dark)
- **Background**: Base opaque layer (`oklch(1 0 0)` light / `oklch(0.145 0 0)` dark)
- **Card / Surface**: Semi-transparent layer with 30%-40% alpha
- **Chart Palette**:
  - `--chart-1`: Amber Gold `oklch(0.837 0.128 66.29)`
  - `--chart-2`: Coral Flame `oklch(0.705 0.213 47.604)`
  - `--chart-3`: Crimson Rust `oklch(0.646 0.222 41.116)`
  - `--chart-4`: Deep Ochre `oklch(0.553 0.195 38.402)`
  - `--chart-5`: Burnt Earth `oklch(0.47 0.157 37.304)`

---

## 4. Ambience & Micro-Animations

1. **Ambient Background Pulse**:
   - A soft breathing glow effect behind glass surfaces defined in `src/styles.css`.
   - Uses `animation: ambient-pulse 15s ease-in-out infinite`.
2. **Tactile Button Clicks**:
   - Buttons and clickable cards must include `active:scale-[0.98] transition-transform` for physical tactile feedback.
3. **Smooth Elevation Transitions**:
   - Cards and interactive items should use `transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5`.

---

## 5. UI Skeletons & Empty States

Every data-fetching component **MUST** have a corresponding skeleton loader to prevent layout shifts (CLS):

- Skeleton directory: [`src/components/web/*-skeleton.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/)
- For empty query responses, use [`empty-state.tsx`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/empty-state.tsx) with a meaningful Lucide icon, clear title, concise description, and an action button.

---

## 6. Theme Switching

- Managed via [`next-themes`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/lib/theme-provider.tsx).
- Theme toggle component: [`ThemeToggle`](file:///Users/souvikbanerjee/codes/tanstack-learn-work/src/components/web/theme-toggle.tsx).
- Always use semantic classes (e.g. `text-foreground`, `text-muted-foreground`, `bg-card/40`, `border-border/40`) rather than hardcoded `text-black` or `bg-white`.

---

## UI Component Construction Checklist

- [ ] Does the component inherit `font-heading` for titles and `font-sans` for body?
- [ ] Are translucent backgrounds paired with `backdrop-blur-md` or `backdrop-blur-xl`?
- [ ] Does the interactive element have `active:scale-[0.98]` and `cursor-pointer`?
- [ ] Is there a loading skeleton matching the exact component layout?
- [ ] Is the design fully responsive on mobile (`< 768px`) and desktop?
