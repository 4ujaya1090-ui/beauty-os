import "./TextArea.css";

type TextAreaProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: TextAreaProps) {
  return (
    <div className="text-area">

      <label className="text-area__label">
        {label}
      </label>

      <textarea
        className="text-area__input"
        placeholder={placeholder}
        rows={4}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />

    </div>
  );
}

export default TextArea;