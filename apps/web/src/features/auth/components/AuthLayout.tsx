import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import PaymentsIcon from '@mui/icons-material/Payments';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentsIcon color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700}>
              Meridia
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            {subtitle}
          </Typography>
        </Box>
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant="h6" mb={2} fontWeight={600}>
              {title}
            </Typography>
            {children}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
