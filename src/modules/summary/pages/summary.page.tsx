import { useEffect, useState } from "react";
import style from "./summary.page.module.css"
import Seccion_1 from "../components/seccion_1/seccion_1";
import Seccion_2 from "../components/seccion_2/seccion_2";
import { obtenerResumenAnuncio, type ResumenAnuncio } from "../services/summary.service";

export default function SummaryPage() {
  const [datos, setDatos] = useState<ResumenAnuncio | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerResumenAnuncio()
      .then((d) => activo && setDatos(d))
      .catch((e: Error) => activo && setError(e.message));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className={style.seccion}>
      {error && <p role="alert">{error}</p>}

      <Seccion_1 datos={datos} />
      <Seccion_2 datos={datos} />
    </div>
  );
}
