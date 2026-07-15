const DS = window.BasicFitDesignSystem_1cb8a2;
const { PageHeader, NavMenu, PageFooter, BackToTop, SectionBanner, ExerciseCard, SummaryTable, RuleItem, NoteItem, Badge } = DS;

const phaseStats = [
  ["Intensidad", "60-65% del máximo"],
  ["Descanso", "60-90 segundos"],
  ["Frecuencia", "3 días por semana"],
  ["Duración", "3 meses (12 semanas)"],
];

function SectionTitle({ children }) {
  return <h2 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", margin: "0 0 4px" }}>{children}</h2>;
}

function RoutineScreen() {
  const wrap = { maxWidth: 760, margin: "0 auto", padding: "0 var(--page-gutter)", display: "grid", gap: "var(--space-8)" };
  return (
    <div data-screen-label="Rutina — Fase 1" style={{ background: "var(--bf-grey-1)", minHeight: "100%" }}>
      <PageHeader
        breadcrumb={[{ label: "Home", href: "#" }, { label: "Rutina" }]}
        title="Rutina"
        subtitle="Programa de readaptación para principiantes"
        badge="FASE 1 — ADAPTACIÓN (Meses 1-3)"
        meta={<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><DS.Icon name="map-pin" size={16} /> Basic-Fit [Gym Name] · Actualizado: Febrero 2026</span>}
      />
      <NavMenu activeId="lunes" items={[
        { id: "fase-info", label: "Información" },
        { id: "calentamiento", label: "Calentamiento" },
        { id: "lunes", label: "Lunes" },
        { id: "resumen", label: "Resumen" },
        { id: "reglas", label: "Reglas" },
      ]} />
      <div style={{ ...wrap, paddingTop: "var(--space-6)", paddingBottom: "var(--space-10)" }}>

        <SectionBanner id="fase-info" tone="neutral" title="Objetivos de la Fase 1"
          subtitle="Técnica, preparación de articulaciones, adaptación del sistema nervioso central">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginTop: 16 }}>
            {phaseStats.map(([k, v]) => (
              <div key={k} style={{ background: "var(--bf-white)", borderRadius: 8, padding: 12, boxShadow: "var(--shadow-card)" }}>
                <div style={{ font: "600 12px/1.3 var(--font-sans)", textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text-muted)" }}>{k}</div>
                <div style={{ font: "700 15px/1.3 var(--font-sans)", marginTop: 2, color: "var(--bf-ink)" }}>{v}</div>
              </div>
            ))}
          </div>
        </SectionBanner>

        <SectionBanner id="calentamiento" tone="brand" title="Calentamiento" subtitle="Obligatorio · 5-7 minutos"
          items={[
            "Elíptica o cinta de correr (5-7 minutos a ritmo suave)",
            "Rotaciones de hombros, cadera y rodillas",
            "1 serie de calentamiento antes de cada ejercicio (peso muy ligero)",
          ]} />

        <section id="lunes" style={{ display: "grid", gap: "var(--space-4)" }}>
          <div>
            <SectionTitle>Lunes — Full Body A</SectionTitle>
            <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: 0 }}>Enfoque: Piernas, Pecho, Espalda, Brazos, Core</p>
          </div>
          <ExerciseCard
            number={1}
            name="Prensa de Piernas (Leg Press)"
            muscles={["Cuádriceps", "Glúteos"]}
            details={[
              { label: "Series × Repeticiones", value: "3 × 12" },
              { label: "Descanso", value: "90 segundos" },
              { label: "Intensidad", value: "3 reps en reserva" },
            ]}
            equipment="Matrix Aura G3-S70 — Prensa de Piernas"
            imageUrl="https://images.jhtassets.com/9051c73da092604e62d75966c281c425455fcc41/transformed/w_300"
            steps={[
              "Siéntese en el asiento con la espalda firmemente contra el respaldo",
              "Coloque los pies separados al ancho de los hombros en la plataforma",
              "Empuje la plataforma extendiendo las piernas casi completamente",
              "Regrese lentamente la plataforma a la posición inicial",
            ]}
            videoHref="https://www.youtube.com/results?search_query=tutorial+prensa+de+piernas"
          />
          <ExerciseCard
            number={2}
            name="Prensa de Pecho (Chest Press)"
            muscles={["Pecho", "Tríceps", "Hombros"]}
            details={[
              { label: "Series × Repeticiones", value: "3 × 10" },
              { label: "Descanso", value: "90 segundos" },
            ]}
            equipment="Matrix Aura G3-S10 — Prensa de Pecho"
            alternative="Banco plano + Mancuernas (zona de peso libre)"
            videoHref="https://www.youtube.com/results?search_query=tutorial+prensa+pecho+maquina"
          />
          <ExerciseCard
            number={3}
            name="Jalón al Pecho (Lat Pulldown)"
            muscles={["Espalda", "Bíceps"]}
            details={[
              { label: "Series × Repeticiones", value: "3 × 12" },
              { label: "Descanso", value: "90 segundos" },
            ]}
            equipment="Matrix Aura G3-S30 — Jalón al Pecho"
            videoHref="https://www.youtube.com/results?search_query=tutorial+jalon+al+pecho"
          />
        </section>

        <SectionBanner tone="ink" title="Enfriamiento" subtitle="5 minutos al final de cada sesión"
          items={["Estiramientos suaves de los grupos trabajados", "Respiración profunda, bajar pulsaciones"]} />

        <section id="resumen" style={{ display: "grid", gap: "var(--space-4)" }}>
          <SectionTitle>Resumen semanal</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <SummaryTable
              columns={["Día", "Enfoque", "Duración"]}
              rows={[
                ["Lunes", "Full Body A", "60 min"],
                ["Miércoles", "Full Body B", "60 min"],
                ["Sábado", "Full Body C", "60 min"],
              ]}
            />
          </div>
        </section>

        <section id="reglas" style={{ display: "grid", gap: "var(--space-4)" }}>
          <SectionTitle>Reglas generales</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <RuleItem icon="droplet">Bebe agua entre series</RuleItem>
            <RuleItem icon="clock">Respeta los descansos: 60-90 segundos</RuleItem>
            <RuleItem icon="pencil">Apunta tus pesos después de cada sesión</RuleItem>
            <RuleItem icon="alert-octagon">Si hay dolor articular, para y consulta</RuleItem>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <NoteItem title="Semana de descarga" tone="danger">Cada 4ª semana reduce los pesos un 40% y mantén las repeticiones.</NoteItem>
            <NoteItem title="Progresión" tone="success">Cuando completes 3 × 12 con técnica limpia, sube 2,5-5 kg.</NoteItem>
          </div>
        </section>
      </div>

      <PageFooter
        columns={[
          { title: "Rutina", links: [{ label: "Fase 1 — Adaptación" }, { label: "Equipamiento" }, { label: "Progresión" }] },
          { title: "Club", links: [{ label: "Basic-Fit" }, { label: "Horarios 24/7" }] },
        ]}
        lines={[
        "Programa personal — no sustituye asesoramiento médico",
        "Equipamiento: Matrix Aura · Basic-Fit",
      ]} />
      <BackToTop />
    </div>
  );
}

window.RoutineScreen = RoutineScreen;
