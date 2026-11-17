import style from "./seccion_1.module.css";

interface Props {
  productos: number;
  categorias: number;
  marcas: number;
}

const Seccion_1 = ({ productos, categorias, marcas }: Props) => {
  const estadisticas = [
    { valor: productos, etiqueta: "Productos" },
    { valor: categorias, etiqueta: "Categorías" },
    { valor: marcas, etiqueta: "Marcas" },
  ];

  return (
    <section className={style.seccion} aria-label="Resumen de la tienda">
      <ul className={style.lista}>
        {estadisticas.map(({ valor, etiqueta }) => (
          <li key={etiqueta} className={style.tarjeta}>
            <strong className={style.valor}>{valor.toLocaleString("es-PE")}</strong>
            <span className={style.etiqueta}>{etiqueta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Seccion_1;