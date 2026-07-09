import "./TextField.css";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
};

function TextField({
  label,
  placeholder,
  type = "text",
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
      />

    </div>
  );
}

export default TextField;