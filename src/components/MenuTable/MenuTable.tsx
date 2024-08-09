import React, { useEffect, useMemo, useState } from "react";
import { Menu } from "../../types";
import { menuApi } from "../../redux/services/menuApi";
import {
  Table,
  Column,
  ColumnDef,
  RowData,
  flexRender,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useAppSelector } from "../../redux/hooks/redux";
import DropDawn from "../DropDawn/DropDawn";
import style from "./MenuTable.module.css";
import clsx from "clsx/lite";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select" | "export";
    placeholder?: "Название меню" | "Филиал" | "Торговая точка";
  }
}

const fallbackData: Menu[] = [];

function getActiveValue(str: boolean | undefined) {
  switch (str) {
    case true:
      return "Активно";
    case false:
      return "Не активно";
    case undefined:
      return "Все";
    default:
      return "Нет данных";
  }
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  const { filterVariant, placeholder } = column.columnDef.meta ?? {};

  return filterVariant === "select" ? (
    <div className={style.select}>
      <DropDawn
        value={getActiveValue(columnFilterValue as boolean | undefined)}
        onChange={(o) => column.setFilterValue(o.id)}
        options={[
          { id: "", name: "Все" },
          { id: true, name: "Активно" },
          { id: false, name: "Не активно" },
        ]}
        title="Все"
      />
    </div>
  ) : filterVariant === "export" ? (
    <div
      style={{ textAlign: "start", alignContent: "center" }}
      className={style.select}
    >
      Экспорт
    </div>
  ) : (
    <DebouncedInput
      type="text"
      className=""
      onChange={(value) => column.setFilterValue(value)}
      value={(columnFilterValue ?? "") as string}
      placeholder={placeholder}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

interface PaginationProps {
  table: Table<Menu>;
}

function Pagination({ table }: PaginationProps) {
  const [activePageBtn, setActivePageBtn] = useState(1);

  const currentPage = table.getState().pagination.pageIndex;

  const pageCount = table.getPageCount();
  const btns: number[] = new Array(pageCount - 1).fill(0).map((_, i) => i + 1);

  useEffect(() => {
    if (pageCount > 5) {
      if (currentPage === 1) {
        setActivePageBtn(1);
      } else if (currentPage === 2) {
        setActivePageBtn(2);
      } else if (currentPage === 3 || currentPage < table.getPageCount() - 2) {
        setActivePageBtn(3);
      } else if (currentPage === table.getPageCount() - 2) {
        setActivePageBtn(4);
      } else if (currentPage === table.getPageCount() - 1) {
        setActivePageBtn(5);
      }
    } else {
      if (currentPage === 1) {
        setActivePageBtn(1);
      } else if (currentPage === 2) {
        setActivePageBtn(2);
      } else if (currentPage === 3) {
        setActivePageBtn(3);
      } else if (currentPage === 4) {
        setActivePageBtn(4);
      } else if (currentPage === 5) {
        setActivePageBtn(5);
      }
    }
  }, [currentPage]);

  return (
    <div className={style.pagination}>
      {pageCount > 5 ? (
        <>
          <button
            className={style.paginationBackBtn}
            onClick={() => table.previousPage()}
            disabled={currentPage === 1}
          ></button>

          {btns.map((p: number) => {
            switch (p) {
              case 1:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 1 && style.active
                    )}
                    onClick={() => {
                      table.setPageIndex(1);
                    }}
                  >
                    1
                  </button>
                );
              case 2:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 2 && style.active
                    )}
                    onClick={() => {
                      table.setPageIndex(2);
                    }}
                    disabled={currentPage > 3}
                  >
                    {currentPage > 3 ? "..." : 2}
                  </button>
                );
              case 3:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn === 3 && style.active
                    )}
                    onClick={() => {
                      if (currentPage <= 3) {
                        table.setPageIndex(3);
                      }
                      if (currentPage >= pageCount - 2) {
                        table.setPageIndex(pageCount - 4);
                      }
                    }}
                  >
                    {currentPage <= 3
                      ? 3
                      : currentPage >= pageCount - 3
                      ? pageCount - 3
                      : currentPage}
                  </button>
                );
              case 4:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 4 && style.active
                    )}
                    disabled={currentPage < pageCount - 3 && pageCount > 5}
                    onClick={() => {
                      table.setPageIndex(pageCount - 2);
                    }}
                  >
                    {currentPage < pageCount - 2 ? "..." : pageCount - 2}
                  </button>
                );
              case 5:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 5 && style.active
                    )}
                    onClick={() => {
                      table.lastPage();
                    }}
                  >
                    {pageCount - 1}
                  </button>
                );
              default:
                break;
            }
          })}

          <button
            className={style.paginationForwardBtn}
            onClick={() => {
              if (currentPage === pageCount - 1) {
                table.setPageIndex(pageCount - 1);
                return;
              }
              table.nextPage();
            }}
            disabled={currentPage === pageCount - 1}
          ></button>
        </>
      ) : (
        <>
          <button
            className={style.paginationBackBtn}
            onClick={() => table.previousPage()}
            disabled={currentPage === 1}
          ></button>

          {btns.map((p: number) => {
            switch (p) {
              case 1:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 1 && style.active
                    )}
                    onClick={() => table.setPageIndex(1)}
                    disabled={currentPage === 1}
                  >
                    1
                  </button>
                );
              case 2:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn === 2 && style.active
                    )}
                    onClick={() => table.setPageIndex(2)}
                    disabled={currentPage === 2}
                  >
                    2
                  </button>
                );
              case 3:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 3 && style.active
                    )}
                    onClick={() => table.setPageIndex(3)}
                  >
                    3
                  </button>
                );
              case 4:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 4 && style.active
                    )}
                    onClick={() => table.setPageIndex(4)}
                  >
                    4
                  </button>
                );
              case 5:
                return (
                  <button
                    key={p}
                    className={clsx(
                      style.pageBtn,
                      activePageBtn == 5 && style.active
                    )}
                    onClick={() => table.setPageIndex(pageCount - 1)}
                  >
                    {pageCount}
                  </button>
                );
              default:
                break;
            }
          })}

          <button
            className={style.paginationForwardBtn}
            onClick={() => table.nextPage()}
            disabled={currentPage === pageCount - 1}
          ></button>
        </>
      )}
    </div>
  );
}

export default function MenuTable() {
  const { currentFilial } = useAppSelector((state) => state.appReducer);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 1,
  });
  const [name, setName] = useState("");
  const [filial, setFilial] = useState("");
  const [tt, setTT] = useState("");
  const [active, setActive] = useState("");

  const {
    data: menuInfo,
    error,
    isFetching,
  } = menuApi.useGetAllMenuQuery(
    {
      filialId: currentFilial.id,
      params: {
        limit: String(pagination.pageSize),
        page: String(pagination.pageIndex),
        name,
        filial,
        tt,
        active,
      },
    },
    { skip: !currentFilial.id }
  );

  const max_pages = menuInfo?.max_pages;
  const columns = useMemo<ColumnDef<Menu, any>[]>(
    () => [
      {
        accessorKey: "name",
        meta: {
          filterVariant: "text",
          placeholder: "Название меню",
        },
        filterFn: "includesString",
      },
      {
        accessorKey: "filial.name",
        id: "filialName",
        meta: {
          filterVariant: "text",
          placeholder: "Филиал",
        },
        filterFn: "includesString",
        size: 146,
      },
      {
        accessorKey: "tt.name",
        id: "ttName",
        meta: {
          filterVariant: "text",
          placeholder: "Торговая точка",
        },
        filterFn: "includesString",
        size: 146,
      },
      {
        accessorKey: "active",
        meta: {
          filterVariant: "select",
        },
        cell: ({ cell }) => <>{getActiveValue(cell.getValue())}</>,
        size: 125,
      },
      {
        accessorFn: (row) => row.export,
        id: "export",
        meta: {
          filterVariant: "export",
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: menuInfo?.data ?? fallbackData,
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: max_pages ? max_pages + 1 : 0,
    onPaginationChange: setPagination,
    state: { pagination, columnFilters },

    manualFiltering: true,
    onColumnFiltersChange: setColumnFilters,
  });

  const pageCount = table.getPageCount();

  useEffect(() => {
    if (table.getState().columnFilters.length) {
      table.getState().columnFilters.map((filter) => {
        const filterVal = filter.value as string;
        switch (filter.id) {
          case "name":
            setName(filterVal);
            break;
          case "filial":
            setFilial(filterVal);
            break;
          case "tt":
            setTT(filterVal);
            break;
          case "active":
            setActive(
              filter.value === true
                ? "active"
                : filter.value === false
                ? "no_active"
                : ""
            );
            break;
          default:
            break;
        }
        if (pageCount < 3) setPagination((prev) => ({ ...prev, pageIndex: 1 }));
      });
    } else {
      setName("");
      setFilial("");
      setTT("");
      setActive("");
    }
  }, [table.getState().columnFilters]);

  if (error) {
    if ("status" in error) {
      const errMsg =
        "error" in error ? error.error : JSON.stringify(error.data);

      return (
        <div className={style.info}>
          <div>Код ошибки: {error.status}</div>
          <div>Описание {errMsg}</div>
        </div>
      );
    } else {
      return <div className={style.info}>{error.message}</div>;
    }
  }

  if (isFetching) {
    return <div className={style.info}>Данные загружаются</div>;
  }

  return (
    <div className={style.menuTable}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {header.column.getCanFilter() ? (
                          <Filter column={header.column} />
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.columnDef.size }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
                <td className={style.tableRowBtns}>
                  <button className={clsx(style.icon, style.infoIcon)}></button>
                  <button className={clsx(style.icon, style.editIcon)}></button>
                  <button className={clsx(style.icon, style.delIcon)}></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {table.getPageCount() > 2 && <Pagination table={table} />}
    </div>
  );
}
