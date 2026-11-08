import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../core/contexts/auth.context";
import {
  AnimacionTriangulo,
  DURACION_ANIMACION_MS,
  entradaYaMostrada,
  marcarEntradaMostrada,
} from "../../core/animacion_triangulo";

export default function ProtectedRoute() {
  const { session, loadingAuth } = useAuth();

  // Al recargar la página se muestra la animación completa (5 s). Si el usuario acaba de
  // entrar por /auth/callback ya la vio, así que no se repite.
  const [animando, setAnimando] = useState(() => !entradaYaMostrada());

  useEffect(() => {
    if (!animando) return;
    const id = setTimeout(() => {
      marcarEntradaMostrada();
      setAnimando(false);
    }, DURACION_ANIMACION_MS);
    return () => clearTimeout(id);
  }, [animando]);

  // Sin sesión: directo al login, sin animación encima.
  if (!loadingAuth && !session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* El sistema se monta y carga debajo de la animación (en segundo plano). */}
      {!loadingAuth && <Outlet />}

      {/* Se mantiene hasta que pasen los 5 s y la sesión esté verificada. */}
      {(animando || loadingAuth) && <AnimacionTriangulo etiqueta="Verificando sesión" />}
    </>
  );
}