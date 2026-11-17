import { useState } from "react";
import style from "./seccion_1.module.css";
import type { ResumenAnuncio } from "../../services/summary.service";

/* Los números salen del backend (props `datos`); aquí solo se define el orden y el texto de cada periodo. */
export const PERIODOS = [
  { clave: "mes", etiqueta: "Visitantes únicos al mes" },
  { clave: "anio", etiqueta: "Visitantes únicos al año" },
  { clave: "dia", etiqueta: "Visitantes únicos este día" },
] as const;

/** Evento que avisa a otras secciones (seccion_2) qué periodo quedó activo */
export const EVENTO_PERIODO = "periodoCambiado";
const formatear = (n?: number) => (n === undefined ? "—" : n.toLocaleString("es-PE"));

const IconoOjo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

const Seccion_1 = ({ datos }: { datos: ResumenAnuncio | null }) => {
  const [indice, setIndice] = useState(0);
  const periodo = PERIODOS[indice];
  const valores = datos?.[periodo.clave];

  const siguientePeriodo = () => {
  const nuevo = (indice + 1) % PERIODOS.length;
  setIndice(nuevo);
  window.dispatchEvent(new CustomEvent(EVENTO_PERIODO, { detail: PERIODOS[nuevo].clave }));
};

  return (
    <div className={style.seccion}>
      <div className={style.tarjetas}>
        {/* Visitas: al pulsar cambia mes → año → día */}
        <div className={style.halo}>
          <button
            type="button"
            className={`${style.tarjeta} ${style.tarjetaBoton}`}
            onClick={siguientePeriodo}
            aria-label={`${periodo.etiqueta}. Pulsa para cambiar el periodo`}
          >
            <span className={`${style.circulo} ${style.circuloVerde}`}>
              <IconoOjo className={style.iconoOjo} />
            </span>

            <span className={style.datos} key={periodo.clave}>
              <span className={style.numero}>{formatear(valores?.visitas)}</span>
              <span className={style.etiqueta}>{periodo.etiqueta}</span>
            </span>
          </button>
        </div>

        {/* Revisualización del anuncio: sigue el mismo periodo que las visitas */}
        <div className={style.tarjeta}>
          <span className={`${style.circulo} ${style.circuloGris}`} />

          <span className={style.datos} key={periodo.clave}>
            <span className={style.numero}>
              {formatear(valores?.revisualizaciones)}
            </span>
            <span className={`${style.etiqueta} ${style.etiquetaAzul}`}>
              revisualización del anuncio
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Seccion_1;