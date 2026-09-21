import { Typography } from "@mui/material";

interface CurrencyDisplayProps {
  value: string;
}

const CurrencyDisplay = ({ value }: CurrencyDisplayProps) => {
  const [currency = "", amount = ""] = value.split(" ");
  const [integerPart = "", decimalPart] = amount.split(",");

  return (
    <>
      {currency + " " + integerPart}
      <Typography
        component="sup"
        sx={{ pl: 0.2, fontSize: 13, fontWeight: 700 }}>
        {decimalPart}
      </Typography>
    </>
  );
};

export default CurrencyDisplay;
