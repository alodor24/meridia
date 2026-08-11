import type { ReactNode } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

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
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: colorMap[color] }}>{icon}</Box>}
        </Box>
        <Typography variant="h6" component="div" fontWeight={600} sx={{ color: colorMap[color] }}>
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
