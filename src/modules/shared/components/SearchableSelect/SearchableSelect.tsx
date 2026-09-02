import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import "./SearchableSelect.css";

export type SearchableSelectOption = {
  value: string;
  label: string;
  searchText?: string;
};

type SearchableSelectProps = {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;

  disabled?: boolean;

  emptyText?: string;

  specialOptionLabel?: string;
  specialOptionValue?: string;
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Выберите значение",
  searchPlaceholder = "Поиск...",
  disabled = false,
  emptyText = "Ничего не найдено",
  specialOptionLabel,
  specialOptionValue,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  const filteredOptions = useMemo(() => {
    const normalizedSearch = normalize(search);

    if (!normalizedSearch) {
      return options;
    }

    const normalizedPhoneSearch = normalizePhone(search);

    return options.filter((option) => {
      const searchSource = option.searchText ?? option.label;
      const text = normalize(searchSource);

      if (text.includes(normalizedSearch)) {
        return true;
      }

      if (
        normalizedPhoneSearch.length > 0 &&
        normalizePhone(searchSource).includes(
          normalizedPhoneSearch
        )
      ) {
        return true;
      }

      return false;
    });
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  function handleOpen() {
    if (disabled) {
      return;
    }

    setIsOpen(true);
    setSearch("");
  }

  function handleSelect(
    option: SearchableSelectOption
  ) {
    onChange(option.value);
    setIsOpen(false);
    setSearch("");
  }

  function handleSpecialSelect() {
    if (disabled || !specialOptionValue) {
      return;
    }

    onChange(specialOptionValue);
    setIsOpen(false);
    setSearch("");
  }

  function handleClear(
    event: React.MouseEvent<HTMLSpanElement>
  ) {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    onChange("");
    setSearch("");
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      return;
    }

    if (
      event.key === "Enter" &&
      filteredOptions.length > 0
    ) {
      event.preventDefault();

      handleSelect(filteredOptions[0]);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`searchable-select ${
        isOpen
          ? "searchable-select--open"
          : ""
      } ${
        disabled
          ? "searchable-select--disabled"
          : ""
      }`}
    >
      <button
        type="button"
        className="searchable-select__control"
        onClick={handleOpen}
        disabled={disabled}
      >
        <span
          className={
            selectedOption
              ? "searchable-select__value"
              : "searchable-select__placeholder"
          }
        >
          {selectedOption
            ? selectedOption.label
            : value === specialOptionValue &&
                specialOptionLabel
              ? specialOptionLabel
              : placeholder}
        </span>

        <span className="searchable-select__actions">
          {value &&
            value !== specialOptionValue &&
            !disabled && (
              <span
                className="searchable-select__clear"
                onClick={handleClear}
                role="button"
                tabIndex={0}
                aria-label="Очистить выбор"
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    onChange("");
                    setSearch("");
                  }
                }}
              >
                ×
              </span>
            )}

          <span className="searchable-select__arrow">
            ▾
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="searchable-select__dropdown">
          <div className="searchable-select__search">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              autoComplete="off"
            />
          </div>

          <div className="searchable-select__options">
            {filteredOptions.length === 0 ? (
              <div className="searchable-select__empty">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`searchable-select__option ${
                    option.value === value
                      ? "searchable-select__option--selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelect(option)
                  }
                >
                  {option.label}
                </button>
              ))
            )}

            {specialOptionLabel &&
              specialOptionValue && (
                <button
                  type="button"
                  className="searchable-select__special-option"
                  onClick={handleSpecialSelect}
                >
                  {specialOptionLabel}
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;