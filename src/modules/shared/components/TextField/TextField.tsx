import "./TextField.css";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
};

function TextField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: TextFieldProps) {
  return (
    <div className="text-field">

      <label className="text-field__label">
        {label}
      </label>

      <input
        className="text-field__input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />

    </div>
  );
}

export default TextField;