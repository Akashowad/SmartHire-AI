## UI Theme Overhaul Plan

### Information Gathered
- Current CSS: Dark theme with purple accent (#6366f1 gradient)
- Navbar: Glassmorphism dark background
- Target: Light SaaS theme with green #22C55E, white backgrounds

### Plan
1. **frontend/src/index.css** - Replace :root variables with light theme palette
2. **frontend/src/components/Navbar.jsx** - White background, dark button
3. **frontend/src/pages/Home.jsx** - Hero with 48px+ heading, "Scale faster" in green, button styles
4. **frontend/src/pages/Dashboard.jsx** - White cards with soft shadows
5. **frontend/src/components/UploadModal.jsx** - Dashed border upload box
6. Update button, card, badge styles to match specs

### Dependent Files
- All components using CSS variables

### Followup Steps
- npm run build
- npx serve dist

Approve to proceed?

