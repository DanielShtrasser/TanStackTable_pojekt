import React from "react";
import style from "./DataDisplay.module.css";
import MenuTable from "../MenuTable";
import { useAppSelector } from "../../redux/hooks/redux";

const DataDisplay: React.FC = function () {
  const { currentNavigatorSection } = useAppSelector(
    (state) => state.appReducer
  );

  function getActiveSection(section: string) {
    switch (section) {
      case "4":
        return <MenuTable />;

      default:
        return <div></div>;
    }
  }

  return (
    <main className={style.dataDisplay}>
      {getActiveSection(currentNavigatorSection)}
    </main>
  );
};

export default DataDisplay;
