import "./TextArea.css";

type TextAreaProps = {
  label: string;
  placeholder?: string;
};

function TextArea({ label, placeholder }: TextAreaProps) {
  return (
    <div className="text-area">

      <label className="text-area__label">
        {label}
      </label>

      <textarea
        className="text-area__input"
        placeholder={placeholder}
        rows={4}
      />

    </div>
  );
}

export default TextArea;