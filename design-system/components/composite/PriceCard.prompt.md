Subscription plan card mirroring the site's pricing grid: lowercase heavy plan name, strike-through old price + big new price, promo/fee notes, orange-check features, full-width CTA. `flag="Todo incluido"` adds the orange ribbon.

```jsx
<PriceCard
  name="ultimate" flag="Todo incluido"
  oldPrice="34,99 €" price="9,99 €" period="/ 4 semanas"
  feeNote="1,00 € cuota de inscripción"
  promoNote="Primeras 4 semanas por 9,99 € + una mochila"
  features={["Entrena en Europa", "Invita a un amigo siempre", "Yanga Sports Water"]}
/>
```
