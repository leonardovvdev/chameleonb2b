import { supabase } from "../../../lib/supabase";

/* ───────────── Tipos ───────────── */

export type Vista = "productos" | "categorias" | "marcas";

export interface Fila {
  id: number;
  nombre: string;
  imagen: string | null;
  importante: boolean;
}

export interface Product {
  prdct_id: number;
  ctgry_id: number | null;
  brnd_id: number | null;
  cust_id: number;
  prdct_name: string;
  prdct_name_img_link: string | null;
  prdct_important: boolean;
  prdct_price: number;
  brnd_name: string | null;
  ctgry_name: string | null;
  img_url: string | null;
}

/** Categoría o marca para los selectores del formulario. */
export interface Option {
  id: number;
  name: string;
}

/** Lo que llena el usuario en el formulario. */
export interface ProductForm {
  name: string;
  price: string;
  important: boolean;
  ctgryId: string; // "" = sin categoría
  brndId: string; // "" = sin marca
  file: File | null;
}

/** Formulario de categorías y marcas (mismos campos para ambas). */
export interface SimpleForm {
  name: string;
  important: boolean;
  file: File | null;
}

/** Vistas que se editan con SimpleForm y la ruta del backend de cada una. */
export type VistaSimple = Exclude<Vista, "productos">;
const RUTA_SIMPLE: Record<VistaSimple, string> = {
  categorias: "/categories",
  marcas: "/brands",
};

export interface Catalogo {
  productos: Product[];
  categorias: Fila[];
  marcas: Fila[];
}

export const VISTAS: { id: Vista; titulo: string; singular: string }[] = [
  { id: "productos", titulo: "Productos", singular: "producto" },
  { id: "categorias", titulo: "Categorías", singular: "categoría" },
  { id: "marcas", titulo: "Marcas", singular: "marca" },
];

/* ───────────── Conexión al backend ───────────── */

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/backend-chameleonb2b`;

async function getToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (error || !token) {
    throw new Error("Tu sesión expiró. Inicia sesión de nuevo.");
  }
  return token;
}

async function request<T>(path: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (auth) headers.set("Authorization", `Bearer ${await getToken()}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data && data.error) || "Ocurrió un error inesperado.");
  }
  return data as T;
}

/* ───────────── Lectura ───────────── */

interface CategoriaApi {
  ctgry_id: number;
  ctgry_name: string;
  ctgry_important: boolean;
  img_url: string | null;
}

interface MarcaApi {
  brnd_id: number;
  brnd_name: string;
  brnd_important: boolean;
  img_url: string | null;
}

export const filasDeProductos = (productos: Product[]): Fila[] =>
  productos.map((p) => ({
    id: p.prdct_id,
    nombre: p.prdct_name,
    imagen: p.img_url,
    importante: p.prdct_important,
  }));

/** El backend toma el customer del JWT de la sesión: no se envía cust_id. */
export async function cargarCatalogo(): Promise<Catalogo> {
  const [productos, categorias, marcas] = await Promise.all([
    request<{ items: Product[] }>("/products"),
    request<{ items: CategoriaApi[] }>("/categories"),
    request<{ items: MarcaApi[] }>("/brands"),
  ]);

  return {
    productos: productos.items,
    categorias: categorias.items.map((c) => ({
      id: c.ctgry_id,
      nombre: c.ctgry_name,
      imagen: c.img_url,
      importante: c.ctgry_important,
    })),
    marcas: marcas.items.map((m) => ({
      id: m.brnd_id,
      nombre: m.brnd_name,
      imagen: m.img_url,
      importante: m.brnd_important,
    })),
  };
}

/* ───────────── Escritura (productos) ───────────── */

function toFormData(form: ProductForm): FormData {
  const body = new FormData();
  body.append("name", form.name);
  body.append("price", form.price);
  body.append("important", String(form.important));
  body.append("ctgry_id", form.ctgryId);
  body.append("brnd_id", form.brndId);
  if (form.file) body.append("file", form.file);
  return body;
}

export function crearProducto(form: ProductForm): Promise<Product> {
  return request<Product>("/products", { method: "POST", body: toFormData(form) });
}

export function editarProducto(id: number, form: ProductForm): Promise<Product> {
  return request<Product>(`/products?id=${id}`, { method: "PATCH", body: toFormData(form) });
}

export async function borrarProducto(id: number): Promise<void> {
  await request<{ id: number }>(`/products?id=${id}`, { method: "DELETE" });
}

/* ───────────── Escritura (categorías y marcas) ───────────── */

function simpleToFormData(form: SimpleForm): FormData {
  const body = new FormData();
  body.append("name", form.name);
  body.append("important", String(form.important));
  if (form.file) body.append("file", form.file);
  return body;
}

export async function editarSimple(vista: VistaSimple, id: number, form: SimpleForm): Promise<void> {
  await request<unknown>(`${RUTA_SIMPLE[vista]}?id=${id}`, {
    method: "PATCH",
    body: simpleToFormData(form),
  });
}

export async function borrarSimple(vista: VistaSimple, id: number): Promise<void> {
  await request<{ id: number }>(`${RUTA_SIMPLE[vista]}?id=${id}`, { method: "DELETE" });
}

/* ───────────── Búsqueda ───────────── */

/** Quita tildes y pasa a minúsculas para buscar sin importar acentos. */
const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const filtrarFilas = (filas: Fila[], busqueda: string): Fila[] => {
  const consulta = normalizar(busqueda.trim());
  return consulta ? filas.filter((fila) => normalizar(fila.nombre).includes(consulta)) : filas;
};