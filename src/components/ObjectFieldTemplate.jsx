import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function ObjectFieldTemplate(props) {
  const {
    TitleField,
    DescriptionField,
    title,
    description,
    properties,
    uiSchema,
  } = props;

  const renderTitle = () => {
    if (!title) return null;
    if (typeof TitleField === "function") return <TitleField title={title} />;
    return (
      // floating label positioned over the Paper border to mimic an input label
      <Box
        component="span"
        sx={{
          display: "inline-block",
          position: "relative",
          top: -10,
          ml: 1,
          px: 0.5,
          bgcolor: "background.paper",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        {title}
      </Box>
    );
  };

  const renderDescription = () => {
    if (!description) return null;
    if (typeof DescriptionField === "function")
      return <DescriptionField description={description} />;
    return <p>{description}</p>;
  };

  let orderedProps = properties;
  try {
    // Get order array from uiSchema - Either All or None of the properties can be specified
    const order = uiSchema?.["ui:order"] ?? uiSchema?.["ui:options"]?.order;
    if (Array.isArray(order) && order.length > 0) {
      const propMapByName = new Map(properties.map((p) => [p.name, p]));
      const _orderedProps = [];
      for (const key of order) {
        if (propMapByName.has(key)) {
          _orderedProps.push(propMapByName.get(key));
          propMapByName.delete(key);
        }
      }
      orderedProps = _orderedProps;
    }
  } catch (e) {
    orderedProps = properties;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        padding: 1,
        marginBottom: 1,
      }}
    >
      <Box className="object-field">
        {renderTitle()}
        {renderDescription()}

        <div className="form-grid">
          {orderedProps.map((prop) => (
            // prop.content is already the rendered field (wrapped by FieldTemplate)
            // render it directly to avoid extra wrappers that can break layout
            <React.Fragment key={prop.name || prop.content?.props?.id}>
              {prop.content}
            </React.Fragment>
          ))}
        </div>
      </Box>
    </Paper>
  );
}
