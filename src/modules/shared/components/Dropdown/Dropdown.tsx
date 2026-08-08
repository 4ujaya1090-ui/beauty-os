import { useEffect, useRef, useState } from "react";

import "./Dropdown.css";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
};

function Dropdown({
  value,
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected =
    options.find((o) => o.value === value);

  return (
    <div
      className="dropdown"
      ref={ref}
    >
      <button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
      >
        {selected?.label}

        <span
          className={`dropdown-arrow ${
            open ? "open" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="dropdown-menu">

          {options.map((option) => (
            <button
              key={option.value}
              className="dropdown-item"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}

export default Dropdown;