---
version: alpha
name: Diyo Luxury Prestige
description: Visual identity and design system for DiyoDecors, conveying warmth, elegance, and premium cultural event design.
colors:
  primary: "#e2b740"       # Diyo Gold
  primary-dark: "#b38b22"  # Deep Gold (high contrast for light sand backgrounds)
  orange: "#ff7b00"        # Flicker Orange
  red: "#c02626"           # Crimson Accent
  clay: "#8b4513"          # Clay Brown
  bg-dark: "#0d0806"       # Midnight Charcoal
  bg-card: "#160e0a"       # Warm Dark Charcoal
  bg-card-hover: "#22150f" # Highlighted Warm Charcoal
  bg-sand: "#eadfc5"       # Warm Sand
  bg-cream: "#fffbef"      # Warm Cream (inner boxes)
  text-main: "#f9f4ef"     # Pearl White
  text-muted: "#c9baa8"    # Dusty Gold-Gray
  text-dark: "#1a0f0a"     # Dark Bronze
  text-dark-muted: "#4a3b32" # Soft Bronze
typography:
  fontFamily: Montserrat, sans-serif
  headingFontFamily: Cinzel, serif
  h1:
    fontFamily: Cinzel, serif
    fontSize: 64px # 4rem
    fontWeight: 700
    lineHeight: 1.1
  h2:
    fontFamily: Cinzel, serif
    fontSize: 40px # 2.5rem
    fontWeight: 600
    lineHeight: 1.2
  h3:
    fontFamily: Cinzel, serif
    fontSize: 32px # 2rem
    fontWeight: 600
  body:
    fontFamily: Montserrat, sans-serif
    fontSize: 16px # 1rem
    lineHeight: 1.6
rounded:
  sm: 10px # inputs
  md: 15px # service cards
  lg: 20px # about image, forms, cards
  full: 50px # buttons, round logos, social links
spacing:
  xs: 8px
  sm: 15px
  md: 20px
  lg: 30px
  xl: 40px
  xxl: 60px
components:
  btn-primary:
    background: "linear-gradient(45deg, {colors.primary}, {colors.orange})"
    borderRadius: "{rounded.full}"
    color: "{colors.bg-dark}"
  btn-outline:
    background: "transparent"
    borderColor: "{colors.primary}"
    borderRadius: "{rounded.full}"
    color: "{colors.primary}"
---

# Diyo Luxury Prestige Design System

This document outlines the visual language and design principles for DiyoDecors.

## Overview
DiyoDecors provides luxury event styling and decoration services. The design system is crafted to evoke warmth, prestige, and cultural heritage, inspired by the flickering flame of a traditional *Diyo* lamp. 

The website uses a **dual-theme** paradigm:
1. **Midnight Theme**: The main, immersive background is a deep, warm charcoal black (`#0d0806`) adorned with golden glows and floating particles representing diyos.
2. **Warm Sand Theme**: Contrasting sections (e.g., "About Us" and "Contact Form") use a soft, tactile warm sand color (`#eadfc5`) with custom deep gold decorative SVG patterns, switching to high-contrast dark typography to ensure exceptional readability.

## Colors
The color palette represents fire, clay, and gold:

- **Diyo Gold (`#e2b740`):** Represents the flame, luxury, and prestige. Used as primary accents, link hover states, and light borders.
- **Deep Gold (`#b38b22`):** A darker, higher-contrast variant of the Diyo Gold. Specifically used on the **Warm Sand** theme for text and outline buttons to maintain accessibility.
- **Flicker Orange (`#ff7b00`):** Evokes fire and heat. Used in gradients, glow effects, and hover transitions.
- **Midnight Charcoal (`#0d0806`):** The dominant dark background. Deep and rich, preventing the cold look of pure black (`#000`).
- **Warm Sand (`#eadfc5`):** The dominant light section background. Earthy and elegant, avoiding the clinical look of pure white (`#fff`).
- **Warm Cream (`#fffbef`):** A soft cream container background used inside light sand sections (e.g., forms, info boxes).

## Typography
A sophisticated combination of a serif heading font and a modern sans-serif body font:

- **Headings (Cinzel):** A classic, elegant serif font inspired by Roman lettering, evoking timeless tradition and prestige.
- **Body (Montserrat):** A clean, highly readable geometric sans-serif font that keeps copy modern and legible at all viewport sizes.

## Layout
The grid system is designed to scale dynamically:
- **Desktop Grid**: Standard 2-column or 3-column layouts with `40px` to `60px` gaps.
- **Responsive Stacking**: Breaks down to a single-column layout on viewports below `992px` (laptops/tablets) and `768px` (mobile).

## Elevation & Depth
- **Midnight Cards**: Background `#160e0a` with a subtle `1px` gold border (`rgba(226,183,64, 0.1)`). On hover, it lifts slightly (translateY `-10px`) with a soft gold/orange shadow.
- **Sand Cards**: Background `#fffbef` with a light bronze border and a soft dark shadow to stand out elegantly from the sand background.

## Shapes
- **Inputs & Controls**: Rounded corners at `10px` (`rounded.sm`).
- **Cards**: Rounded corners at `15px` (`rounded.md`).
- **Hero Images & Forms**: Rounded corners at `20px` (`rounded.lg`).
- **Interactive Elements (Buttons, Badges, Icons)**: Fully rounded (`rounded.full`/`50px`) pill shapes.

## Components
- **Primary Button**: Uses a gold-to-orange gradient. Glows with shadow on hover. Text color must be the dark background color (`#0d0806`).
- **Outline Button**: Clean border with no initial fill. Fills fully with text swapping on hover.

## Do's and Don'ts

### Do
- Use **Deep Gold (`#b38b22`)** or **Dark Bronze (`#1a0f0a`)** for text and icons inside light sand sections.
- Open external social media links in new tabs (`target="_blank" rel="noopener"`).
- Maintain responsive stacking on mobile layout for all form rows.

### Don't
- Never place **Diyo Gold (`#e2b740`)** text on a **Warm Sand (`#eadfc5`)** background, as this fails color contrast standards.
- Do not use hard pure white backgrounds (`#ffffff`) or pure black backgrounds (`#000000`) for content containers; use the system's off-white cream or deep warm charcoal instead to preserve the luxury organic feel.
