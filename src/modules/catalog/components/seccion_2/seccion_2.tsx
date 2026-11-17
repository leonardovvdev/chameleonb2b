import style from "./seccion_2.module.css";
import type { Vista } from "../../services/catalog.service";

interface Props {
  vistas: { id: Vista; titulo: string }[];
  vista: Vista;
  busqueda: string;
  placeholder: string;
  mostrarNuevo: boolean;
  deshabilitado: boolean;
  onVista: (v: Vista) => void;
  onBusqueda: (texto: string) => void;
  onNuevo: () => void;
}

const Seccion_2 = ({
  vistas, vista, busqueda, placeholder, mostrarNuevo, deshabilitado,
  onVista, onBusqueda, onNuevo,
}: Props) => {
  return (
    <section className={style.seccion} aria-label="Filtros">
      <div className={style.tabs} role="tablist">
        {vistas.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={v.id === vista}
            className={`${style.tab} ${v.id === vista ? style.activo : ""}`}
            onClick={() => onVista(v.id)}
          >
            {v.titulo}
          </button>
        ))}
      </div>

      <div className={style.herramientas}>
        <input
          type="search"
          className={style.buscador}
          value={busqueda}
          placeholder={placeholder}
          onChange={(e) => onBusqueda(e.target.value)}
          aria-label="Buscar"
        />
        {mostrarNuevo && (
          <button type="button" className={style.nuevo} onClick={onNuevo} disabled={deshabilitado}>
            + Agregar producto
          </button>
        )}
      </div>
    </section>
  );
};

export default Seccion_2;