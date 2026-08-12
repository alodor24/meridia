import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatCurrency } from '@/utils/format';

export interface ExpensesByCategoryItem {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface ExpensesByCategoryProps {
  items: ExpensesByCategoryItem[];
  currency: string;
}

export function ExpensesByCategory({ items = [], currency }: ExpensesByCategoryProps) {
  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Gastos por categoría
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sin gastos en el período.
          </Typography>
        ) : (
          <Stack spacing={1.5} sx={{ mt: 2 }}>
            {items.map((item) => (
              <Box key={item.categoryId}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.total, currency)}
                    {total > 0 ? ` (${Math.round((item.total / total) * 100)}%)` : ''}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={total > 0 ? (item.total / total) * 100 : 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'divider',
                    '& .MuiLinearProgress-bar': { bgcolor: item.color },
                  }}
                />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
