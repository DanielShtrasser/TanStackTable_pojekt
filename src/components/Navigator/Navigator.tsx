import { useState, useEffect, FC } from "react";
import style from "./Navigator.module.css";
import { SideMenuBtn } from "../../types";
import clsx from "clsx";
import { useAppDispatch } from "../../redux/hooks/redux";
import { setCurrentNavigatorSection } from "../../redux/store/appSlice";
import { useAppSelector } from "../../redux/hooks/redux";

export const buttons: SideMenuBtn[] = [
  { id: "1", name: "Компоненты" },
  { id: "2", name: "Полуфабрикаты" },
  { id: "3", name: "Товары" },
  { id: "4", name: "Меню" },
  { id: "5", name: "Перемещения" },
  { id: "6", name: "Инвентаризация" },
  { id: "7", name: "Выпуск товара" },
  { id: "8", name: "Списание" },
  { id: "9", name: "Накладные" },
];

const Navigator: FC = () => {
  const { currentNavigatorSection } = useAppSelector(
    (state) => state.appReducer
  );
  const [activeBtn, setActiveBtn] = useState(currentNavigatorSection);
  const dispatch = useAppDispatch();

  const onСhoiceHandler = (section: string): void => {
    if (section) {
      setActiveBtn(section);
      dispatch(setCurrentNavigatorSection(section));
    }
  };

  useEffect(() => {
    if (!activeBtn) {
      setActiveBtn(currentNavigatorSection);
    }
  }, [currentNavigatorSection]);

  return (
    <div className={style.navigator}>
      {buttons.map((btn) => (
        <div
          key={btn.id}
          className={clsx(style.btn, btn.id == activeBtn && style.active)}
          onClick={() => onСhoiceHandler(btn.id)}
        >
          <span>{`- ${btn.name}`}</span>
        </div>
      ))}
    </div>
  );
};

export default Navigator;
