import React from "react";
export default function ObjectFieldTemplate(props) {
  const { TitleField, DescriptionField, title, description, properties } =
    props;

  const renderTitle = () => {
    if (!title) return null;
    if (typeof TitleField === "function") return <TitleField title={title} />;
    return <h3>{title}</h3>;
  };

  const renderDescription = () => {
    if (!description) return null;
    if (typeof DescriptionField === "function")
      return <DescriptionField description={description} />;
    return <p>{description}</p>;
  };

  return (
    <div className="object-field">
      {renderTitle()}
      {renderDescription()}

      <div className="form-grid">
        {properties.map((prop) => (
          // prop.content is already the rendered field (wrapped by FieldTemplate)
          // render it directly to avoid extra wrappers that can break layout
          <React.Fragment key={prop.name || prop.content?.props?.id}>
            {prop.content}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
