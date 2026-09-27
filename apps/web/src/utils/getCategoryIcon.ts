import categoryIcons from './categoryIcons'

const getCategoryIcon = (iconName: string) => {
    const icon = categoryIcons.find((icon) => icon.name === iconName);
    return icon?.component;
}

export default getCategoryIcon;