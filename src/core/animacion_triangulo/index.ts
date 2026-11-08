// core/animacion_triangulo/index.ts
export { default as AnimacionTriangulo } from "./animacion_triangulo";

/**
 * Duración total de la animación (ms). Quien la use debe esperar este tiempo antes de
 * redirigir. Debe coincidir con los tiempos de animacion_triangulo.module.css:
 * círculo 0 – 2.8 s, triángulo 2.6 – 4.4 s, pausa hasta los 5 s.
 */
export const DURACION_ANIMACION_MS = 5000;

/**
 * Indica si la animación de entrada ya se mostró en esta carga de la página.
 * Vive solo en memoria: al recargar vuelve a false (se muestra de nuevo), pero al navegar
 * dentro del sistema se mantiene, así no se repite justo después de iniciar sesión.
 */
let entradaMostrada = false;
export const entradaYaMostrada = (): boolean => entradaMostrada;
export const marcarEntradaMostrada = (): void => {
  entradaMostrada = true;
};