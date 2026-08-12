import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
}

const colorMap = {
  primary: 'primary.main',
  success: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
  info: 'info.main',
};

export function StatCard({ title, value, subtitle, icon, color = 'primary' }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          borderColor: 'primary.light',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: colorMap[color] }}>{icon}</Box>}
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: colorMap[color] }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
