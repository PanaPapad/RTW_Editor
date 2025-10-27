import React from "react";
import TextField from "@mui/material/TextField";

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
    options,
    rawErrors,
    formContext,
  } = props;

  const isError = Array.isArray(rawErrors) && rawErrors.length > 0;
  const helperText = isError ? rawErrors.join(" ") : options?.helperText || "";

  const handleChange = (e) => {
    // rjsf expects raw value in onChange
    onChange(
      e.target.value === "" ? options?.emptyValue ?? "" : e.target.value
    );
  };

  const handleBlur = (e) => {
    if (onBlur) onBlur(id, e.target.value);
  };

  const multiline =
    !!options?.multiline ||
    props?.schema?.type === "array" ||
    (props?.schema?.type === "string" && props?.schema?.format === "textarea");
  const rows = options?.rows || (multiline ? 4 : undefined);

  return (
    <TextField
      id={id}
      label={label}
      placeholder={placeholder}
      value={value ?? ""}
      required={required}
      disabled={disabled || readonly}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth
      multiline={multiline}
      rows={rows}
      error={isError}
      helperText={helperText}
      variant={options?.variant || "outlined"}
      size={options?.size || "small"}
      inputProps={{
        "aria-label": label || placeholder || id,
      }}
    />
  );
}
