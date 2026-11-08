import { getCustomerJobPositions, getCustomerRoles } from "./catalog.service";
import { prefetchDefaultFotocheck } from "./fotocheck.service";
import { getSupervisors } from "./staff.service";

/**
 * Precarga en segundo plano lo que necesita la pantalla "Lista de personal".
 * Todo pasa por `conCache`, así que cuando la pantalla pida lo mismo lo encuentra
 * listo (o se une a la petición que ya está en curso, sin repetirla).
 *
 * Nunca lanza error: si algo falla, la pantalla lo pedirá por su cuenta al abrirse.
 */
export const precargarListaPersonal = async (): Promise<void> => {
  await Promise.allSettled([
    getCustomerJobPositions(), // filtros y formularios: cargos
    getCustomerRoles(), //        filtros y formularios: roles
    getSupervisors(), //          jefes directos
    prefetchDefaultFotocheck(), // fotocheck + sus imágenes
  ]);
};