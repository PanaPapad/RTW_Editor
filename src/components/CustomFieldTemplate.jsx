export default function CustomFieldTemplate(props) {
  const {
    id,
    classNames,
    style,
    label,
    help,
    required,
    description,
    errors,
    children,
    uiSchema,
  } = props;

  // Determine column span from uiSchema options (ui:options.col) or ui:col
  const col = uiSchema?.["ui:options"]?.col ?? uiSchema?.["ui:col"] ?? 12;
  const span = Math.max(1, Math.min(12, Number(col) || 12));

  const wrapperStyle = {
    gridColumn: `span ${span}`,
    minWidth: 0,
  };

  const hideLabel = uiSchema?.["ui:options"]?.label === false;

  return (
    <div className={classNames} id={id} style={wrapperStyle}>
      {!hideLabel && label ? (
        <label className="field-label">
          {label}
          {required ? " *" : ""}
        </label>
      ) : null}

      {description}
      {children}
      {errors}
      {help}
    </div>
  );
}
