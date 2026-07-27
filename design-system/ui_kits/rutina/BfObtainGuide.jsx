const DSBfGuide = window.BasicFitDesignSystem_1cb8a2;
const { Icon: BfGuideIcon } = DSBfGuide;

const BF_GUIDE_TITLE = {
  es: "Cómo obtener los JSON Basic-Fit",
  en: "How to get Basic-Fit JSON exports",
  be: "Як атрымаць JSON Basic-Fit",
};

const BF_GUIDE_CLOSE = { es: "Cerrar", en: "Close", be: "Закрыць" };

const BF_GUIDE_HTML = {
  es: `
    <ol>
      <li>Abre <strong>my.basic-fit.com</strong> e inicia sesión <em>en el sitio de Basic-Fit</em> (nosotros no pedimos esa contraseña).</li>
      <li>Ve a <strong>Mis datos personales</strong> (<code>/information</code>).</li>
      <li>Pulsa <strong>Exportar mis datos (JSON)</strong> y <strong>Exportar datos fitness (JSON)</strong>.</li>
      <li>Vuelve aquí y elige los archivos.</li>
    </ol>
    <p><strong>Privacidad:</strong> solo se guardan visitas, mediciones y club de casa. No se almacenan email, IBAN, amigos ni pagos.</p>
    <p><a href="https://my.basic-fit.com/information" target="_blank" rel="noopener noreferrer">Abrir my.basic-fit.com/information ↗</a></p>
  `,
  en: `
    <ol>
      <li>Open <strong>my.basic-fit.com</strong> and sign in <em>on Basic-Fit’s site</em> (we never collect that password).</li>
      <li>Go to <strong>My personal data</strong> (<code>/information</code>).</li>
      <li>Tap <strong>Export my data (JSON)</strong> and <strong>Export fitness data (JSON)</strong>.</li>
      <li>Return here and choose the files.</li>
    </ol>
    <p><strong>Privacy:</strong> only visits, measurements, and home club are stored. No email, IBAN, friends, or payments.</p>
    <p><a href="https://my.basic-fit.com/information" target="_blank" rel="noopener noreferrer">Open my.basic-fit.com/information ↗</a></p>
  `,
  be: `
    <ol>
      <li>Адкрыйце <strong>my.basic-fit.com</strong> і ўвайдзіце <em>на сайце Basic-Fit</em> (мы не збіраем гэты пароль).</li>
      <li>Перайдзіце ў <strong>Мае асабістыя даныя</strong> (<code>/information</code>).</li>
      <li>Націсніце <strong>Exportar mis datos (JSON)</strong> і <strong>Exportar datos fitness (JSON)</strong>.</li>
      <li>Вярніцеся сюды і абярыце файлы.</li>
    </ol>
    <p><strong>Прыватнасць:</strong> захоўваюцца толькі візіты, вымярэнні і хатні клуб. Без email, IBAN, сяброў ці плацяжоў.</p>
    <p><a href="https://my.basic-fit.com/information" target="_blank" rel="noopener noreferrer">Адкрыць my.basic-fit.com/information ↗</a></p>
  `,
};

const BF_ARTICLE_CSS = `
  .bf-guide-article ol { padding-left: 20px; display: grid; gap: 10px; margin: 0 0 16px; }
  .bf-guide-article p  { margin: 8px 0; }
  .bf-guide-article strong { font-weight: 700; }
  .bf-guide-article code {
    font: 13px/1.4 monospace;
    background: var(--bf-grey-1);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .bf-guide-article a { color: var(--text-link); font-weight: 600; }
`;

/** Mockup — BfObtainGuide overlay (state: open). Mirror GuideOverlay: focus trap, Escape, focus return via onClose. */
function BfObtainGuide({ locale = "es", onClose }) {
  const title = BF_GUIDE_TITLE[locale] || BF_GUIDE_TITLE.es;
  const closeLabel = BF_GUIDE_CLOSE[locale] || "Close";
  const html = BF_GUIDE_HTML[locale] || BF_GUIDE_HTML.es;
  const closeRef = React.useRef(null);

  React.useEffect(() => {
    closeRef.current && closeRef.current.focus();
    function handleKey(e) {
      if (e.key === "Escape" && onClose) onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <style>{BF_ARTICLE_CSS}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bf-obtain-guide-title"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 400,
          background: "var(--bf-white)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{
          flexShrink: 0,
          background: "var(--bf-white)",
          borderBottom: "1px solid var(--bf-grey-2)",
          padding: "var(--space-4) var(--page-gutter)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span id="bf-obtain-guide-title" style={{ font: "var(--text-h4)", color: "var(--bf-ink)" }}>
            {title}
          </span>
          <button
            ref={closeRef}
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", background: "none", border: "none",
              borderRadius: "var(--radius-control)", cursor: "pointer", flexShrink: 0,
            }}
          >
            <BfGuideIcon name="x" size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-6) var(--page-gutter) var(--space-10)" }}>
          <article
            className="bf-guide-article"
            style={{ font: "var(--text-body-sm)", color: "var(--bf-ink)", lineHeight: 1.6, maxWidth: 600 }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}

window.BfObtainGuide = BfObtainGuide;
