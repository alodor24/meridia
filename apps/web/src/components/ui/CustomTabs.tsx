import { Children, SyntheticEvent, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import getTabProps from "@/utils/getTabProps";
import CustomTabPanel from "./CustomTabPanel";

interface CustomTabsProps {
  children: React.ReactNode;
  labels: string[];
}

const CustomTabs = ({ children, labels }: CustomTabsProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const childrenArray = Children.toArray(children);

  if (labels.length !== childrenArray.length) {
    console.warn("labels y children deben tener la misma cantidad");
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="tabs">
        {labels.map((label, index) => (
          <Tab
            key={label}
            label={label}
            {...getTabProps(index)}
            sx={{
              textTransform: "capitalize",
              color: "text.primary",
              fontWeight: 600,
            }}
          />
        ))}
      </Tabs>

      {childrenArray.map((child, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {child}
        </CustomTabPanel>
      ))}
    </>
  );
};

export default CustomTabs;
