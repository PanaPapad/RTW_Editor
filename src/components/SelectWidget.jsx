import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

export default function SelectWidget(props) {
  const {
    id,
    schema,
    options,
    value,
    required,
    disabled,
    readonly,
    label,
    placeholder,
    onChange,
    onBlur,
    rawErrors,
    multiple,
  } = props;

  const isError = Array.isArray(rawErrors) && rawErrors.length > 0;
  const helperText = isError ? rawErrors.join(" ") : options?.helperText || "";

  const rawOptions = schema.enum || (options && options.enumOptions) || [];
  // Normalize options to { value, label }
  const normalized = rawOptions.map((opt) => {
    if (opt && typeof opt === "object" && "value" in opt) {
      return { value: opt.value, label: opt.label ?? String(opt.value) };
    }
    // primitive
    return { value: opt, label: String(opt) };
  });

  // Determine safe primitive values for MenuItem keys and the TextField value
  const availableValues = new Set(normalized.map((o) => o.value));

  // If the current value exactly matches an available option, use it.
  // If it's null/undefined or doesn't match, fall back to an empty string AND
  // render a placeholder MenuItem so MUI does not consider the value out-of-range.
  let safeValue = value;
  let showPlaceholder;
  if (!multiple) {
    safeValue = value != null && availableValues.has(value) ? value : "";
    showPlaceholder = !availableValues.has(safeValue);
  } else {
    safeValue = Array.isArray(value)
      ? value.filter((v) => availableValues.has(v))
      : [];
    showPlaceholder = safeValue.length === 0;
  }

  return (
    <TextField
      select
      slotProps={{
        select: {
          multiple: multiple,
        },
      }}
      id={id}
      label={label}
      value={safeValue}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onBlur && onBlur(id, value)}
      fullWidth
      disabled={disabled || readonly}
      required={required}
      error={isError}
      helperText={helperText}
      variant={options?.variant || "outlined"}
      size={options?.size || "small"}
    >
      {showPlaceholder && (
        <MenuItem key="" value="">
          {placeholder || ""}
        </MenuItem>
      )}
      {normalized.map((opt) => (
        <MenuItem key={String(opt.value)} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
