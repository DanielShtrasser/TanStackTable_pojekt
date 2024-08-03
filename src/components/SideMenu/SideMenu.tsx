import { useState, FC, useEffect } from "react";
import HeaderInfo from "../HeaderInfo/HeaderInfo";
import Navigator from "../Navigator";
import DropDawn from "../DropDawn";
import { useAppDispatch } from "../../redux/hooks/redux";
import { useAppSelector } from "../../redux/hooks/redux";
import { menuApi } from "../../redux/services/menuApi";
import { setCurrentFilial } from "../../redux/store/appSlice";

import style from "./SideMenu.module.css";
import { Filial } from "../../types";

const SideMenu: FC = function () {
  const { currentFilial } = useAppSelector((state) => state.appReducer);
  const [selectFilial, setSelectFilial] = useState<Filial>(currentFilial);
  const { data: filials = [] } = menuApi.useGetFilialsQuery();
  const dispatch = useAppDispatch();

  const onСhoiceHandler = (filial: Filial): void => {
    if (filial) {
      setSelectFilial(filial);
      dispatch(setCurrentFilial(filial));
    }
  };

  useEffect(() => {
    setSelectFilial(currentFilial);
  }, [currentFilial]);

  return (
    <aside className={style.sideMenu}>
      <HeaderInfo />
      <div className={style.navWrapper}>
        <div className={style.desc}>Филиалы</div>
        <DropDawn
          options={filials}
          onChange={onСhoiceHandler}
          value={selectFilial?.name || ""}
          title="Выбери филиал"
        />
        <div className={style.line}></div>

        <Navigator />
      </div>
    </aside>
  );
};

export default SideMenu;
