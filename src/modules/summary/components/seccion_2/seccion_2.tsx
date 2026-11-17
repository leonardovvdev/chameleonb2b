import { useEffect, useState } from "react";
import style from "./seccion_2.module.css";
import { EVENTO_PERIODO, PERIODOS } from "../seccion_1/seccion_1";
import type { ResumenAnuncio } from "../../services/summary.service";

type Clave = (typeof PERIODOS)[number]["clave"];

const NOMBRE_PERIODO: Record<Clave, string> = {
  mes: "Este mes (por semana)",
  anio: "Este año (por mes)",
  dia: "Esta semana (por día)",
};

const MARCAS = 10; // marcas del eje Y
const MAX_CON_VALORES = 7; // con más grupos, el número solo sale al pasar el cursor

const formatear = (n: number) => n.toLocaleString("es-PE");

/* Paso entero y "redondo" del eje para que el valor más alto quepa en 10 marcas */
const pasoDelEje = (max: number) => {
  const crudo = Math.max(1, max / MARCAS);
  const magnitud = 10 ** Math.floor(Math.log10(crudo));
  const candidatos = [1, 2, 2.5, 3, 4, 5, 6, 8, 10].map((c) => c * magnitud);
  return candidatos.find((v) => v >= crudo && Number.isInteger(v)) ?? magnitud * 10;
};

const Seccion_2 = ({ datos }: { datos: ResumenAnuncio | null }) => {
  const [clave, setClave] = useState<Clave>(PERIODOS[0].clave);

  /* Se conecta a seccion_1: cuando cambia el periodo, el gráfico lo sigue */
  useEffect(() => {
    const alCambiar = (e: Event) => {
      const nueva = (e as CustomEvent<string>).detail;
      const periodo = PERIODOS.find((p) => p.clave === nueva);
      if (periodo) setClave(periodo.clave);
    };
    window.addEventListener(EVENTO_PERIODO, alCambiar);
    return () => window.removeEventListener(EVENTO_PERIODO, alCambiar);
  }, []);

  const serie = datos?.[clave].serie ?? [];

  const maximo = Math.max(0, ...serie.flatMap((s) => [s.visitas, s.revisualizaciones]));
  const paso = pasoDelEje(maximo);
  const tope = paso * MARCAS;
  const marcas = Array.from({ length: MARCAS }, (_, i) => paso * (i + 1));
  const conValores = serie.length <= MAX_CON_VALORES;

  const alto = (valor: number) => `${(valor / tope) * 100}%`;

  return (
    <section className={style.seccion}>
      <header className={style.titulo}>
        <p>Distribuidora Ferretera Gorrioncito</p>
        <p>Estadisticas - {new Date().getFullYear()}</p>
      </header>

      <div className={style.cuerpo}>
        <div
          className={style.grafico}
          role="img"
          aria-label={`${NOMBRE_PERIODO[clave]}: visitantes únicos y revisualizaciones del anuncio`}
        >
          {/* Eje Y */}
          <div className={style.ejeY} aria-hidden="true">
            {marcas.map((valor, i) => (
              <span
                key={valor}
                className={style.marca}
                style={{ bottom: `${((i + 1) / MARCAS) * 100}%` }}
              >
                {formatear(valor)}
              </span>
            ))}
          </div>

          {/* Grupos de barras: 4 semanas, 12 meses o 7 días */}
          <div className={style.area} key={clave}>
            {serie.map((punto) => (
              <div className={style.grupo} key={punto.etiqueta}>
                <div className={style.barras}>
                  <div
                    className={`${style.barra} ${style.barraVerde}`}
                    style={{ height: alto(punto.visitas) }}
                    title={`${punto.etiqueta}: ${formatear(punto.visitas)} visitantes únicos`}
                  >
                    {conValores && (
                      <span className={style.valor}>{formatear(punto.visitas)}</span>
                    )}
                  </div>
                  <div
                    className={`${style.barra} ${style.barraGris}`}
                    style={{ height: alto(punto.revisualizaciones) }}
                    title={`${punto.etiqueta}: ${formatear(punto.revisualizaciones)} revisualizaciones`}
                  >
                    {conValores && (
                      <span className={style.valor}>
                        {formatear(punto.revisualizaciones)}
                      </span>
                    )}
                  </div>
                </div>
                <span className={style.periodo}>{punto.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <ul className={style.leyenda}>
          <li>
            <span className={`${style.cuadro} ${style.barraVerde}`} />
            Visitantes únicos
          </li>
          <li>
            <span className={`${style.cuadro} ${style.barraGris}`} />
            Revisualización del anuncio
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Seccion_2;