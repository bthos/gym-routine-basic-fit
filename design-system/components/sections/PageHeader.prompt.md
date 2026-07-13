Content-page header in site style: white background, Basic-Fit logo (pass `logoSrc`, else plain-type wordmark), breadcrumb, big uppercase title, subtitle, optional badge + meta panel. Use `tone="ink"` for a dark variant.

```jsx
<PageHeader
  logoSrc="https://www.basic-fit.com/on/demandware.static/Sites-BFE-Site/-/default/dw312ce583/img/svg/logo-bf-orange.svg"
  breadcrumb={[{ label: "Home", href: "#" }, { label: "Rutina" }]}
  title="Rutina Málaga"
  subtitle="Programa de readaptación para principiantes"
  badge="FASE 1 — ADAPTACIÓN (Meses 1-3)"
/>
```
