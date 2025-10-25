import { useCallback } from "react";

function Item({ item, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);
  return <div onClick={handleClick}>{item.name}</div>;
}

export default function ItemList({ items, onSelect }) {
  if (!items || items.length === 0) {
    return <div>No items found.</div>;
  }
  return (
    <div>
      {items.map((item) => (
        <Item key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
