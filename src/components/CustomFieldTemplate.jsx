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
    schema,
    hidden,
  } = props;

  // Determine column span from uiSchema options (ui:options.col) or ui:col
  const col = uiSchema?.["ui:options"]?.col ?? uiSchema?.["ui:col"] ?? 12;
  const span = Math.max(1, Math.min(12, Number(col) || 12));

  const wrapperStyle = {
    gridColumn: `span ${span}`,
    minWidth: 0,
  };

  const isNotField = schema?.type === "array" || schema?.type === "object";
  const isNotEnum = !schema?.hasOwnProperty("enum");
  const hideLabel =
    uiSchema?.["ui:options"]?.label === false || isNotField || isNotEnum;
  return (
    <div className={classNames} id={id} style={wrapperStyle} hidden={hidden}>
      {!hideLabel && label ? (
        <label className="field-label" style={{ fontSize: "12px" }}>
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
