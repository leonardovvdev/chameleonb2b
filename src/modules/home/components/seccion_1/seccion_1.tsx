// import { useRef } from "react";
import style from "./seccion_1.module.css";
// import type { OrdenInteracciones } from "../../pages/HomePage";
import img  from "../../../../assets/img/mazamari.png";




const Seccion_1 = () =>{


  return (
    <div className={style.seccion}>

<img src={img} alt="" />
      {/* <video autoPlay muted loop playsInline>
        <source src="/videos/fondo.mp4" type="video/mp4" />
      </video> */}
    </div>
  );
};

export default Seccion_1;