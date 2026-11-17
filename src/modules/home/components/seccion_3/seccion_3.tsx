import style from "./seccion_3.module.css";

type Negocio = {
  id: string;
  nombre: string;
  descripcion: string;
  etiquetas: string[];
  etiquetasLabel: string;
  logo: string;
  logoAlt: string;
  reverso?: { src: string; alt: string };
  url?: string;
};

const NEGOCIOS: Negocio[] = [
  {
    id: "gorrioncito",
    nombre: "Distribuidora Ferretera Gorrioncito",
    descripcion:
      "Somos una empresa peruana dedicada a la distribución y comercialización de productos para los sectores de minería, construcción civil, pesquería, agricultura, entre otras industrias.",
    etiquetas: [
      "Minería",
      "Construcción civil",
      "Pesquería",
      "Agricultura",
      "Otras industrias",
    ],
    etiquetasLabel: "Sectores que atendemos",
    logo: "/logogorrioncito.png",
    logoAlt: "Logo de Distribuidora Ferretera Gorrioncito",
    reverso: {
      src: "/gorrioncito_ubicacion.png",
      alt: "Ubicación de Distribuidora Ferretera Gorrioncito",
    },
    url: "https://distribuidora-ferretera-gorrioncito.vercel.app/",
  },
  {
    id: "chifa-mazamari",
    nombre: "Chifa Mazamari",
    // TODO: reemplazar por la descripción real
    descripcion:
      "Restaurante de comida chifa en Mazamari, con platos preparados al momento y atención cercana para ti y tu familia.",
    // TODO: reemplazar por las etiquetas reales
    etiquetas: ["Comida chifa", "Platos a la carta", "Para llevar"],
    etiquetasLabel: "Lo que ofrecemos",
    logo: "/logochifa.png",
    logoAlt: "Logo de Chifa Mazamari",
    // TODO: agregar url si tiene página web
    // url: "https://...",
  },
];

const TarjetaNegocio = ({ negocio }: { negocio: Negocio }) => {
  const titleId = `${negocio.id}-titulo`;

  const interior = (
    <>
      <div className={style.imagen}>
        <div className={style.giro}>
          <div className={style.cara}>
            <img
              src={negocio.logo}
              alt={negocio.logoAlt}
              width={160}
              height={160}
              loading="lazy"
            />
          </div>

          {negocio.reverso && (
            <div className={`${style.cara} ${style.reverso}`}>
              <img
                src={negocio.reverso.src}
                alt={negocio.reverso.alt}
                width={160}
                height={160}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      <div className={style.contenido}>
        <h2 id={titleId} className={style.titulo}>
          {negocio.nombre}
        </h2>

        <p className={style.descripcion}>{negocio.descripcion}</p>

        <ul className={style.sectores} aria-label={negocio.etiquetasLabel}>
          {negocio.etiquetas.map((etiqueta) => (
            <li key={etiqueta} className={style.chip}>
              {etiqueta}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const claseTarjeta = `${style.tarjeta} ${
    negocio.reverso ? style.conGiro : ""
  } ${negocio.url ? style.enlace : ""}`;

  return negocio.url ? (
    <a
      className={claseTarjeta}
      href={negocio.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-labelledby={titleId}
    >
      {interior}
    </a>
  ) : (
    <article className={claseTarjeta} aria-labelledby={titleId}>
      {interior}
    </article>
  );
};

const Seccion_3 = () => {
  return (
    <section className={style.seccion}>
      <div className={style.rejilla}>
        {NEGOCIOS.map((negocio) => (
          <TarjetaNegocio key={negocio.id} negocio={negocio} />
        ))}
      </div>
    </section>
  );
};

export default Seccion_3;