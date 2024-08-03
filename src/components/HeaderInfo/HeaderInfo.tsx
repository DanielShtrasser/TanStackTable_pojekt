import * as React from "react";
import style from "./HeaderInfo.module.css";

const HeaderInfo: React.FC = () => {
  return (
    <div className={style.headerInfo}>
      <div className={style.companyName}>
        <div className={style.logo} />
        <div>
          <div>НАЗВАНИЕ ФИРМЫ</div>
          <div className={style.name}>Лоскутникова В.П.</div>
        </div>
      </div>
      <div className={style.line}></div>
      <div className={style.inventoryControl}>
        <div className={style.logo} />
        <div>СКЛАДСКОЙ УЧЕТ</div>
      </div>
    </div>
  );
};

export default HeaderInfo;
