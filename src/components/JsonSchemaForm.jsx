import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { useMemo } from "react";
import "@lib/types.d.js";
import TextWidget from "./TextWidget.jsx";
import SelectWidget from "./SelectWidget.jsx";
import CustomFieldTemplate from "./CustomFieldTemplate.jsx";
import ObjectFieldTemplate from "./ObjectFieldTemplate.jsx";

/**
 * @callback onFormChange
 * @param {Event} e - The form change event object
 * @return {void}
 */
/**
 * @callback onFormSubmit
 * @param {SubmitEvent} e - The form submit event object
 * @return {void}
 */
/**
 * @typedef {Object}  JsonSchemaFormProps
 * @property {React.RefObject} formRef - Reference to the form instance
 * @property {JsonSchema7} schema - The JSON schema defining the form structure
 * @property {Object} uiSchema - The UI schema for customizing the form appearance
 * @property {Object} formData - The initial data for the form
 * @property {onFormChange} onFormChange - Callback function triggered on form data change
 * @property {onFormSubmit} onFormSubmit - Callback function triggered on form submission
 */

/**
 * JsonSchemaForm component
 * @param {JsonSchemaFormProps} props
 * @returns {JSX.Element}
 */
export default function JsonSchemaForm({
  formRef,
  schema,
  uiSchema,
  formData,
  onFormChange,
  onFormSubmit,
}) {
  const widgets = useMemo(() => ({ TextWidget, SelectWidget }), []);
  const fieldTemplates = useMemo(
    () => ({
      FieldTemplate: CustomFieldTemplate,
      ObjectFieldTemplate: ObjectFieldTemplate,
    }),
    []
  );

  return (
    <Form
      ref={formRef}
      schema={schema}
      validator={validator}
      uiSchema={uiSchema}
      formData={formData}
      widgets={widgets}
      templates={fieldTemplates}
      onChange={onFormChange}
      onSubmit={onFormSubmit}
    />
  );
}
