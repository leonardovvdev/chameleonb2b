import { callBackend } from "./backend";

/** Personal con sesión abierta (solo viene cuando entra un personal; el dueño recibe null). */
export interface CustomerStaff {
  stff_id: number;
  stff_name: string;
  stff_lastname: string;
  /** Solo el nombre del archivo (gestion_empresarial/staffs_img/...). */
  stff_link_img: string | null;
  role_name: string | null;
  job_position_name: string | null;
  /** Enlace firmado y temporal de la foto del personal. */
  img_url: string | null;
}

/** Datos del customer que devuelve el backend en GET /customers/me. */
export interface Customer {
  cust_id: number;
  cust_name: string;
  cust_lastname: string;
  cust_name_bucket: number;
  /** Solo el nombre del archivo (ej. "carlos.jpg"). */
  cust_name_img_link: string | null;
  /**
   * Enlace firmado y temporal de la imagen del customer.
   * El bucket es privado, por eso la imagen no se puede pedir con una URL fija.
   */
  cust_name_img_url: string | null;
  /** Datos del personal si quien entró es personal; null si es el dueño. */
  staff?: CustomerStaff | null;
}

/** Customer de la sesión actual. Lanza `BackendError` (con el mensaje del backend) si no se puede obtener. */
export const obtenerCustomerActual = (): Promise<Customer> => callBackend<Customer>("customers/me");

/** Nombres de los módulos activos del customer de la sesión (dueño o personal). */
export const obtenerMisModulos = async (): Promise<string[]> =>
  (await callBackend<{ modules: string[] }>("customer-modules")).modules;