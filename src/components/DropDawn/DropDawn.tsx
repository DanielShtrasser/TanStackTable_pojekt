import { useState } from "react";
import clsx from "clsx/lite";

import style from "./DropDawn.module.css";

interface DropDawnProps {
  options: { id: string | number | boolean; name: string }[];
  onChange: (x: any) => void;
  value: string;
  title?: string;
}

const DropDawn = ({
  options,
  onChange,
  value,
  title,
}: DropDawnProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  return (
    <div className={style.btnWrapper} onClick={(): void => toggleDropDown()}>
      <button
        className={showDropDown ? "active" : undefined}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        {value ? <span>{value}</span> : <span>{title}</span>}
        {showDropDown && (
          <div
            className={clsx(
              showDropDown ? style.dropdown : [style.dropdown, "active"]
            )}
          >
            {options.map((option: any): JSX.Element => {
              return (
                <p
                  key={option.id}
                  onClick={(): void => {
                    onChange(option);
                  }}
                >
                  {option.name}
                </p>
              );
            })}
          </div>
        )}
        <div className={style.icon}>v</div>
      </button>
    </div>
  );
};

export default DropDawn;
