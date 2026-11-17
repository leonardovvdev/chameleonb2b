import { useCallback, useEffect, useMemo, useState } from "react";
import {
  VISTAS,
  borrarProducto,
  borrarSimple,
  cargarCatalogo,
  crearProducto,
  editarProducto,
  editarSimple,
  filasDeProductos,
  filtrarFilas,
  type Fila,
  type Product,
  type ProductForm,
  type SimpleForm,
  type Vista,
} from "../services/catalog.service";

const POR_PAGINA = 5;

const mensaje = (e: unknown, defecto: string) => (e instanceof Error ? e.message : defecto);

export const useListado = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Fila[]>([]);
  const [marcas, setMarcas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vista, setVista] = useState<Vista>("productos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Product | null>(null);
  const [editandoSimple, setEditandoSimple] = useState<Fila | null>(null); // categoría o marca
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const d = await cargarCatalogo();
      setProductos(d.productos);
      setCategorias(d.categorias);
      setMarcas(d.marcas);
    } catch (e) {
      setError(mensaje(e, "No se pudo cargar el catálogo."));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const filasDeVista = useMemo<Record<Vista, Fila[]>>(
    () => ({ productos: filasDeProductos(productos), categorias, marcas }),
    [productos, categorias, marcas]
  );

  const filtradas = useMemo(
    () => filtrarFilas(filasDeVista[vista], busqueda),
    [filasDeVista, vista, busqueda]
  );

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const filas = filtradas.slice(inicio, inicio + POR_PAGINA);

  const opcionesCategorias = useMemo(
    () => categorias.map((c) => ({ id: c.id, name: c.nombre })),
    [categorias]
  );
  const opcionesMarcas = useMemo(
    () => marcas.map((m) => ({ id: m.id, name: m.nombre })),
    [marcas]
  );

  const vistaActualSingular = VISTAS.find((v) => v.id === vista)!.singular;

  const cambiarVista = (nueva: Vista) => {
    setVista(nueva);
    setBusqueda("");
    setPagina(1);
  };

  const cambiarBusqueda = (texto: string) => {
    setBusqueda(texto);
    setPagina(1);
  };

  /* ───── Modal crear / editar ───── */

  const abrirCrear = () => {
    setEditando(null);
    setErrorForm(null);
    setModalAbierto(true);
  };

  const abrirEditar = (id: number) => {
    if (vista === "productos") {
      const producto = productos.find((p) => p.prdct_id === id);
      if (!producto) return;
      setEditando(producto);
    } else {
      const fila = filasDeVista[vista].find((f) => f.id === id);
      if (!fila) return;
      setEditandoSimple(fila);
    }
    setErrorForm(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalAbierto(false);
    setEditando(null);
    setEditandoSimple(null);
  };

  /** Guarda con la función que toque y recarga; sirve para productos, categorías y marcas. */
  const guardarCon = async (accion: () => Promise<unknown>, errorDefecto: string) => {
    setGuardando(true);
    setErrorForm(null);
    try {
      await accion();
      setModalAbierto(false);
      setEditando(null);
      setEditandoSimple(null);
      await recargar();
    } catch (e) {
      setErrorForm(mensaje(e, errorDefecto));
    } finally {
      setGuardando(false);
    }
  };

  const guardar = (form: ProductForm) =>
    guardarCon(
      () => (editando ? editarProducto(editando.prdct_id, form) : crearProducto(form)),
      "No se pudo guardar el producto."
    );

  const guardarSimple = (form: SimpleForm) => {
    if (vista === "productos" || !editandoSimple) return Promise.resolve();
    return guardarCon(
      () => editarSimple(vista, editandoSimple.id, form),
      `No se pudo guardar la ${VISTAS.find((v) => v.id === vista)!.singular}.`
    );
  };

  const eliminar = async (id: number) => {
    try {
      if (vista === "productos") await borrarProducto(id);
      else await borrarSimple(vista, id);
      await recargar(); // al borrar una categoría/marca, los productos cambian: se recarga todo
    } catch (e) {
      setError(mensaje(e, `No se pudo eliminar el ${vistaActualSingular}.`));
    }
  };

  return {
    vistas: VISTAS,
    vista,
    vistaActual: VISTAS.find((v) => v.id === vista)!,
    cantidades: {
      productos: productos.length,
      categorias: categorias.length,
      marcas: marcas.length,
    },
    cargando,
    error,
    recargar,
    busqueda,
    cambiarBusqueda,
    cambiarVista,
    filas,
    total: filtradas.length,
    inicio,
    pagina: paginaActual,
    totalPaginas,
    setPagina,
    conAcciones: true, // productos, categorías y marcas se editan / borran
    puedeCrear: vista === "productos", // por ahora solo los productos se crean
    modalAbierto,
    editando,
    editandoSimple,
    guardando,
    errorForm,
    opcionesCategorias,
    opcionesMarcas,
    abrirCrear,
    abrirEditar,
    cerrarModal,
    guardar,
    guardarSimple,
    eliminar,
  };
};