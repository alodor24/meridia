import IconField from "@/components/ui/IconField";

interface CategoryIconPickerProps {
  name: string;
  label: string;
}

const CategoryIconPicker = ({ name, label }: CategoryIconPickerProps) => (
  <IconField name={name} label={label} />
);

export default CategoryIconPicker;
