/* @ds-bundle: {"format":4,"namespace":"BasicFitDesignSystem_1cb8a2","components":[{"name":"Accordion","sourcePath":"components/composite/Accordion.jsx"},{"name":"ArticleCard","sourcePath":"components/composite/ArticleCard.jsx"},{"name":"EquipmentCard","sourcePath":"components/composite/EquipmentCard.jsx"},{"name":"ExerciseCard","sourcePath":"components/composite/ExerciseCard.jsx"},{"name":"NavMenu","sourcePath":"components/composite/NavMenu.jsx"},{"name":"PriceCard","sourcePath":"components/composite/PriceCard.jsx"},{"name":"SectionBanner","sourcePath":"components/composite/SectionBanner.jsx"},{"name":"SummaryTable","sourcePath":"components/composite/SummaryTable.jsx"},{"name":"BackToTop","sourcePath":"components/primitives/BackToTop.jsx"},{"name":"Badge","sourcePath":"components/primitives/Badge.jsx"},{"name":"Button","sourcePath":"components/primitives/Button.jsx"},{"name":"CheckList","sourcePath":"components/primitives/CheckList.jsx"},{"name":"DetailItem","sourcePath":"components/primitives/DetailItem.jsx"},{"name":"FilterPill","sourcePath":"components/primitives/FilterPill.jsx"},{"name":"Icon","sourcePath":"components/primitives/Icon.jsx"},{"name":"NoteItem","sourcePath":"components/primitives/NoteItem.jsx"},{"name":"RuleItem","sourcePath":"components/primitives/RuleItem.jsx"},{"name":"StatCard","sourcePath":"components/primitives/StatCard.jsx"},{"name":"Tag","sourcePath":"components/primitives/Tag.jsx"},{"name":"ClubFinder","sourcePath":"components/sections/ClubFinder.jsx"},{"name":"FeatureSplit","sourcePath":"components/sections/FeatureSplit.jsx"},{"name":"Hero","sourcePath":"components/sections/Hero.jsx"},{"name":"MobileMenu","sourcePath":"components/sections/MobileMenu.jsx"},{"name":"PageFooter","sourcePath":"components/sections/PageFooter.jsx"},{"name":"PageHeader","sourcePath":"components/sections/PageHeader.jsx"},{"name":"SiteHeader","sourcePath":"components/sections/SiteHeader.jsx"}],"sourceHashes":{"components/composite/Accordion.jsx":"1776eaf344a8","components/composite/ArticleCard.jsx":"9dadc9c3a0fa","components/composite/EquipmentCard.jsx":"26382b9e7805","components/composite/ExerciseCard.jsx":"a51a60afee79","components/composite/NavMenu.jsx":"f63b7c88527e","components/composite/PriceCard.jsx":"ff847b7ba7f5","components/composite/SectionBanner.jsx":"e534271f3e1a","components/composite/SummaryTable.jsx":"785d9b6d445f","components/primitives/BackToTop.jsx":"9a30801b1a8e","components/primitives/Badge.jsx":"6e363d23ce19","components/primitives/Button.jsx":"b3ceb07862a4","components/primitives/CheckList.jsx":"20e203da5272","components/primitives/DetailItem.jsx":"e7a8d7218169","components/primitives/FilterPill.jsx":"a06c235b62ce","components/primitives/Icon.jsx":"707d46860a43","components/primitives/NoteItem.jsx":"228a24c13136","components/primitives/RuleItem.jsx":"2a71f2a80d98","components/primitives/StatCard.jsx":"a3befa8c6a3f","components/primitives/Tag.jsx":"abce6101ca7d","components/sections/ClubFinder.jsx":"d5f8a012c695","components/sections/FeatureSplit.jsx":"ec36c217bdc6","components/sections/Hero.jsx":"e3aba335c7ca","components/sections/MobileMenu.jsx":"adee94e832fb","components/sections/PageFooter.jsx":"23e54a82a2ff","components/sections/PageHeader.jsx":"a4e80b6f6858","components/sections/SiteHeader.jsx":"b11918d8a560","ui_kits/rutina/CatalogScreen.jsx":"a24c492f7307","ui_kits/rutina/RoutineScreen.jsx":"ebf8816b0852","ui_kits/rutina/kit-data.js":"3dcbc01c4b4c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BasicFitDesignSystem_1cb8a2 = window.BasicFitDesignSystem_1cb8a2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/composite/Accordion.jsx
try { (() => {
/** FAQ accordion (site pattern): hairline rows, bold question, +/− toggle. */
function Accordion({
  items = [],
  defaultOpen = -1,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderBottom: "1px solid var(--border-default)"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(isOpen ? -1 : i),
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        width: "100%",
        padding: "18px 4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        font: "700 17px/1.35 var(--font-sans)",
        color: "var(--bf-ink)"
      }
    }, /*#__PURE__*/React.createElement("span", null, it.question), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        font: "400 26px/1 var(--font-sans)",
        color: "var(--bf-purple)",
        flexShrink: 0,
        transform: isOpen ? "rotate(45deg)" : "none",
        transition: "transform var(--motion-fast)"
      }
    }, "+")), isOpen && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 4px 18px",
        font: "var(--text-body-md)",
        color: "var(--text-body)",
        maxWidth: 720
      }
    }, it.answer));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/composite/NavMenu.jsx
try { (() => {
/** Horizontal section nav (site style): white bar, ink links, 4px deep-purple underline on active. */
function NavMenu({
  items = [],
  activeId,
  onSelect,
  style
}) {
  const [hoverId, setHoverId] = React.useState(null);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--bf-white)",
      borderBottom: "1px solid var(--border-default)",
      padding: "0 var(--page-gutter)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      gap: 8,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none"
    }
  }, items.map(it => {
    const active = it.id === activeId;
    const lit = active || it.id === hoverId;
    return /*#__PURE__*/React.createElement("li", {
      key: it.id,
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#" + it.id,
      onClick: onSelect ? () => {
        onSelect(it.id);
      } : undefined,
      onMouseEnter: () => setHoverId(it.id),
      onMouseLeave: () => setHoverId(null),
      style: {
        display: "block",
        padding: "14px 16px 10px",
        font: `${active ? 700 : 500} 15px/1.2 var(--font-sans)`,
        textDecoration: "none",
        color: "var(--bf-ink)",
        borderBottom: "4px solid " + (lit ? "var(--bf-purple-deep)" : "transparent"),
        transition: "border-color var(--motion-fast)"
      }
    }, it.label));
  })));
}
Object.assign(__ds_scope, { NavMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/NavMenu.jsx", error: String((e && e.message) || e) }); }

// components/composite/SectionBanner.jsx
try { (() => {
/** Full-width tinted banner for phase info / warmup / cooldown sections. */
function SectionBanner({
  tone = "brand",
  title,
  subtitle,
  items = [],
  children,
  style
}) {
  const tones = {
    brand: {
      background: "var(--bf-orange)",
      color: "var(--bf-white)"
    },
    ink: {
      background: "var(--bf-ink)",
      color: "var(--bf-white)"
    },
    neutral: {
      background: "var(--bf-sand)",
      color: "var(--bf-ink)"
    },
    success: {
      background: "var(--bf-success)",
      color: "var(--bf-white)"
    },
    info: {
      background: "var(--bf-info)",
      color: "var(--bf-white)"
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-6)",
      ...tones[tone],
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-h2)",
      color: "inherit",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-heading)",
      margin: 0
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-md)",
      margin: "8px 0 0",
      opacity: tone === "neutral" ? 1 : 0.92,
      color: tone === "neutral" ? "var(--text-body)" : "inherit"
    }
  }, subtitle), items.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "var(--space-4) 0 0",
      paddingLeft: 20,
      display: "grid",
      gap: 6,
      font: "var(--text-body-md)"
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, it))), children);
}
Object.assign(__ds_scope, { SectionBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/SectionBanner.jsx", error: String((e && e.message) || e) }); }

// components/composite/SummaryTable.jsx
try { (() => {
/** Routine summary table: ink header row, hairline dividers, hover row tint. */
function SummaryTable({
  columns = [],
  rows = [],
  style
}) {
  const [hoverRow, setHoverRow] = React.useState(-1);
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      background: "var(--bf-white)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--border-default)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: "var(--bf-ink)"
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: "12px 16px",
      textAlign: "left",
      color: "var(--bf-white)",
      font: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase"
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    onMouseEnter: () => setHoverRow(ri),
    onMouseLeave: () => setHoverRow(-1),
    style: {
      background: hoverRow === ri ? "var(--bf-orange-tint)" : "transparent"
    }
  }, r.map((cell, ci) => /*#__PURE__*/React.createElement("td", {
    key: ci,
    style: {
      padding: "12px 16px",
      borderTop: "1px solid var(--border-default)",
      font: ci === 0 ? "600 14px/1.4 var(--font-sans)" : "var(--text-body-sm)",
      color: ci === 0 ? "var(--text-heading)" : "var(--text-body)"
    }
  }, cell))))));
}
Object.assign(__ds_scope, { SummaryTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/SummaryTable.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Badge.jsx
try { (() => {
/** Small solid rectangular status label: weights, phase, gym availability. */
function Badge({
  tone = "brand",
  size = "md",
  children,
  style
}) {
  const tones = {
    brand: {
      background: "var(--bf-orange)",
      color: "var(--bf-white)"
    },
    ink: {
      background: "var(--bf-ink)",
      color: "var(--bf-white)"
    },
    success: {
      background: "var(--bf-success)",
      color: "var(--bf-white)"
    },
    info: {
      background: "var(--bf-info)",
      color: "var(--bf-white)"
    },
    danger: {
      background: "var(--bf-danger)",
      color: "var(--bf-white)"
    },
    neutral: {
      background: "var(--bf-grey-2)",
      color: "var(--bf-ink-2)"
    }
  };
  const pad = size === "lg" ? "8px 20px" : "4px 12px";
  const fs = size === "lg" ? 15 : 13;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: pad,
      font: `700 ${fs}px/1.2 var(--font-sans)`,
      borderRadius: "var(--radius-sm)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Badge.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Button.jsx
try { (() => {
/** Basic-Fit button: rectangular (4px), bold UPPERCASE label, purple action color. */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  href,
  onClick,
  children,
  style
}) {
  const pad = size === "lg" ? "16px 32px" : size === "sm" ? "9px 18px" : "13px 26px";
  const fontSize = size === "lg" ? 16 : size === "sm" ? 13 : 15;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: pad,
    font: `700 ${fontSize}px/1 var(--font-sans)`,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    borderRadius: "var(--radius-btn)",
    cursor: disabled ? "default" : "pointer",
    textDecoration: "none",
    border: "2px solid transparent",
    transition: "background var(--motion-fast), color var(--motion-fast), border-color var(--motion-fast)",
    boxSizing: "border-box"
  };
  const variants = {
    primary: {
      background: "var(--bf-purple)",
      color: "var(--bf-white)",
      borderColor: "var(--bf-purple)"
    },
    outline: {
      background: "var(--bf-white)",
      color: "var(--bf-purple)",
      borderColor: "var(--bf-purple)"
    },
    secondary: {
      background: "var(--bf-ink)",
      color: "var(--bf-white)",
      borderColor: "var(--bf-ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--bf-purple)",
      borderColor: "transparent"
    },
    inverse: {
      background: "var(--bf-white)",
      color: "var(--bf-ink)",
      borderColor: "var(--bf-white)"
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyles = {
    primary: {
      background: "var(--bf-purple-dark)",
      borderColor: "var(--bf-purple-dark)"
    },
    outline: {
      background: "var(--bf-purple-tint)"
    },
    secondary: {
      background: "#000",
      borderColor: "#000"
    },
    ghost: {
      background: "var(--bf-purple-tint)"
    },
    inverse: {
      background: "var(--bf-grey-2)",
      borderColor: "var(--bf-grey-2)"
    }
  };
  const s = {
    ...base,
    ...variants[variant],
    ...(hover && !disabled ? hoverStyles[variant] : {}),
    ...(disabled ? {
      opacity: 0.45,
      pointerEvents: "none"
    } : {}),
    ...style
  };
  const Tag = href ? "a" : "button";
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    onClick: onClick,
    disabled: disabled && !href,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Button.jsx", error: String((e && e.message) || e) }); }

// components/primitives/DetailItem.jsx
try { (() => {
/** Label + value block inside exercise cards (series×reps, descanso, intensidad). */
function DetailItem({
  label,
  value,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-grey-1)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-3)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 17px/1.3 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, value));
}
Object.assign(__ds_scope, { DetailItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/DetailItem.jsx", error: String((e && e.message) || e) }); }

// components/primitives/FilterPill.jsx
try { (() => {
/** Toggleable filter chip (site style): white with 1px ink border; active = solid orange. */
function FilterPill({
  active = false,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const s = {
    padding: "11px 22px",
    font: "600 15px/1.2 var(--font-sans)",
    borderRadius: "var(--radius-control)",
    cursor: "pointer",
    border: "1px solid " + (active ? "var(--bf-orange)" : "var(--border-control)"),
    background: active ? "var(--bf-orange)" : "var(--bf-white)",
    color: active ? "var(--bf-white)" : "var(--bf-ink)",
    boxShadow: hover && !active ? "inset 0 0 0 1px var(--border-control)" : "none",
    transition: "all var(--motion-fast)",
    whiteSpace: "nowrap",
    ...style
  };
  return /*#__PURE__*/React.createElement("button", {
    style: s,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children);
}
Object.assign(__ds_scope, { FilterPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/FilterPill.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Icon.jsx
try { (() => {
/* Feather/Lucide (ISC) stroke icon subset — thin-line style matching basic-fit.com. */
const PATHS = {
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  })),
  check: /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }),
  "chevron-down": /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }),
  "arrow-up": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "19",
    x2: "12",
    y2: "5"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "5 12 12 5 19 12"
  })),
  "arrow-right": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 5 19 12 12 19"
  })),
  "map-pin": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "3"
  })),
  user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: "4"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  })),
  clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  })),
  droplet: /*#__PURE__*/React.createElement("path", {
    d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
  }),
  calendar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
  })),
  pencil: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 20h9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
  })),
  "alert-triangle": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
  })),
  "alert-octagon": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
    points: "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12.01",
    y2: "16"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  })),
  menu: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
  })),
  smartphone: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "2",
    width: "14",
    height: "20",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "18",
    x2: "12.01",
    y2: "18"
  })),
  phone: /*#__PURE__*/React.createElement("path", {
    d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
  }),
  globe: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "12",
    x2: "22",
    y2: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
  })),
  /* UI */
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  minus: /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }),
  "chevron-up": /*#__PURE__*/React.createElement("polyline", {
    points: "18 15 12 9 6 15"
  }),
  "chevron-left": /*#__PURE__*/React.createElement("polyline", {
    points: "15 18 9 12 15 6"
  }),
  "chevron-right": /*#__PURE__*/React.createElement("polyline", {
    points: "9 18 15 12 9 6"
  }),
  "external-link": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "15 3 21 3 21 9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "14",
    x2: "21",
    y2: "3"
  })),
  download: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 10 12 15 17 10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
  })),
  play: /*#__PURE__*/React.createElement("polygon", {
    points: "6 3 20 12 6 21 6 3"
  }),
  filter: /*#__PURE__*/React.createElement("polygon", {
    points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
  }),
  sliders: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "21",
    x2: "5",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "9",
    x2: "5",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "21",
    x2: "12",
    y2: "11"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "7",
    x2: "12",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "19",
    y1: "21",
    x2: "19",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "19",
    y1: "11",
    x2: "19",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "13",
    x2: "8",
    y2: "13"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "7",
    x2: "15",
    y2: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16",
    y1: "15",
    x2: "22",
    y2: "15"
  })),
  bell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.73 21a2 2 0 0 1-3.46 0"
  })),
  lock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "11",
    width: "18",
    height: "11",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 11V7a5 5 0 0 1 10 0v4"
  })),
  star: /*#__PURE__*/React.createElement("polygon", {
    points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  }),
  home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  })),
  mail: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "22 6 12 13 2 6"
  })),
  "credit-card": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "4",
    width: "22",
    height: "16",
    rx: "2",
    ry: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "10",
    x2: "23",
    y2: "10"
  })),
  repeat: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "17 1 21 5 17 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 11V9a4 4 0 0 1 4-4h14"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "7 23 3 19 7 15"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 13v2a4 4 0 0 1-4 4H3"
  })),
  /* Fitness */
  dumbbell: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "9",
    width: "4",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "19",
    y: "9",
    width: "4",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  })),
  flame: /*#__PURE__*/React.createElement("path", {
    d: "M12 2c-3.5 4-6 7.5-6 11a6 6 0 0 0 12 0c0-2-.8-3.6-2-5 .3 2-.6 3.3-1.5 3-.9-.3-.5-2-.5-3.5C14 5.5 13 3.5 12 2z"
  }),
  heart: /*#__PURE__*/React.createElement("path", {
    d: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"
  }),
  "trending-up": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polyline", {
    points: "23 6 13.5 15.5 8.5 10.5 1 18"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "17 6 23 6 23 12"
  })),
  "bar-chart-2": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "20",
    x2: "18",
    y2: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "20",
    x2: "12",
    y2: "4"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "20",
    x2: "6",
    y2: "14"
  })),
  target: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2"
  })),
  timer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "2",
    x2: "14",
    y2: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "2",
    x2: "12",
    y2: "5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "13",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
  })),
  trophy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M8 21h8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v5a5 5 0 0 1-10 0V4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 5h2a2 2 0 0 1-2 4h-1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 5H5a2 2 0 0 0 2 4h1"
  }))
};

/** Thin-line stroke icon (Feather/Lucide subset). Inherits color via currentColor. */
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  style
}) {
  const glyph = PATHS[name];
  if (!glyph) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      display: "block",
      ...style
    }
  }, glyph);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Icon.jsx", error: String((e && e.message) || e) }); }

// components/primitives/BackToTop.jsx
try { (() => {
/** Fixed square back-to-top button (bottom-right). */
function BackToTop({
  visible = true,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": "Volver arriba",
    onClick: onClick || (() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "fixed",
      bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
      right: "calc(20px + env(safe-area-inset-right, 0px))",
      width: 48,
      height: 48,
      borderRadius: "var(--radius-btn)",
      border: "none",
      cursor: "pointer",
      background: hover ? "var(--bf-purple-dark)" : "var(--bf-purple)",
      color: "var(--bf-white)",
      fontSize: 20,
      lineHeight: 1,
      boxShadow: "var(--shadow-raised)",
      zIndex: 999,
      transition: "background var(--motion-fast)",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up",
    size: 22,
    style: {
      margin: "0 auto"
    }
  }));
}
Object.assign(__ds_scope, { BackToTop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/BackToTop.jsx", error: String((e && e.message) || e) }); }

// components/primitives/CheckList.jsx
try { (() => {
/** Bullet list with orange checkmarks (site USP pattern). */
function CheckList({
  items = [],
  size = "md",
  style
}) {
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: size === "lg" ? 12 : 8,
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      font: size === "lg" ? "var(--text-body-lg)" : "var(--text-body-md)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-orange)",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: size === "lg" ? 20 : 17,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("span", null, it))));
}
Object.assign(__ds_scope, { CheckList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/CheckList.jsx", error: String((e && e.message) || e) }); }

// components/composite/PriceCard.jsx
try { (() => {
/** Subscription plan card: lowercase plan name, price block, features, CTA. */
function PriceCard({
  name,
  price,
  oldPrice,
  period = "/ 4 semanas",
  feeNote,
  promoNote,
  features = [],
  flag,
  ctaLabel = "empezar",
  ctaHref = "#",
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      background: "var(--bf-white)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
      border: flag ? "2px solid var(--bf-orange)" : "1px solid var(--border-default)",
      display: "grid",
      alignContent: "start",
      ...style
    }
  }, flag && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-orange)",
      color: "var(--bf-white)",
      textAlign: "center",
      font: "700 13px/1.2 var(--font-sans)",
      padding: "6px 12px",
      textTransform: "uppercase",
      letterSpacing: ".05em"
    }
  }, flag), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-5)",
      display: "grid",
      gap: "var(--space-4)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "800 24px/1 var(--font-display)",
      textTransform: "lowercase",
      color: "var(--bf-ink)",
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      flexWrap: "wrap"
    }
  }, oldPrice && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 18px/1 var(--font-sans)",
      color: "var(--bf-grey-4)",
      textDecoration: "line-through"
    }
  }, oldPrice), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "800 34px/1 var(--font-display)",
      color: "var(--bf-ink)"
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-muted)"
    }
  }, period)), feeNote && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-caption)",
      color: "var(--text-muted)",
      marginTop: 4
    }
  }, feeNote), promoNote && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 14px/1.4 var(--font-sans)",
      color: "var(--bf-orange-deep)",
      marginTop: 6
    }
  }, promoNote)), features.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.CheckList, {
    items: features
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    href: ctaHref,
    style: {
      justifySelf: "stretch"
    }
  }, ctaLabel)));
}
Object.assign(__ds_scope, { PriceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/PriceCard.jsx", error: String((e && e.message) || e) }); }

// components/primitives/NoteItem.jsx
try { (() => {
/** Titled note card ("Notas importantes" list). */
function NoteItem({
  title,
  tone = "neutral",
  children,
  style
}) {
  const tones = {
    neutral: {
      borderColor: "var(--border-default)",
      titleColor: "var(--text-heading)"
    },
    success: {
      borderColor: "var(--bf-success)",
      titleColor: "var(--bf-success)"
    },
    danger: {
      borderColor: "var(--bf-danger)",
      titleColor: "var(--bf-danger)"
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-white)",
      border: "1px solid var(--border-default)",
      borderTop: `3px solid ${t.borderColor}`,
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)",
      ...style
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-h4)",
      color: t.titleColor,
      marginBottom: 6
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-body)"
    }
  }, children));
}
Object.assign(__ds_scope, { NoteItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/NoteItem.jsx", error: String((e && e.message) || e) }); }

// components/primitives/RuleItem.jsx
try { (() => {
/** Compact rule card (reglas generales grid). icon is an Icon name. */
function RuleItem({
  icon,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      background: "var(--bf-white)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)",
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-purple)",
      marginTop: 1
    }
  }, typeof icon === "string" ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }) : icon), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-body)"
    }
  }, children));
}
Object.assign(__ds_scope, { RuleItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/RuleItem.jsx", error: String((e && e.message) || e) }); }

// components/primitives/StatCard.jsx
try { (() => {
/** Big stat block: number + qualifier ("1600+ clubs", "27 máquinas"). */
function StatCard({
  value,
  label,
  inverse = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: inverse ? "var(--bf-ink)" : "var(--bf-white)",
      border: inverse ? "none" : "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      textAlign: "center",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-stat)",
      color: inverse ? "var(--bf-orange)" : "var(--bf-orange-deep)"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-body-sm)",
      color: inverse ? "rgba(255,255,255,.85)" : "var(--text-muted)",
      marginTop: 6
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Tag.jsx
try { (() => {
/** Outlined rectangular category label (site "NUTRICIÓN" style): uppercase, 1px ink border. */
function Tag({
  tone = "neutral",
  children,
  style
}) {
  const tones = {
    neutral: {
      background: "var(--bf-white)",
      color: "var(--bf-ink)",
      border: "1px solid var(--bf-ink)"
    },
    primary: {
      background: "var(--bf-white)",
      color: "var(--bf-orange-deep)",
      border: "1px solid var(--bf-orange)"
    },
    secondary: {
      background: "var(--bf-grey-1)",
      color: "var(--bf-ink-2)",
      border: "1px solid var(--bf-grey-3)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      font: "700 12px/1.3 var(--font-sans)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      borderRadius: "var(--radius-sm)",
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Tag.jsx", error: String((e && e.message) || e) }); }

// components/composite/ArticleCard.jsx
try { (() => {
/** Article/content card (site style): square photo with white sharp card
    overlapping its bottom, category tag, uppercase title, body, "Leer más →". */
function ArticleCard({
  image,
  imageAlt = "",
  tag,
  title,
  body,
  linkLabel = "Leer más",
  href = "#",
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      position: "relative",
      paddingBottom: 48,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "4 / 3",
      background: "var(--bf-grey-2)",
      overflow: "hidden"
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: imageAlt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-white)",
      padding: "var(--space-5)",
      margin: "-90px 0 0 var(--space-6)",
      position: "relative",
      display: "grid",
      gap: 12,
      justifyItems: "start"
    }
  }, tag && /*#__PURE__*/React.createElement(__ds_scope.Tag, null, tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-h4)",
      textTransform: "uppercase",
      margin: 0,
      color: "var(--bf-ink)",
      letterSpacing: "var(--tracking-heading)"
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-body)",
      margin: 0
    }
  }, body), /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      justifySelf: "end",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      font: "700 16px/1 var(--font-sans)",
      color: "var(--bf-ink)",
      textDecoration: "none"
    }
  }, linkLabel, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-orange)",
      transform: "rotate(45deg)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 16,
    strokeWidth: 2.5
  })))));
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/composite/EquipmentCard.jsx
try { (() => {
/** Catalog card for one machine: photo, name, model, muscles, description, links. */
function EquipmentCard({
  name,
  modelCode,
  series,
  imageUrl,
  primaryMuscles = [],
  secondaryMuscles = [],
  description,
  weight,
  videoHref,
  manualHref,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: hover ? "var(--shadow-raised)" : "var(--shadow-card)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--motion-base), transform var(--motion-base)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 190,
      background: "var(--bf-grey-1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }
  }, imageUrl ? /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: typeof name === "string" ? name : "máquina",
    style: {
      maxWidth: "88%",
      maxHeight: "88%",
      objectFit: "contain"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-caption)",
      color: "var(--bf-grey-4)"
    }
  }, "Sin imagen"), weight != null && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "brand",
    style: {
      position: "absolute",
      top: 12,
      right: 12
    }
  }, weight, " kg")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-h3)",
      margin: 0
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-caption)",
      color: "var(--text-muted)",
      margin: "4px 0 10px"
    }
  }, series ? `Matrix ${series} · ` : "", modelCode), (primaryMuscles.length > 0 || secondaryMuscles.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 10
    }
  }, primaryMuscles.map((m, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: "p" + i,
    tone: "primary"
  }, m)), secondaryMuscles.map((m, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: "s" + i,
    tone: "secondary"
  }, m))), description && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-body)",
      margin: "0 0 12px"
    }
  }, description), (videoHref || manualHref) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, videoHref && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: videoHref
  }, "ver tutorial"), manualHref && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "sm",
    href: manualHref
  }, "manual"))));
}
Object.assign(__ds_scope, { EquipmentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/EquipmentCard.jsx", error: String((e && e.message) || e) }); }

// components/composite/ExerciseCard.jsx
try { (() => {
/** Full exercise card for routine day sections. Mobile-first; details grid wraps. */
function ExerciseCard({
  number,
  name,
  muscles = [],
  details = [],
  equipment,
  alternative,
  imageUrl,
  steps = [],
  videoHref,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      boxShadow: hover ? "var(--shadow-raised)" : "var(--shadow-card)",
      transition: "box-shadow var(--motion-base)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: "50%",
      background: "var(--bf-orange)",
      color: "var(--bf-white)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      font: "800 16px/1 var(--font-display)"
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--text-h3)",
      margin: 0
    }
  }, name), muscles.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginTop: 8
    }
  }, muscles.map((m, i) => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: i,
    tone: i === 0 ? "primary" : "secondary"
  }, m))))), details.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "var(--space-2)",
      margin: "var(--space-4) 0 0"
    }
  }, details.map((d, i) => /*#__PURE__*/React.createElement(__ds_scope.DetailItem, {
    key: i,
    label: d.label,
    value: d.value
  }))), (equipment || alternative) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)",
      font: "var(--text-body-sm)",
      color: "var(--text-body)",
      display: "grid",
      gap: 4
    }
  }, equipment && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-heading)"
    }
  }, "Equipo:"), " ", equipment), alternative && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("em", null, "Alternativa:"), " ", alternative)), imageUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: typeof name === "string" ? name : "equipo",
    style: {
      maxWidth: "100%",
      maxHeight: 240,
      borderRadius: "var(--radius-md)",
      background: "var(--bf-grey-1)"
    }
  })), steps.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)",
      background: "var(--bf-grey-1)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--bf-orange-deep)",
      marginBottom: 8
    }
  }, "T\xE9cnica"), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      paddingLeft: 20,
      font: "var(--text-body-sm)",
      color: "var(--text-body)",
      display: "grid",
      gap: 4
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, s)))), videoHref && /*#__PURE__*/React.createElement("a", {
    href: videoHref,
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: "inline-block",
      marginTop: "var(--space-3)",
      font: "600 14px/1.3 var(--font-sans)",
      color: "var(--text-link)"
    }
  }, "Ver tutorial en YouTube \u2192"));
}
Object.assign(__ds_scope, { ExerciseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/composite/ExerciseCard.jsx", error: String((e && e.message) || e) }); }

// components/sections/ClubFinder.jsx
try { (() => {
/** "Encuentra tu club" card: title with orange highlight, search input, city chips. */
function ClubFinder({
  title = "Encuentra tu",
  highlight = "club",
  subtitle,
  placeholder = "Busca por ciudad, calle, código postal o nombre del club",
  cities = [],
  onSearch,
  style
}) {
  const [q, setQ] = React.useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-white)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-raised)",
      padding: "var(--space-6)",
      display: "grid",
      gap: "var(--space-4)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-h2)",
      textTransform: "uppercase",
      margin: 0,
      color: "var(--bf-ink)",
      letterSpacing: "var(--tracking-heading)"
    }
  }, title, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-orange)"
    }
  }, highlight)), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-md)",
      color: "var(--text-body)",
      margin: "6px 0 0"
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: "1px solid var(--border-control)",
      borderRadius: "var(--radius-control)",
      padding: "13px 16px",
      background: "var(--bf-white)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-purple)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 22
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: e => e.key === "Enter" && onSearch && onSearch(q),
    placeholder: placeholder,
    style: {
      border: "none",
      outline: "none",
      flex: 1,
      background: "transparent",
      font: "400 16px/1.3 var(--font-sans)",
      color: "var(--bf-ink)"
    }
  })), cities.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: 10
    }
  }, cities.map((c, i) => /*#__PURE__*/React.createElement(__ds_scope.FilterPill, {
    key: i,
    onClick: () => onSearch && onSearch(c),
    style: {
      textAlign: "center"
    }
  }, c))));
}
Object.assign(__ds_scope, { ClubFinder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/ClubFinder.jsx", error: String((e && e.message) || e) }); }

// components/sections/FeatureSplit.jsx
try { (() => {
/** Alternating photo + text content block (site pattern). */
function FeatureSplit({
  title,
  body,
  checks = [],
  imageUrl,
  imageAlt = "",
  cta,
  reverse = false,
  tone = "light",
  style
}) {
  const dark = tone === "ink";
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: dark ? "var(--bf-ink)" : "transparent",
      padding: dark ? "var(--space-8) var(--page-gutter)" : "var(--space-8) var(--page-gutter)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "var(--space-8)",
      alignItems: "center"
    }
  }, imageUrl && /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: imageAlt,
    style: {
      width: "100%",
      display: "block",
      borderRadius: "var(--radius-xl)",
      aspectRatio: "4 / 3",
      objectFit: "cover",
      background: "var(--bf-grey-1)",
      order: reverse ? 2 : 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      order: reverse ? 1 : 2,
      display: "grid",
      gap: "var(--space-4)",
      justifyItems: "start"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-h2)",
      textTransform: "uppercase",
      margin: 0,
      color: dark ? "var(--bf-white)" : "var(--bf-ink)",
      letterSpacing: "var(--tracking-heading)"
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-md)",
      color: dark ? "rgba(255,255,255,.85)" : "var(--text-body)",
      margin: 0
    }
  }, body), checks.length > 0 && /*#__PURE__*/React.createElement(__ds_scope.CheckList, {
    items: checks
  }), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: dark ? "inverse" : "secondary",
    href: cta.href
  }, cta.label))));
}
Object.assign(__ds_scope, { FeatureSplit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/FeatureSplit.jsx", error: String((e && e.message) || e) }); }

// components/sections/Hero.jsx
try { (() => {
/** Homepage hero: full-bleed orange gradient band, heavy uppercase ink headline,
    purple CTAs, optional full-height photo with diagonal cut on the right. */
function Hero({
  title,
  highlight,
  subtitle,
  note,
  imageUrl,
  imageAlt = "",
  overlayText,
  primaryCta,
  secondaryCta,
  tone = "orange",
  style
}) {
  const orange = tone === "orange";
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: orange ? "linear-gradient(160deg, #F98A2B 0%, #F27A27 60%, #D66D23 100%)" : "var(--bf-white)",
      position: "relative",
      overflow: "hidden",
      ...style
    }
  }, orange && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 24,
      bottom: 24,
      width: 130,
      height: 130,
      backgroundImage: "radial-gradient(rgba(255,255,255,.55) 2px, transparent 2.5px)",
      backgroundSize: "16px 16px",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: imageUrl ? "minmax(300px, 5fr) minmax(280px, 6fr)" : "1fr",
      alignItems: "stretch",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-10) var(--page-gutter)",
      display: "grid",
      gap: "var(--space-4)",
      justifyItems: "start",
      alignContent: "center"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-hero)",
      textTransform: "uppercase",
      color: "var(--bf-ink)",
      margin: 0,
      letterSpacing: "var(--tracking-heading)"
    }
  }, title, highlight && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: orange ? "var(--bf-ink)" : "var(--bf-orange)"
    }
  }, highlight))), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "700 18px/1.3 var(--font-sans)",
      textTransform: "uppercase",
      color: "var(--bf-ink)",
      margin: 0
    }
  }, subtitle), note && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-sm)",
      color: orange ? "var(--bf-ink-2)" : "var(--text-muted)",
      margin: 0,
      maxWidth: 460
    }
  }, note), (primaryCta || secondaryCta) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
      marginTop: 8
    }
  }, primaryCta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    href: primaryCta.href
  }, primaryCta.label), secondaryCta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    href: secondaryCta.href
  }, secondaryCta.label))), imageUrl && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: 380,
      clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: imageUrl,
    alt: imageAlt,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), overlayText && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      alignContent: "center",
      padding: "0 8%",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "800 clamp(36px, 5vw, 64px)/1.02 var(--font-display)",
      fontStyle: "italic",
      textTransform: "uppercase",
      color: "var(--bf-white)",
      letterSpacing: "0.01em",
      textShadow: "0 2px 24px rgba(0,0,0,.25)"
    }
  }, overlayText)))));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/Hero.jsx", error: String((e && e.message) || e) }); }

// components/sections/MobileMenu.jsx
try { (() => {
const BF_LOGO = "https://www.basic-fit.com/on/demandware.static/Sites-BFE-Site/-/default/dw312ce583/img/svg/logo-bf-orange.svg";

/** Mobile nav drawer (site style): cream panel, dotted separators,
    purple left bar on the active item, arrow for items with submenus. */
function MobileMenu({
  items = [],
  activeId,
  utilities = [],
  language = "español",
  ctaLabel = "empezar",
  logoSrc = BF_LOGO,
  onClose,
  style
}) {
  const dotted = {
    borderBottom: "1px dotted var(--bf-grey-4)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-cream)",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      maxWidth: 420,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Basic-Fit",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm"
  }, ctaLabel), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Cerrar",
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--bf-ink)",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 22
  })))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "grid"
    }
  }, items.map((it, i) => {
    const active = it.id === activeId;
    return /*#__PURE__*/React.createElement("a", {
      key: i,
      href: it.href || "#",
      style: {
        ...dotted,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: active ? "16px 18px 16px 26px" : "16px 18px",
        font: "700 16px/1.3 var(--font-sans)",
        color: "var(--bf-ink)",
        textDecoration: "none",
        borderLeft: active ? "3px solid var(--bf-purple)" : "3px solid transparent"
      }
    }, it.label, it.hasMenu && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--bf-ink)"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "arrow-right",
      size: 20
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      padding: "12px 0"
    }
  }, utilities.map((u, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: u.href || "#",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 18px",
      font: "500 15px/1.3 var(--font-sans)",
      color: "var(--bf-ink)",
      textDecoration: "none"
    }
  }, u.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: u.icon,
    size: 18
  }), u.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      ...{
        borderTop: "1px dotted var(--bf-grey-4)"
      },
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 18px",
      font: "500 15px/1.3 var(--font-sans)",
      color: "var(--bf-ink)"
    }
  }, language, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18
  }))));
}
Object.assign(__ds_scope, { MobileMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/MobileMenu.jsx", error: String((e && e.message) || e) }); }

// components/sections/PageFooter.jsx
try { (() => {
/** Dark site footer: contact row, link columns, legal lines. */
function PageFooter({
  logoSrc,
  columns = [],
  lines = [],
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--bf-ink)",
      color: "rgba(255,255,255,.75)",
      padding: "var(--space-10) var(--page-gutter) var(--space-8)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto",
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement("div", null, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Basic-Fit",
    style: {
      height: 26,
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: "800 14px/1 var(--font-display)",
      color: "var(--bf-orange)",
      textTransform: "uppercase",
      letterSpacing: "0.06em"
    }
  }, "Basic-Fit")), columns.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "var(--space-6)"
    }
  }, columns.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1.3 var(--font-sans)",
      color: "var(--bf-white)",
      marginBottom: "var(--space-3)"
    }
  }, col.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: 8
    }
  }, col.links.map((l, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href || "#",
    style: {
      font: "var(--text-body-sm)",
      color: "rgba(255,255,255,.75)",
      fontWeight: 400
    }
  }, l.label))))))), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      font: "var(--text-caption)",
      borderTop: "1px solid rgba(255,255,255,.15)",
      paddingTop: "var(--space-5)"
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: 0
    }
  }, l))), children));
}
Object.assign(__ds_scope, { PageFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/PageFooter.jsx", error: String((e && e.message) || e) }); }

// components/sections/PageHeader.jsx
try { (() => {
/** Ink page hero OR light content header (site style). Default tone "light":
    white bg, breadcrumb, big uppercase ink title. */
function PageHeader({
  tone = "light",
  breadcrumb,
  title,
  subtitle,
  badge,
  badgeTone = "brand",
  meta,
  logoSrc,
  style
}) {
  const light = tone === "light";
  const Badge = ({
    children
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 20px",
      font: "700 14px/1.2 var(--font-sans)",
      borderRadius: "var(--radius-sm)",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: badgeTone === "success" ? "var(--bf-success)" : badgeTone === "ink" ? "var(--bf-ink)" : "var(--bf-orange)",
      color: "var(--bf-white)"
    }
  }, children);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: light ? "var(--bf-white)" : "var(--bf-ink)",
      color: light ? "var(--bf-ink)" : "var(--bf-white)",
      padding: "var(--space-6) var(--page-gutter) var(--space-8)",
      borderBottom: light ? "1px solid var(--border-default)" : "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto"
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Basic-Fit",
    style: {
      height: 28,
      display: "block",
      marginBottom: "var(--space-5)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: "800 15px/1 var(--font-display)",
      color: "var(--bf-orange)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: "var(--space-5)"
    }
  }, "Basic-Fit"), breadcrumb && /*#__PURE__*/React.createElement("nav", {
    style: {
      font: "var(--text-body-sm)",
      color: light ? "var(--text-muted)" : "rgba(255,255,255,.7)",
      marginBottom: "var(--space-3)",
      display: "flex",
      gap: 8
    }
  }, breadcrumb.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      gap: 8
    }
  }, i > 0 && /*#__PURE__*/React.createElement("span", null, "/"), b.href ? /*#__PURE__*/React.createElement("a", {
    href: b.href,
    style: {
      color: "inherit",
      fontWeight: 500
    }
  }, b.label) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: light ? "var(--bf-ink)" : "#fff"
    }
  }, b.label)))), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--text-h1)",
      color: "inherit",
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-heading)",
      margin: 0
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-lg)",
      color: light ? "var(--text-body)" : "rgba(255,255,255,.8)",
      margin: "10px 0 0",
      maxWidth: 640
    }
  }, subtitle), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(Badge, null, badge)), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      marginTop: "var(--space-4)",
      background: light ? "var(--bf-grey-1)" : "rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-md)",
      padding: "10px 18px",
      font: "var(--text-body-sm)",
      color: light ? "var(--text-body)" : "rgba(255,255,255,.85)"
    }
  }, meta)));
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/sections/SiteHeader.jsx
try { (() => {
const BF_LOGO = "https://www.basic-fit.com/on/demandware.static/Sites-BFE-Site/-/default/dw312ce583/img/svg/logo-bf-orange.svg";
/** Site header (basic-fit.com): cream USP bar with ink text + utility links,
    then white logo/nav row with search icon and purple CTA. */
function SiteHeader({
  usps = [],
  utilities = [],
  navItems = [],
  ctaLabel = "empezar",
  ctaHref = "#",
  logoSrc = BF_LOGO,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, (usps.length > 0 || utilities.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-cream)",
      padding: "10px var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto",
      display: "flex",
      gap: "var(--space-6)",
      alignItems: "center",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, usps.map((u, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      font: "500 14px/1.2 var(--font-sans)",
      color: "var(--bf-ink)",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, u.icon && (typeof u.icon === "string" && !u.icon.includes(".") && !u.icon.includes("/") ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: u.icon,
    size: 16
  }) : /*#__PURE__*/React.createElement("img", {
    src: u.icon,
    alt: "",
    style: {
      height: 16
    }
  })), u.label !== undefined ? u.label : u)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), utilities.map((u, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: u.href || "#",
    style: {
      font: "500 14px/1.2 var(--font-sans)",
      color: "var(--bf-ink)",
      whiteSpace: "nowrap",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, u.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: u.icon,
    size: 15
  }), u.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--bf-white)",
      borderBottom: "1px solid var(--border-default)",
      padding: "14px var(--page-gutter)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max-width)",
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Basic-Fit",
    style: {
      height: 24,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 2,
      flex: 1,
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, navItems.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: it.href || "#",
    style: {
      padding: "10px 14px",
      font: "500 15px/1.2 var(--font-sans)",
      color: "var(--bf-ink)",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, it.label, it.hasMenu && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-ink-3)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14
  }))))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bf-ink)",
      padding: "0 4px",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 20
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: ctaHref,
    style: {
      flexShrink: 0
    }
  }, ctaLabel))));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rutina/CatalogScreen.jsx
try { (() => {
const DS2 = window.BasicFitDesignSystem_1cb8a2;
const {
  PageHeader: CatHeader,
  FilterPill,
  EquipmentCard,
  StatCard,
  PageFooter: CatFooter
} = DS2;
function CatalogScreen() {
  const data = window.BF_KIT_DATA;
  const [lang, setLang] = React.useState("es");
  const [cat, setCat] = React.useState("all");
  const items = data.equipment.filter(e => cat === "all" || e.cat === cat);
  const wrap = {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 var(--page-gutter)"
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Cat\xE1logo de equipamiento",
    style: {
      background: "var(--bf-grey-1)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(CatHeader, {
    breadcrumb: [{
      label: "Home",
      href: "#"
    }, {
      label: "Equipamiento"
    }],
    title: "Cat\xE1logo de equipamiento",
    subtitle: "M\xE1quinas Matrix Aura en tus gimnasios Basic-Fit de M\xE1laga"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: "27",
    label: "m\xE1quinas"
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "7",
    label: "gimnasios"
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "3",
    label: "idiomas"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      marginTop: "var(--space-6)",
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "Idioma"), ["en", "es", "be"].map(l => /*#__PURE__*/React.createElement(FilterPill, {
    key: l,
    active: lang === l,
    onClick: () => setLang(l)
  }, l.toUpperCase()))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "Categor\xEDa"), data.cats.map(c => /*#__PURE__*/React.createElement(FilterPill, {
    key: c.id,
    active: cat === c.id,
    onClick: () => setCat(c.id)
  }, c.es)))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      marginTop: "var(--space-5)",
      paddingBottom: "var(--space-10)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 14,
      alignItems: "start"
    }
  }, items.map(e => /*#__PURE__*/React.createElement(EquipmentCard, {
    key: e.id,
    name: e.name[lang],
    modelCode: e.model,
    series: "Aura",
    imageUrl: e.img,
    primaryMuscles: e.prim,
    secondaryMuscles: e.sec,
    description: e.desc[lang],
    weight: e.weight,
    videoHref: "#",
    manualHref: "https://jhtsupport.com/eng/matrix/manuals/" + e.id
  })), items.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      background: "#fff",
      borderRadius: 12,
      padding: 40,
      textAlign: "center",
      color: "var(--text-muted)"
    }
  }, "Sin resultados")), /*#__PURE__*/React.createElement(CatFooter, {
    lines: ["Datos: Matrix Fitness + Basic-Fit Málaga", "27 máquinas · 7 gimnasios · EN/ES/BE"]
  }));
}
window.CatalogScreen = CatalogScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rutina/CatalogScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rutina/RoutineScreen.jsx
try { (() => {
const DS = window.BasicFitDesignSystem_1cb8a2;
const {
  PageHeader,
  NavMenu,
  PageFooter,
  BackToTop,
  SectionBanner,
  ExerciseCard,
  SummaryTable,
  RuleItem,
  NoteItem,
  Badge
} = DS;
const phaseStats = [["Intensidad", "60-65% del máximo"], ["Descanso", "60-90 segundos"], ["Frecuencia", "3 días por semana"], ["Duración", "3 meses (12 semanas)"]];
function SectionTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "var(--text-h2)",
      textTransform: "uppercase",
      color: "var(--bf-ink)",
      margin: "0 0 4px"
    }
  }, children);
}
function RoutineScreen() {
  const wrap = {
    maxWidth: 760,
    margin: "0 auto",
    padding: "0 var(--page-gutter)",
    display: "grid",
    gap: "var(--space-8)"
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Rutina \u2014 Fase 1",
    style: {
      background: "var(--bf-grey-1)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    breadcrumb: [{
      label: "Home",
      href: "#"
    }, {
      label: "Rutina"
    }],
    title: "Rutina M\xE1laga",
    subtitle: "Programa de readaptaci\xF3n para principiantes",
    badge: "FASE 1 \u2014 ADAPTACI\xD3N (Meses 1-3)",
    meta: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(DS.Icon, {
      name: "map-pin",
      size: 16
    }), " Basic-Fit M\xE1laga \u2014 Bulevar Louis Pasteur 20 \xB7 Actualizado: Febrero 2026")
  }), /*#__PURE__*/React.createElement(NavMenu, {
    activeId: "lunes",
    items: [{
      id: "fase-info",
      label: "Información"
    }, {
      id: "calentamiento",
      label: "Calentamiento"
    }, {
      id: "lunes",
      label: "Lunes"
    }, {
      id: "resumen",
      label: "Resumen"
    }, {
      id: "reglas",
      label: "Reglas"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      paddingTop: "var(--space-6)",
      paddingBottom: "var(--space-10)"
    }
  }, /*#__PURE__*/React.createElement(SectionBanner, {
    id: "fase-info",
    tone: "neutral",
    title: "Objetivos de la Fase 1",
    subtitle: "T\xE9cnica, preparaci\xF3n de articulaciones, adaptaci\xF3n del sistema nervioso central"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 10,
      marginTop: 16
    }
  }, phaseStats.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: "var(--bf-white)",
      borderRadius: 8,
      padding: 12,
      boxShadow: "var(--shadow-card)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 12px/1.3 var(--font-sans)",
      textTransform: "uppercase",
      letterSpacing: ".08em",
      color: "var(--text-muted)"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 15px/1.3 var(--font-sans)",
      marginTop: 2,
      color: "var(--bf-ink)"
    }
  }, v))))), /*#__PURE__*/React.createElement(SectionBanner, {
    id: "calentamiento",
    tone: "brand",
    title: "Calentamiento",
    subtitle: "Obligatorio \xB7 5-7 minutos",
    items: ["Elíptica o cinta de correr (5-7 minutos a ritmo suave)", "Rotaciones de hombros, cadera y rodillas", "1 serie de calentamiento antes de cada ejercicio (peso muy ligero)"]
  }), /*#__PURE__*/React.createElement("section", {
    id: "lunes",
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, null, "Lunes \u2014 Full Body A"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--text-body-sm)",
      color: "var(--text-muted)",
      margin: 0
    }
  }, "Enfoque: Piernas, Pecho, Espalda, Brazos, Core")), /*#__PURE__*/React.createElement(ExerciseCard, {
    number: 1,
    name: "Prensa de Piernas (Leg Press)",
    muscles: ["Cuádriceps", "Glúteos"],
    details: [{
      label: "Series × Repeticiones",
      value: "3 × 12"
    }, {
      label: "Descanso",
      value: "90 segundos"
    }, {
      label: "Intensidad",
      value: "3 reps en reserva"
    }],
    equipment: "Matrix Aura G3-S70 \u2014 Prensa de Piernas",
    imageUrl: "https://images.jhtassets.com/9051c73da092604e62d75966c281c425455fcc41/transformed/w_300",
    steps: ["Siéntese en el asiento con la espalda firmemente contra el respaldo", "Coloque los pies separados al ancho de los hombros en la plataforma", "Empuje la plataforma extendiendo las piernas casi completamente", "Regrese lentamente la plataforma a la posición inicial"],
    videoHref: "https://www.youtube.com/results?search_query=tutorial+prensa+de+piernas"
  }), /*#__PURE__*/React.createElement(ExerciseCard, {
    number: 2,
    name: "Prensa de Pecho (Chest Press)",
    muscles: ["Pecho", "Tríceps", "Hombros"],
    details: [{
      label: "Series × Repeticiones",
      value: "3 × 10"
    }, {
      label: "Descanso",
      value: "90 segundos"
    }],
    equipment: "Matrix Aura G3-S10 \u2014 Prensa de Pecho",
    alternative: "Banco plano + Mancuernas (zona de peso libre)",
    videoHref: "https://www.youtube.com/results?search_query=tutorial+prensa+pecho+maquina"
  }), /*#__PURE__*/React.createElement(ExerciseCard, {
    number: 3,
    name: "Jal\xF3n al Pecho (Lat Pulldown)",
    muscles: ["Espalda", "Bíceps"],
    details: [{
      label: "Series × Repeticiones",
      value: "3 × 12"
    }, {
      label: "Descanso",
      value: "90 segundos"
    }],
    equipment: "Matrix Aura G3-S30 \u2014 Jal\xF3n al Pecho",
    videoHref: "https://www.youtube.com/results?search_query=tutorial+jalon+al+pecho"
  })), /*#__PURE__*/React.createElement(SectionBanner, {
    tone: "ink",
    title: "Enfriamiento",
    subtitle: "5 minutos al final de cada sesi\xF3n",
    items: ["Estiramientos suaves de los grupos trabajados", "Respiración profunda, bajar pulsaciones"]
  }), /*#__PURE__*/React.createElement("section", {
    id: "resumen",
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Resumen semanal"), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement(SummaryTable, {
    columns: ["Día", "Enfoque", "Duración"],
    rows: [["Lunes", "Full Body A", "60 min"], ["Miércoles", "Full Body B", "60 min"], ["Sábado", "Full Body C", "60 min"]]
  }))), /*#__PURE__*/React.createElement("section", {
    id: "reglas",
    style: {
      display: "grid",
      gap: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Reglas generales"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(RuleItem, {
    icon: "droplet"
  }, "Bebe agua entre series"), /*#__PURE__*/React.createElement(RuleItem, {
    icon: "clock"
  }, "Respeta los descansos: 60-90 segundos"), /*#__PURE__*/React.createElement(RuleItem, {
    icon: "pencil"
  }, "Apunta tus pesos despu\xE9s de cada sesi\xF3n"), /*#__PURE__*/React.createElement(RuleItem, {
    icon: "alert-octagon"
  }, "Si hay dolor articular, para y consulta")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(NoteItem, {
    title: "Semana de descarga",
    tone: "danger"
  }, "Cada 4\xAA semana reduce los pesos un 40% y mant\xE9n las repeticiones."), /*#__PURE__*/React.createElement(NoteItem, {
    title: "Progresi\xF3n",
    tone: "success"
  }, "Cuando completes 3 \xD7 12 con t\xE9cnica limpia, sube 2,5-5 kg.")))), /*#__PURE__*/React.createElement(PageFooter, {
    columns: [{
      title: "Rutina",
      links: [{
        label: "Fase 1 — Adaptación"
      }, {
        label: "Equipamiento"
      }, {
        label: "Progresión"
      }]
    }, {
      title: "Club",
      links: [{
        label: "Basic-Fit Málaga"
      }, {
        label: "Horarios 24/7"
      }]
    }],
    lines: ["Programa personal — no sustituye asesoramiento médico", "Equipamiento: Matrix Aura · Basic-Fit Málaga"]
  }), /*#__PURE__*/React.createElement(BackToTop, null));
}
window.RoutineScreen = RoutineScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rutina/RoutineScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/rutina/kit-data.js
try { (() => {
// Shared demo data for the Basic-Fit rutina UI kit (abbreviated from data/equipment.json)
window.BF_KIT_DATA = {
  equipment: [{
    id: "g3-s70",
    name: {
      es: "Prensa de Piernas",
      en: "Leg Press",
      be: "Жым нагамі"
    },
    model: "G3-S70",
    cat: "legs",
    img: "https://images.jhtassets.com/9051c73da092604e62d75966c281c425455fcc41/transformed/w_300",
    prim: ["Cuádriceps"],
    sec: ["Glúteos"],
    weight: 45,
    desc: {
      es: "Prensa de piernas sentado para el tren inferior.",
      en: "Seated leg press for lower body.",
      be: "Жым нагамі седзячы для ніжняй часткі цела."
    }
  }, {
    id: "g3-s10",
    name: {
      es: "Prensa de Pecho",
      en: "Chest Press",
      be: "Жым ад грудзей"
    },
    model: "G3-S10",
    cat: "chest",
    img: "https://images.jhtassets.com/aade812e103cdbcfeebf40679e3a74723a65ef68/transformed/w_300",
    prim: ["Pectoral mayor"],
    sec: ["Tríceps", "Deltoides anterior"],
    weight: 32,
    desc: {
      es: "Imita el press de banca en un entorno controlado.",
      en: "Mimics bench press in a controlled environment.",
      be: "Імітуе жым штангі ў кантраляваным асяроддзі."
    }
  }, {
    id: "g3-s30",
    name: {
      es: "Jalón al Pecho",
      en: "Lat Pulldown",
      be: "Цяга верхняга блока"
    },
    model: "G3-S30",
    cat: "back",
    prim: ["Dorsal ancho"],
    sec: ["Bíceps"],
    weight: 39,
    desc: {
      es: "Jalón vertical para el desarrollo de la espalda.",
      en: "Vertical pull for back development.",
      be: "Вертыкальная цяга для развіцця спіны."
    }
  }, {
    id: "g3-s20",
    name: {
      es: "Prensa de Hombros",
      en: "Shoulder Press",
      be: "Жым ад плячэй"
    },
    model: "G3-S20",
    cat: "shoulders",
    prim: ["Deltoides"],
    sec: ["Tríceps"],
    desc: {
      es: "Press vertical de hombros sentado.",
      en: "Seated overhead shoulder press.",
      be: "Жым ад плячэй седзячы."
    }
  }, {
    id: "g3-s40",
    name: {
      es: "Curl de Bíceps",
      en: "Arm Curl",
      be: "Згінанне рук"
    },
    model: "G3-S40",
    cat: "arms",
    prim: ["Bíceps"],
    sec: [],
    weight: 20,
    desc: {
      es: "Curl de bíceps con apoyo de brazos.",
      en: "Supported biceps curl.",
      be: "Згінанне рук на біцэпс з упорам."
    }
  }, {
    id: "g3-s50",
    name: {
      es: "Abdominales",
      en: "Abdominal",
      be: "Прэс"
    },
    model: "G3-S50",
    cat: "core",
    prim: ["Recto abdominal"],
    sec: [],
    desc: {
      es: "Crunch abdominal con resistencia regulable.",
      en: "Weighted abdominal crunch.",
      be: "Скручванні з рэгулюемым супрацівам."
    }
  }],
  cats: [{
    id: "all",
    es: "Todas"
  }, {
    id: "chest",
    es: "Pecho"
  }, {
    id: "back",
    es: "Espalda"
  }, {
    id: "shoulders",
    es: "Hombros"
  }, {
    id: "arms",
    es: "Brazos"
  }, {
    id: "legs",
    es: "Piernas"
  }, {
    id: "core",
    es: "Core"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/rutina/kit-data.js", error: String((e && e.message) || e) }); }

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.EquipmentCard = __ds_scope.EquipmentCard;

__ds_ns.ExerciseCard = __ds_scope.ExerciseCard;

__ds_ns.NavMenu = __ds_scope.NavMenu;

__ds_ns.PriceCard = __ds_scope.PriceCard;

__ds_ns.SectionBanner = __ds_scope.SectionBanner;

__ds_ns.SummaryTable = __ds_scope.SummaryTable;

__ds_ns.BackToTop = __ds_scope.BackToTop;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CheckList = __ds_scope.CheckList;

__ds_ns.DetailItem = __ds_scope.DetailItem;

__ds_ns.FilterPill = __ds_scope.FilterPill;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.NoteItem = __ds_scope.NoteItem;

__ds_ns.RuleItem = __ds_scope.RuleItem;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ClubFinder = __ds_scope.ClubFinder;

__ds_ns.FeatureSplit = __ds_scope.FeatureSplit;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.MobileMenu = __ds_scope.MobileMenu;

__ds_ns.PageFooter = __ds_scope.PageFooter;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
