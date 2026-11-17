import { useEffect, useMemo, useState, type FormEvent } from "react";
import style from "./seccion_3.module.css";
import type { Fila, Option, Product, ProductForm, SimpleForm, Vista } from "../../services/catalog.service";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ESPERA_ELIMINAR = 3; // segundos que el botón "Eliminar" permanece bloqueado

/* ───────────── Modal confirmar eliminación ───────────── */

interface ConfirmarProps {
  singular: string;
  nombre: string;
  aviso?: string;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
}

function ConfirmarEliminar({ singular, nombre, aviso, onConfirmar, onCancelar }: ConfirmarProps) {
  const [segundos, setSegundos] = useState(ESPERA_ELIMINAR);
  const [eliminando, setEliminando] = useState(false);

  // Cuenta regresiva: baja 1 cada segundo hasta llegar a 0
  useEffect(() => {
    if (segundos <= 0) return;
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundos]);

  const confirmar = async () => {
    setEliminando(true);
    await onConfirmar(); // el padre cierra el modal al terminar
  };

  const cancelar = () => {
    if (!eliminando) onCancelar();
  };

  return (
    <div className={style.overlay} onMouseDown={cancelar}>
      <div
        className={style.modal}
        role="alertdialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className={style.modalTitulo}>Eliminar {singular}</h3>
        <p className={style.confirmTexto}>
          ¿Seguro que quieres eliminar <strong>{nombre}</strong>? Esta acción no se puede deshacer.
          {aviso && <> {aviso}</>}
        </p>
        <div className={style.modalAcciones}>
          <button type="button" className={style.boton} onClick={cancelar} disabled={eliminando}>
            Cancelar
          </button>
          <button
            type="button"
            className={style.peligroSolido}
            onClick={confirmar}
            disabled={segundos > 0 || eliminando}
          >
            {eliminando ? "Eliminando..." : segundos > 0 ? `Eliminar (${segundos})` : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Campo de imagen (lo usan todos los modales) ───────────── */

interface ImagenCampoProps {
  actual: string | null; // imagen que ya tiene (al editar)
  file: File | null; // imagen nueva elegida
  onFile: (file: File | null) => void;
  onError: (mensaje: string | null) => void;
}

function ImagenCampo({ actual, file, onFile, onError }: ImagenCampoProps) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : actual), [file, actual]);

  useEffect(() => {
    return () => {
      if (file && preview) URL.revokeObjectURL(preview);
    };
  }, [file, preview]);

  const handleFile = (nuevo: File | null) => {
    if (nuevo && nuevo.size > MAX_IMAGE_BYTES) {
      onError("La imagen no puede pesar más de 5 MB.");
      return;
    }
    onError(null);
    onFile(nuevo);
  };

  return (
    <div className={style.campo}>
      <span>Imagen (JPG, PNG, WEBP o GIF, máx. 5 MB)</span>
      {preview && <img className={style.vistaPrevia} src={preview} alt="Vista previa" />}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

/* ───────────── Modal crear / editar producto ───────────── */

interface ModalProps {
  product: Product | null;
  categories: Option[];
  brands: Option[];
  saving: boolean;
  error: string | null;
  onSave: (form: ProductForm) => void;
  onClose: () => void;
}

function ProductModal({ product, categories, brands, saving, error, onSave, onClose }: ModalProps) {
  const [form, setForm] = useState<ProductForm>({
    name: product?.prdct_name ?? "",
    price: product ? String(product.prdct_price) : "",
    important: product?.prdct_important ?? false,
    ctgryId: product?.ctgry_id != null ? String(product.ctgry_id) : "",
    brndId: product?.brnd_id != null ? String(product.brnd_id) : "",
    file: null,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const set = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setLocalError("El nombre del producto es obligatorio.");
      return;
    }
    setLocalError(null);
    onSave(form);
  };

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <form className={style.modal} onMouseDown={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={style.modalTitulo}>{product ? "Editar producto" : "Nuevo producto"}</h3>

        <label className={style.campo}>
          <span>Nombre</span>
          <input
            type="text"
            maxLength={200}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoFocus
          />
        </label>

        <label className={style.campo}>
          <span>Precio</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </label>

        <div className={style.fila}>
          <label className={style.campo}>
            <span>Categoría</span>
            <select value={form.ctgryId} onChange={(e) => set("ctgryId", e.target.value)}>
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className={style.campo}>
            <span>Marca</span>
            <select value={form.brndId} onChange={(e) => set("brndId", e.target.value)}>
              <option value="">Sin marca</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={style.check}>
          <input
            type="checkbox"
            checked={form.important}
            onChange={(e) => set("important", e.target.checked)}
          />
          <span>Producto importante</span>
        </label>

        <ImagenCampo
          actual={product?.img_url ?? null}
          file={form.file}
          onFile={(f) => set("file", f)}
          onError={setLocalError}
        />

        {(localError || error) && <p className={style.error}>{localError ?? error}</p>}

        <div className={style.modalAcciones}>
          <button type="button" className={style.boton} onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className={style.primario} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ───────────── Modal editar categoría / marca ───────────── */

interface SimpleModalProps {
  fila: Fila;
  singular: string;
  saving: boolean;
  error: string | null;
  onSave: (form: SimpleForm) => void;
  onClose: () => void;
}

function SimpleModal({ fila, singular, saving, error, onSave, onClose }: SimpleModalProps) {
  const [form, setForm] = useState<SimpleForm>({
    name: fila.nombre,
    important: fila.importante,
    file: null,
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setLocalError(`El nombre de la ${singular} es obligatorio.`);
      return;
    }
    setLocalError(null);
    onSave(form);
  };

  return (
    <div className={style.overlay} onMouseDown={onClose}>
      <form className={style.modal} onMouseDown={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 className={style.modalTitulo}>Editar {singular}</h3>

        <label className={style.campo}>
          <span>Nombre</span>
          <input
            type="text"
            maxLength={200}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            autoFocus
          />
        </label>

        <label className={style.check}>
          <input
            type="checkbox"
            checked={form.important}
            onChange={(e) => setForm((prev) => ({ ...prev, important: e.target.checked }))}
          />
          <span>Importante</span>
        </label>

        <ImagenCampo
          actual={fila.imagen}
          file={form.file}
          onFile={(f) => setForm((prev) => ({ ...prev, file: f }))}
          onError={setLocalError}
        />

        {(localError || error) && <p className={style.error}>{localError ?? error}</p>}

        <div className={style.modalAcciones}>
          <button type="button" className={style.boton} onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className={style.primario} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ───────────── Sección ───────────── */

/** Qué pasa con los productos cuando se elimina una categoría o una marca. */
const AVISO_ELIMINAR: Partial<Record<Vista, string>> = {
  categorias: "Los productos de esta categoría quedarán sin categoría.",
  marcas: "Los productos de esta marca quedarán sin marca.",
};

interface Props {
  vista: Vista;
  filas: Fila[];
  singular: string;
  conAcciones: boolean;
  cargando: boolean;
  error: string | null;
  total: number;
  inicio: number;
  pagina: number;
  totalPaginas: number;
  modalAbierto: boolean;
  editando: Product | null;
  editandoSimple: Fila | null;
  guardando: boolean;
  errorForm: string | null;
  categorias: Option[];
  marcas: Option[];
  onPagina: (n: number) => void;
  onReintentar: () => void;
  onEditar: (id: number) => void;
  onEliminar: (id: number) => Promise<void>;
  onGuardar: (form: ProductForm) => void;
  onGuardarSimple: (form: SimpleForm) => void;
  onCerrarModal: () => void;
}

const Seccion_3 = ({
  vista, filas, singular, conAcciones, cargando, error, total, inicio, pagina, totalPaginas,
  modalAbierto, editando, editandoSimple, guardando, errorForm, categorias, marcas,
  onPagina, onReintentar, onEditar, onEliminar, onGuardar, onGuardarSimple, onCerrarModal,
}: Props) => {
  const [aEliminar, setAEliminar] = useState<Fila | null>(null);

  return (
    <section className={style.seccion}>
      {error && (
        <p className={style.error}>
          {error}{" "}
          <button type="button" className={style.enlace} onClick={onReintentar}>
            Reintentar
          </button>
        </p>
      )}

      <div className={style.contenedor}>
        <table className={style.tabla}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Importante</th>
              <th className={style.derecha}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={4} className={style.vacio}>
                  Cargando...
                </td>
              </tr>
            ) : filas.length === 0 ? (
              <tr>
                <td colSpan={4} className={style.vacio}>
                  No se encontró ningún {singular}.
                </td>
              </tr>
            ) : (
              filas.map((fila) => (
                <tr key={fila.id}>
                  <td>
                    {fila.imagen ? (
                      <img src={fila.imagen} alt={fila.nombre} className={style.imagen} />
                    ) : (
                      <span className={style.sinImagen}>{fila.nombre.charAt(0).toUpperCase()}</span>
                    )}
                  </td>
                  <td className={style.nombre}>{fila.nombre}</td>
                  <td>
                    <span className={`${style.insignia} ${fila.importante ? style.si : style.no}`}>
                      {fila.importante ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className={style.derecha}>
                    {conAcciones ? (
                      <div className={style.acciones}>
                        <button type="button" className={style.boton} onClick={() => onEditar(fila.id)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className={`${style.boton} ${style.peligro}`}
                          onClick={() => setAEliminar(fila)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <span className={style.guion}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={style.pie}>
        <span className={style.resumen}>
          {total === 0 ? "0 resultados" : `Mostrando ${inicio + 1}–${inicio + filas.length} de ${total}`}
        </span>
        <div className={style.paginacion}>
          <button type="button" className={style.boton} disabled={pagina <= 1} onClick={() => onPagina(pagina - 1)}>
            Anterior
          </button>
          <span className={style.pagina}>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            type="button"
            className={style.boton}
            disabled={pagina >= totalPaginas}
            onClick={() => onPagina(pagina + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {aEliminar && (
        <ConfirmarEliminar
          key={`${vista}-${aEliminar.id}`}
          singular={singular}
          nombre={aEliminar.nombre}
          aviso={AVISO_ELIMINAR[vista]}
          onConfirmar={async () => {
            await onEliminar(aEliminar.id);
            setAEliminar(null);
          }}
          onCancelar={() => setAEliminar(null)}
        />
      )}

      {modalAbierto && vista !== "productos" && editandoSimple && (
        <SimpleModal
          key={`${vista}-${editandoSimple.id}`}
          fila={editandoSimple}
          singular={singular}
          saving={guardando}
          error={errorForm}
          onSave={onGuardarSimple}
          onClose={onCerrarModal}
        />
      )}

      {modalAbierto && vista === "productos" && (
        <ProductModal
          key={editando?.prdct_id ?? "nuevo"}
          product={editando}
          categories={categorias}
          brands={marcas}
          saving={guardando}
          error={errorForm}
          onSave={onGuardar}
          onClose={onCerrarModal}
        />
      )}
    </section>
  );
};

export default Seccion_3;