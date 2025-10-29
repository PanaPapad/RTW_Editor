import { useCallback } from "react";

function Item({ item, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      style={{
        display: "flex",
        padding: "8px 10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      }}
    >
      {item.name}
    </div>
  );
}

// Make the list scrollable. Accept an optional `maxHeight` prop so callers can control size.
export default function ItemList({ items, onSelect }) {
  if (!items || items.length === 0) {
    return <div>No items found.</div>;
  }

  return (
    <div
      className="item-list"
      style={{
        maxHeight: "70vh",
        overflowY: "auto",
        border: "1px solid #f0f0f0",
        borderRadius: 4,
        background: "#fff",
      }}
    >
      {items.map((item) => (
        <Item key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
