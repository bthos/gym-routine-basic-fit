const DS2 = window.BasicFitDesignSystem_1cb8a2;
const { PageHeader: CatHeader, FilterPill, EquipmentCard, StatCard, PageFooter: CatFooter } = DS2;

function CatalogScreen() {
  const data = window.BF_KIT_DATA;
  const [lang, setLang] = React.useState("es");
  const [cat, setCat] = React.useState("all");
  const items = data.equipment.filter((e) => cat === "all" || e.cat === cat);
  const wrap = { maxWidth: 900, margin: "0 auto", padding: "0 var(--page-gutter)" };
  return (
    <div data-screen-label="Catálogo de equipamiento" style={{ background: "var(--bf-grey-1)", minHeight: "100%" }}>
      <CatHeader
        breadcrumb={[{ label: "Home", href: "#" }, { label: "Equipamiento" }]}
        title="Catálogo de equipamiento"
        subtitle="Máquinas Matrix Aura en tus gimnasios Basic-Fit"
      />
      <div style={{ ...wrap, marginTop: "var(--space-6)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <StatCard value="27" label="máquinas" />
          <StatCard value="7" label="gimnasios" />
          <StatCard value="3" label="idiomas" />
        </div>
      </div>
      <div style={{ ...wrap, marginTop: "var(--space-6)", display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>Idioma</span>
          {["en", "es", "be"].map((l) => (
            <FilterPill key={l} active={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</FilterPill>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)" }}>Categoría</span>
          {data.cats.map((c) => (
            <FilterPill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.es}</FilterPill>
          ))}
        </div>
      </div>
      <div style={{
        ...wrap, marginTop: "var(--space-5)", paddingBottom: "var(--space-10)",
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, alignItems: "start",
      }}>
        {items.map((e) => (
          <EquipmentCard key={e.id}
            name={e.name[lang]} modelCode={e.model} series="Aura"
            imageUrl={e.img}
            primaryMuscles={e.prim} secondaryMuscles={e.sec}
            description={e.desc[lang]}
            weight={e.weight}
            videoHref="#" manualHref={"https://jhtsupport.com/eng/matrix/manuals/" + e.id}
          />
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: "1 / -1", background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            Sin resultados
          </div>
        )}
      </div>
      <CatFooter lines={["Datos: Matrix Fitness + Basic-Fit", "27 máquinas · 7 gimnasios · EN/ES/BE"]} />
    </div>
  );
}

window.CatalogScreen = CatalogScreen;
