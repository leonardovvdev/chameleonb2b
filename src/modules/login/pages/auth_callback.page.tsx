import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/contexts/auth.context";
import { precargarListaPersonal } from "../../../core/services";
import {
  AnimacionTriangulo,
  DURACION_ANIMACION_MS,
  marcarEntradaMostrada,
} from "../../../core/animacion_triangulo";
import { precargarPrimeraPaginaStaff } from "../../list/controllers/list.controller";
import { procesarRetornoGoogle } from "../controllers/login.controller";
import style from "./auth_callback.page.module.css";

const esperar = (ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms));

/**
 * Qué se precarga mientras corre la animación, según la ruta de destino.
 * Para otro módulo, agrega su ruta aquí.
 */
const PRECARGA_POR_RUTA: Record<string, () => Promise<unknown>> = {
  "/list": () =>
    Promise.allSettled([
      precargarListaPersonal(), //     cargos, roles, jefes directos y fotocheck
      precargarPrimeraPaginaStaff(), // primera página de la tabla + sus fotos
    ]),
};

/** Lanza la precarga del destino sin esperarla: la animación manda el tiempo. */
const precargarDestino = (destino: string): void => {
  const ruta = destino.split("?")[0].split("#")[0];
  void PRECARGA_POR_RUTA[ruta]?.().catch(() => {
    /* si falla, la pantalla pedirá sus datos normalmente */
  });
};

/** Solo se aceptan rutas internas (evita redirigir a otro sitio). */
const esRutaInterna = (ruta: unknown): ruta is string =>
  typeof ruta === "string" && ruta.startsWith("/") && !ruta.startsWith("//");

/** Marco del error: fondo de selva + tarjeta blanca centrada (igual que el login). */
const Pantalla = ({ children }: { children: ReactNode }) => (
  <div className={style.pantalla}>
    <img className={style.fondo} src="/fondoselva.jpg" alt="" />
    {children}
  </div>
);

const IconoAlerta = () => (
  <svg className={style.iconoSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshCustomer } = useAuth();
  const estado = useLocation().state as { destino?: string } | null;

  const [error, setError] = useState("");
  const ejecutado = useRef(false);

  useEffect(() => {
    // Evita la doble ejecución de React.StrictMode en desarrollo.
    if (ejecutado.current) return;
    ejecutado.current = true;

    // Arranca junto con la animación: la redirección nunca ocurre antes de que termine.
    const animacion = esperar(DURACION_ANIMACION_MS);

    // Caso 1: login con correo y contraseña (ya entró; solo falta mostrar la animación).
    if (esRutaInterna(estado?.destino)) {
      const destino = estado.destino;
      precargarDestino(destino); // la sesión ya existe: se precarga durante los 5 s
      animacion.then(() => {
        marcarEntradaMostrada(); // evita repetir la animación en ProtectedRoute
        navigate(destino, { replace: true });
      });
      return;
    }

    // Caso 2: vuelta de Google.
    procesarRetornoGoogle(refreshCustomer).then(async (resultado) => {
      if (resultado.ok) {
        precargarDestino(resultado.destino); // en paralelo con lo que falta de animación
        await animacion; // aunque ya cargó todo, espera a que termine el dibujo
        marcarEntradaMostrada(); // evita repetir la animación en ProtectedRoute
        navigate(resultado.destino, { replace: true });
      } else if (resultado.requiereRegistro) {
        // Sin cuenta: vuelve al login, directo a la vista "formulario" y con el aviso.
        navigate("/login", {
          replace: true,
          state: { vista: "formulario", correoSinCuenta: resultado.correo },
        });
      } else {
        setError(resultado.error);
      }
    });
  }, [navigate, refreshCustomer, estado]);

  // ── Error ──
  if (error) {
    return (
      <Pantalla>
        <div className={style.tarjeta} role="alert">
          <div className={`${style.iconoCirculo} ${style.iconoCirculoError}`}>
            <IconoAlerta />
          </div>
          <h2 className={style.titulo}>No se pudo continuar</h2>
          <p className={style.texto}>{error}</p>

          <div className={style.acciones}>
            <button type="button" className={style.boton}
                    onClick={() => navigate("/login", { replace: true })}>
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </Pantalla>
    );
  }

  // ── Verificando: animación a pantalla completa ──
  return <AnimacionTriangulo etiqueta="Verificando tu cuenta" />;
};

export default AuthCallback;