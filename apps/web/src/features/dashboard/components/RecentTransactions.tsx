import type { Transaction } from '@meridia/shared';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from '@tanstack/react-router';
import { formatCurrency, formatDate } from '@/utils/format';

export interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export function RecentTransactions({ transactions = [], currency }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Últimos movimientos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No hay movimientos en el período.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Últimos movimientos
        </Typography>
        {transactions.map((transaction, index) => (
          <Box key={transaction.id}>
            {index > 0 && <Divider />}
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: transaction.categoryColor ?? '#607d8b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {transaction.categoryName?.charAt(0) ?? '?'}
                </Box>
                <Stack sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {transaction.categoryName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {formatDate(transaction.date)} · {transaction.accountName}
                  </Typography>
                </Stack>
              </Stack>
              <Chip
                size="small"
                variant="outlined"
                color={transaction.type === 'income' ? 'success' : 'error'}
                label={formatCurrency(transaction.amount, currency)}
              />
            </Stack>
          </Box>
        ))}
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2">
            <Link to="/app/transactions">Ver todos los movimientos</Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
