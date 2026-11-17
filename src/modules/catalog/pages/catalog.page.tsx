import style from "./catalog.page.module.css";
import Seccion_1 from "../components/seccion_1/seccion_1";
import Seccion_2 from "../components/seccion_2/seccion_2";
import Seccion_3 from "../components/seccion_3/seccion_3";
import { useListado } from "../controllers/catalog.controller";

export default function CatalogPage() {
  const l = useListado();

  return (
    <div className={style.page}>
      <Seccion_1 {...l.cantidades} />

      <Seccion_2
        vistas={l.vistas}
        vista={l.vista}
        busqueda={l.busqueda}
        placeholder={`Buscar ${l.vistaActual.singular}...`}
        onVista={l.cambiarVista}
        onBusqueda={l.cambiarBusqueda}
        mostrarNuevo={l.puedeCrear}
        deshabilitado={l.cargando}
        onNuevo={l.abrirCrear}
      />

      <Seccion_3
        vista={l.vista}
        filas={l.filas}
        singular={l.vistaActual.singular}
        conAcciones={l.conAcciones}
        cargando={l.cargando}
        error={l.error}
        total={l.total}
        inicio={l.inicio}
        pagina={l.pagina}
        totalPaginas={l.totalPaginas}
        modalAbierto={l.modalAbierto}
        editando={l.editando}
        editandoSimple={l.editandoSimple}
        guardando={l.guardando}
        errorForm={l.errorForm}
        categorias={l.opcionesCategorias}
        marcas={l.opcionesMarcas}
        onPagina={l.setPagina}
        onReintentar={l.recargar}
        onEditar={l.abrirEditar}
        onEliminar={l.eliminar}
        onGuardar={l.guardar}
        onGuardarSimple={l.guardarSimple}
        onCerrarModal={l.cerrarModal}
      />
    </div>
  );
}