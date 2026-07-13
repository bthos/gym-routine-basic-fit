Mobile nav drawer as on basic-fit.com: cream (#FBF7F0) panel, dotted separators, 3px purple left bar marks the active item, arrow-right on items with submenus; bottom block has icon utilities and a language row.

```jsx
<MobileMenu
  items={[
    { label: "Busca un club" }, { label: "Precios" },
    { id: "clubs", label: "Club e instalaciones", hasMenu: true },
    { label: "Clases colectivas" },
    { label: "Entrenamiento y consejos", hasMenu: true },
  ]}
  activeId="clubs"
  utilities={[{ icon: "user", label: "My Basic-Fit" }, { icon: "info", label: "Atención al cliente" }]}
/>
```
