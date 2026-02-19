# Vitrax Limited - Frontend Design System Reference

## Quick Reference Guide for Developers

### 🎨 Color Palette

#### Brand Colors
```css
--primary: #FBEBB5;    /* Brand Peach - Main color */
--secondary: #2c3e50;  /* Dark Blue - Admin/Dark sections */
--accent: #159EEC;     /* Brand Blue - Links, hover states */
```

#### Neutral Colors
```css
--dark: #333;          /* Primary text */
--gray-mid: #666;      /* Secondary text */
--gray-light: #999;    /* Tertiary text */
--border: #ddd;        /* Borders */
--bg-light: #f8f8f8;   /* Light background */
--white: #fff;         /* Page background */
```

#### Semantic Colors
```css
--success: #27ae60;    /* Success states */
--error: #e74c3c;      /* Error states */
--warning: #f39c12;    /* Warning states */
```

---

### 📝 Typography Scale

#### Font Family
```css
font-family: Arial, Helvetica, sans-serif;
```

#### Font Sizes
```
H1: 24px (font-weight: 700)
H2: 20px (font-weight: 600)
H3: 16px (font-weight: 600)
H4: 14px (font-weight: 600)
Body: 14px (font-weight: 400)
Small: 12px (font-weight: 400)
```

#### Line Heights
```
Display: 1.3
Body: 1.6
Compact: 1.4
```

---

### 📐 Spacing System

#### Scale
```
8px  - xs (Small gaps, padding)
12px - sm (Form elements)
15px - md (Component spacing)
20px - lg (Section spacing)
30px - xl (Major sections)
40px - xxl (Full-page padding)
```

#### Common Patterns
```css
/* Card padding */
padding: 20px;

/* Section margin */
margin: 30px 0;

/* Form field spacing */
margin-bottom: 15px;

/* List item spacing */
margin: 8px 0;
```

---

### 🔘 Button Styles

#### Primary Button (CTA)
```css
padding: 12px 16px;
background-color: #333;
color: white;
border: none;
border-radius: 5px;
font-size: 14px;
font-weight: 600;
cursor: pointer;
transition: background-color 0.3s ease;
```

#### States
```css
/* Normal */
background-color: #333;

/* Hover */
background-color: #555;

/* Active/Pressed */
background-color: #222;

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

#### Button Classes
```
.submit-btn     - Form submission
.place-order    - Checkout action
.add-to-cart-btn - Product action
Button in forms - Standard styling
```

---

### 📝 Form Input Styles

#### Standard Input
```css
padding: 10px 12px;
border: 1px solid #ddd;
border-radius: 5px;
font-size: 14px;
font-family: Arial, sans-serif;
transition: border-color 0.3s ease, box-shadow 0.3s ease;
```

#### Focus State
```css
border-color: #159EEC;
box-shadow: 0 0 0 2px rgba(21, 158, 236, 0.1);
outline: none;
```

#### With Icon
```css
.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background: #f8f8f8;
}

.icon {
  color: #666;
  margin-right: 10px;
  font-size: 16px;
}
```

---

### 💫 Shadows System

#### Light Shadow (Cards, Small elements)
```css
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
```

#### Medium Shadow (Standard elements)
```css
box-shadow: 0 4px 10px rgba(0,0,0,0.15);
```

#### Heavy Shadow (Modals, Dropdowns)
```css
box-shadow: 0 8px 16px rgba(0,0,0,0.2);
```

---

### 🔲 Border Radius System

```css
4px  - Small interactive elements (buttons, small cards)
5px  - Standard elements (inputs, regular buttons, cards)
10px - Large elements (major cards, containers)
50px - Circular elements (profile pictures, fully rounded)
```

---

### 📱 Responsive Breakpoints

#### Desktop
```css
@media (min-width: 1024px) {
  /* Full-width layouts, multi-column grids */
}
```

#### Tablet
```css
@media (max-width: 768px) {
  /* Adjusted spacing, 2-column to 1-column */
}
```

#### Mobile
```css
@media (max-width: 480px) {
  /* Single column, optimized spacing, touch-friendly */
}
```

#### Font Scaling
```css
/* Tablet: -2px */
/* Mobile: -3px */
@media (max-width: 480px) {
  html { font-size: 13px; }
}
```

---

### 🎭 Component Patterns

#### Card
```css
.card {
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
```

#### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

#### Section Spacing
```css
.section {
  padding: 30px 20px;
  margin: 20px 0;
}
```

#### Flex Layout
```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

---

### 🌐 Link Styles

```css
a {
  color: #159EEC;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #2c5aa0; /* Darker blue */
}

a:active {
  color: #1e4620;
}
```

---

### ✨ Animation Patterns

#### Smooth Transitions
```css
transition: 0.3s ease;
transition: all 0.3s ease;
transition: background-color 0.3s ease, box-shadow 0.3s ease;
```

#### Slide In Animation (Modals, Popups)
```css
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

animation: slideIn 0.3s ease-out;
```

---

### 🔍 Focus & Accessibility

#### Keyboard Focus Style
```css
:focus {
  outline: none;
  border-color: #159EEC;
  box-shadow: 0 0 0 2px rgba(21, 158, 236, 0.1);
}

:focus-visible {
  /* Enhanced visibility for keyboard navigation */
}
```

#### Link Focus
```css
a:focus {
  outline: 2px solid #159EEC;
  outline-offset: 2px;
}
```

---

### 📋 Common CSS Classes (index.css)

#### Text Utilities
```css
.text-center     { text-align: center; }
.text-muted      { color: #999; }
.text-dark       { color: #333; }
```

#### Margin Utilities
```css
.mt-10, .mt-15, .mt-20, .mt-30
.mb-10, .mb-15, .mb-20, .mb-30
```

#### Padding Utilities
```css
.p-10, .p-15, .p-20, .p-30
```

---

### 🎯 Usage Examples

#### Example 1: Form Field
```html
<div class="form-group">
  <input 
    type="text" 
    placeholder="Enter name"
    class="form-input"
  />
</div>
```

#### Example 2: Button
```html
<button class="submit-btn">
  Submit Form
</button>
```

#### Example 3: Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

#### Example 4: Responsive Grid
```html
<div class="container">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    <!-- Items -->
  </div>
</div>
```

---

### 🔨 Development Workflow

#### Creating New Components
1. Follow the color palette
2. Use spacing scale (8px, 15px, 20px, 30px)
3. Apply appropriate shadows (light/medium)
4. Use consistent border-radius (5px standard)
5. Include responsive breakpoints
6. Test on mobile, tablet, desktop

#### Modifying Existing Styles
1. Check design system first
2. Maintain color consistency
3. Keep spacing proportional
4. Update all affected breakpoints
5. Test thoroughly across devices

---

### 📚 Files to Reference

| File | Purpose |
|------|---------|
| `index.css` | Global styles, typography, utilities |
| `Navbar.css` | Navigation styling |
| `Footer.css` | Footer styling |
| `CartPopup.css` | Shopping cart styling |
| `BillingForm.css` | Form input standards |
| `ContactForm.css` | Form styling reference |
| `SingleProduct.css` | Product page layout |
| `auth.css` | Authentication form styling |

---

### 🎓 Best Practices

1. **Use the design system** - Don't create new colors/sizes
2. **Mobile-first** - Design for mobile, enhance for desktop
3. **Consistency** - Apply same styles to similar elements
4. **Accessibility** - Always provide focus states
5. **Performance** - Avoid duplicate rules, keep CSS lean
6. **Documentation** - Comment non-obvious styles
7. **Testing** - Test on real devices, not just browsers

---

**Last Updated**: February 10, 2026
**Version**: 1.0
**Status**: Active

