// ============================================================
//  CONFIGURACIÓN DE DASHBOARDS
//  Aquí agregas tus dashboards de Tableau y Power BI.
//
//  Para TABLEAU (público):
//    1. Sube tu dashboard a https://public.tableau.com
//    2. Abre el dashboard y pulsa "Share" → copia la URL de embed
//    3. Pégala en "url"
//
//  Para POWER BI:
//    1. En Power BI Service pulsa "Compartir" → "Insertar informe"
//    2. Copia el código y extrae el src del iframe, pégalo en "url"
//    3. (Tu organización debe permitir la inserción pública)
//
//  Mientras "url" esté vacía, la tarjeta muestra una vista de
//  demostración con instrucciones.
// ============================================================

const DASHBOARDS = [
  {
    id: "usa-map",
    title: "Dashboard: USA",
    tool: "tableau",
    url: "https://public.tableau.com/views/Prueba1_17886357159990/Dashboard1?:showVizHome=no",
    description: "Mapa interactivo con indicadores por estado.",
    demo: "mapa"
  },
  {
    id: "callcenter",
    title: "Callcenter — datos",
    tool: "powerbi",
    url: "",
    description: "Tablero de métricas de atención, tiempos y satisfacción.",
    demo: "tabla"
  },
  {
    id: "ventas",
    title: "Análisis de ventas",
    tool: "powerbi",
    url: "",
    description: "Reporte de ventas mensuales por región y producto.",
    demo: "barras"
  },
  {
    id: "rrhh",
    title: "Recursos Humanos",
    tool: "tableau",
    url: "",
    description: "Rotación, ausentismo y headcount por departamento.",
    demo: "mapa"
  }
];

// Etiquetas y colores por herramienta
const TOOL_META = {
  tableau: { label: "Tableau", color: "#e8762d", badge: "#fdeee2" },
  powerbi: { label: "Power BI", color: "#f2c811", badge: "#fdf6d8" }
};
