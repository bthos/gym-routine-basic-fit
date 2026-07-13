Site chrome from basic-fit.com: white USP bar (ink text, right-aligned utilities like "My Basic-Fit · Atención al cliente · ES") + white row with logo, nav links (chevron via `hasMenu`), search glyph, purple uppercase CTA.

```jsx
<SiteHeader
  usps={["1600+ Clubs", "Mejor Equipamiento", "App Basic-Fit gratuita"]}
  utilities={[{ label: "My Basic-Fit" }, { label: "ES" }]}
  navItems={[{ label: "Busca un club" }, { label: "Club e instalaciones", hasMenu: true }]}
  ctaLabel="empezar"
/>
```
