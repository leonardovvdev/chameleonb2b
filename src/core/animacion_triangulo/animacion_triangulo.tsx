import { useEffect, useState, type CSSProperties } from "react";
import style from "./animacion_triangulo.module.css";

interface AnimacionTrianguloProps {
  /** Texto solo para lectores de pantalla (no se ve). */
  etiqueta?: string;
  /**
   * Velocidad: 1 = 5 s (entrada al sistema). Un valor menor la acelera
   * (0.4 = 2 s, útil mientras se verifica la sesión al recargar).
   */
  escala?: number;
}

/** Logo (círculo con el gorrión). Va en la carpeta `public/`. */
const LOGO_SRC = "/gorrion.png";

/** Grosor del trazo del círculo (debe coincidir con `stroke-width` del CSS). */
const GROSOR = 3;

/** Tamaño actual de la ventana: las líneas nacen justo en los bordes de la pantalla. */
const useVentana = () => {
  const [tamano, setTamano] = useState({ ancho: window.innerWidth, alto: window.innerHeight });

  useEffect(() => {
    const alCambiar = () => setTamano({ ancho: window.innerWidth, alto: window.innerHeight });
    window.addEventListener("resize", alCambiar);
    return () => window.removeEventListener("resize", alCambiar);
  }, []);

  return tamano;
};

/**
 * Animación a pantalla completa (dura DURACION_ANIMACION_MS, ver index.ts):
 * dos líneas entran desde el borde izquierdo y el derecho hacia el centro, dibujan un
 * círculo (una la mitad de arriba y la otra la de abajo) y después aparece el gorrión
 * dentro del círculo (antes aquí se dibujaba un triángulo).
 * Se reproduce una sola vez y queda con el dibujo completo.
 *
 * `pathLength={1}` normaliza cada trazo para animarlo con stroke-dashoffset
 * sin calcular longitudes.
 */
const AnimacionTriangulo = ({ etiqueta = "Cargando", escala = 1 }: AnimacionTrianguloProps) => {
  const { ancho, alto } = useVentana();

  const cx = ancho / 2;
  const cy = alto / 2;
  // Radio del círculo: más grande que antes para que el gorrión se vea con detalle.
  const r = Math.max(56, Math.min(160, Math.min(ancho, alto) * 0.24));

  // El logo ocupa justo el interior del círculo (la línea queda como marco).
  const diametroLogo = 2 * r - GROSOR;

  const lineaIzq = `M0 ${cy} H${cx - r} A${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const lineaDer = `M${ancho} ${cy} H${cx + r} A${r} ${r} 0 0 1 ${cx - r} ${cy}`;

  const estiloLogo: CSSProperties = {
    width: diametroLogo,
    height: diametroLogo,
    left: cx - diametroLogo / 2,
    top: cy - diametroLogo / 2,
  };

  return (
    <div className={style.pantalla} style={{ "--escala": escala } as CSSProperties}
         aria-live="polite" role="status">
      <svg className={style.dibujo} width={ancho} height={alto}
           viewBox={`0 0 ${ancho} ${alto}`} fill="none" aria-hidden="true">
        <path className={style.lineaIzq} pathLength={1} d={lineaIzq} />
        <path className={style.lineaDer} pathLength={1} d={lineaDer} />
      </svg>
      <img className={style.gorrion} style={estiloLogo} src={LOGO_SRC} alt=""
           aria-hidden="true" draggable={false} decoding="async" />
      <span className={style.soloLectores}>{etiqueta}</span>
    </div>
  );
};

export default AnimacionTriangulo;