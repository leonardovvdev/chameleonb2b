import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import style from "./BarraSuperior.module.css";
import { icon } from "../../../../core/icons";
import {
  obtenerCustomerActual,
  type Customer,
} from "../../../../core/services/customer.service";
import { RUTAS_MENU } from "./rutasMenu";

interface BarraSuperiorProps {
  onAbrirMenu?: () => void; // acción del botón hamburguesa (solo móvil)
}

export default function BarraSuperior({ onAbrirMenu }: BarraSuperiorProps) {
  const { pathname } = useLocation();
  const actual = RUTAS_MENU.find((r) => pathname.startsWith(r.ruta));

  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let activo = true;

    obtenerCustomerActual()
      .then((data) => {
        if (activo) setCustomer(data);
      })
      .catch((err) => console.error("Error al cargar el cliente:", err));

    return () => {
      activo = false;
    };
  }, []);

  // Si entró un personal se muestra él (nombre, foto y rol); si no, el dueño de la cuenta.
  const staff = customer?.staff ?? null;

  const nombreCompleto = customer
    ? staff
      ? `${staff.stff_name} ${staff.stff_lastname}`
      : `${customer.cust_name} ${customer.cust_lastname}`
    : "Cargando...";

  const imagenUsuario = staff ? staff.img_url : (customer?.cust_name_img_url ?? null);

  const rolUsuario = staff
    ? (staff.role_name ?? staff.job_position_name ?? "Personal")
    : "Administrador";

  return (
    <header className={style.barrasuperior}>
      {/* IZQUIERDA: hamburguesa (solo móvil) + migas de pan */}
      <div className={style.izquierda}>
        <button
          type="button"
          className={style.botonMenu}
          onClick={onAbrirMenu}
          aria-label="Abrir menú"
        >
          <icon.iconMenu className={style.iconHamburguesa} />
        </button>

        {actual && (
          <nav className={style.migas} aria-label="Ubicación">
            <actual.Icono className={style.iconoSeccion} />
            {actual.migas.map((miga, i) => {
              const esUltima = i === actual.migas.length - 1;
              return (
                <Fragment key={miga}>
                  {i > 0 && (
                    <span className={style.migaSeparador} aria-hidden="true">/</span>
                  )}
                  <span
                    className={esUltima ? style.migaActual : style.migaGrupo}
                    aria-current={esUltima ? "page" : undefined}
                  >
                    {miga}
                  </span>
                </Fragment>
              );
            })}
          </nav>
        )}
      </div>

      {/* DERECHA: notificaciones + usuario */}
      <div className={style.usuario}>
        {/* <button type="button" className={style.botonCampana} aria-label="Notificaciones">
          <icon.iconBell className={style.iconoCampana} />
          <span className={style.puntoNotificacion} />
        </button> */}

        <div className={style.avatar}>
          {imagenUsuario ? (
            <img
              src={imagenUsuario}
              alt={nombreCompleto}
              className={style.imagenUsuario}
            />
          ) : (
            <icon.iconUser className={style.iconUser} />
          )}
        </div>

        <div className={style.datosUsuario}>
          <p className={style.nombreUsuario}>{nombreCompleto}</p>
          <p className={style.rolUsuario}>{rolUsuario}</p>
        </div>

        {/* <icon.iconArrowDown className={style.iconoChevron} /> */}
      </div>
    </header>
  );
}