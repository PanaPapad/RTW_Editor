import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export function Pane({ title, children }) {
  return <>{children}</>;
}

export default function TabbedPane({ children, defaultIndex = 0, sx }) {
  const panes = React.Children.toArray(children).filter(Boolean);
  const labels = panes.map((c, i) => c.props?.title ?? `Tab ${i + 1}`);
  const [index, setIndex] = useState(defaultIndex);

  return (
    <Box sx={sx}>
      <Tabs
        value={index}
        onChange={(_, v) => setIndex(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {labels.map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>
      <Box sx={{ mt: 1, overflowY: "auto" }}>
        {panes[index] && panes[index].props && panes[index].props.children}
      </Box>
    </Box>
  );
}

// attach Pane as a property for convenient usage: <TabbedPane><TabbedPane.Pane title="...">..</TabbedPane.Pane></TabbedPane>
TabbedPane.Pane = Pane;
