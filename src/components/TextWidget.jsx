export default function TextWidget(props) {
  const {
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    onChange,
    onBlur,
    placeholder,
  } = props;
  return (
    <input
      id={id}
      className="rjsf-input"
      type="text"
      value={value ?? ""}
      placeholder={placeholder ?? ""}
      disabled={disabled || readonly}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onBlur && onBlur(id, value)}
    />
  );
}
