export type PuntoSerie = {
  etiqueta: string;
  visitas: number;
  revisualizaciones: number;
};

export type DatosPeriodo = {
  visitas: number;
  revisualizaciones: number;
  serie: PuntoSerie[];
};

export type ResumenAnuncio = {
  mes: DatosPeriodo;
  anio: DatosPeriodo;
  dia: DatosPeriodo;
};

const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL ?? "https://smqvqmdjpjuxrgctmwbr.supabase.co";
const API = `${SUPABASE_URL}/functions/v1/backend-chameleonb2b`;

/* supabase-js guarda la sesión en localStorage como sb-<ref>-auth-token.
   Si ya tienes una función que devuelve el token, reemplaza solo esta. */
function obtenerToken(): string {
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  try {
    const sesion = JSON.parse(localStorage.getItem(`sb-${ref}-auth-token`) ?? "null");
    if (sesion?.access_token) return sesion.access_token as string;
  } catch {
    /* sesión ilegible: se trata como sin sesión */
  }
  throw new Error("Debes iniciar sesión para continuar.");
}

/** GET /advertisement-summary → vistas y re-visitas del anuncio por mes, año y día. */
export async function obtenerResumenAnuncio(): Promise<ResumenAnuncio> {
  const res = await fetch(`${API}/advertisement-summary`, {
    headers: { Authorization: `Bearer ${obtenerToken()}` },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? "No se pudo cargar el resumen.");
  return body as ResumenAnuncio;
}
