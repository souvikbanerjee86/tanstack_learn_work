# Design System: EazyAI Application (Glassmorphism Theme)

This document outlines the design principles, elements, and themes applied to the EazyAI Application. The application follows a **Global Glassmorphism Theme**, providing a futuristic, clean, and depth-rich user experience.

## 🎨 Core Design Philosophy
- **Global Glassmorphism**: Every major container and surface utilizes backdrop blurs and semi-transparent layers.
- **Dynamic Ambience**: High-performance "Ambient Background Effects" that provide a soft, pulsing glow behind the glass surfaces.
- **Vibrancy & Depth**: Using OKLCH color space for more natural and vibrant colors that interact beautifully with glass transparency.
- **Platform Agnostic**: Optimised for both Mobile and Desktop, supporting seamless shifting between Light and Dark modes.

---

## 🔡 Typography

- **Primary Sans-Serif**: `Geist Variable` (Body text, general interface)
- **Heading Font**: `Outfit Variable` (Titles, headers, emphasizes "Modern SaaS" look)
- **Monospace**: `Geist Mono Variable` (Technical data)

| Element | Font Family | Style |
| :--- | :--- | :--- |
| **Hero Headings** | Outfit | `tracking-tighter`, `font-black`, `text-6xl+` |
| **Dashboard Headers**| Outfit | `tracking-tighter`, `font-bold`, `text-4xl` |
| **Labels & UI** | Geist Sans | `tracking-[0.3em]`, `font-black`, `uppercase`, `text-[11px]` |

---

## 🌈 Color Palette (OKLCH) & Transparency

| Role | Light Mode Value | Dark Mode Value | Glass Opacity |
| :--- | :--- | :--- | :--- |
| **Primary** | `oklch(0.646 0.222 41.116)` | `oklch(0.705 0.213 47.604)` | Various |
| **Background** | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Base Layer |
| **Card / Surface** | `oklch(1 0 0 / 30%)` | `oklch(0.205 0 0 / 30%)` | 30% - 40% |
| **Sidebar** | `oklch(0.985 0 0 / 40%)`| `oklch(0.205 0 0 / 40%)` | 40% |

---

## ✨ Glassmorphism Implementation

The application uses standard utility classes to maintain design consistency:

### 1. `glass-header`
- Applied to Top Navigation and Dashboard Headers.
- **Styles**: `bg-background/50`, `backdrop-blur-2xl`, `border-b border-border/5`.

### 2. `glass-sidebar`
- Applied to the App Sidebar.
- **Styles**: `bg-sidebar/40`, `backdrop-blur-2xl`, `border-r border-sidebar-border/10`.

### 3. `glass-card`
- Used for Statistics, Features, and Dashboard Widgets.
- **Styles**: `bg-card/30`, `backdrop-blur-lg`, `border border-border/10`, `shadow-lg`.
- **Transitions**: Animates to higher opacity and subtle scaling on hover.

### 4. `glass-morphism`
- A general-purpose high-performance glass container.
- **Styles**: `bg-background/60`, `backdrop-blur-xl`, `border border-border/5`, `shadow-xl`.

---

## 🌪️ Ambient Background
The "Glass" effect is enhanced by global background elements defined in `styles.css`:
- **Dual Ambiance**: A primary-colored glow in the top-right and a chart-mapped glow in the bottom-left.
- **Animation**: `ambient-pulse` (15s duration) provides a slow, breathing effect to the entire application background.

---

## 🎭 Animations & Transitions

- **Tactile Feedback**: `active:scale-[0.98]` on all glass buttons.
- **Smooth Elevation**: `duration-500` transitions for card hover states.
- **Gradient Text**: High-contrast animated gradients for hero typographic elements.

---

## 🛠️ Responsive Strategy
- **Mobile**: Cards use full viewport width with reduced padding; `glass-header` remains sticky with maximized blur for content clarity during scroll.
- **Desktop**: Expansive layouts with sidebar integration; enhanced shadow depth for better peripheral separation.
