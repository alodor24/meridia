import { Box, FormHelperText, Typography } from '@mui/material';
import { useField } from 'formik';

const PRESET_COLORS = [
  '#2e7d32', '#43a047', '#66bb6a', '#81c784',
  '#d32f2f', '#f57c00', '#0288d1', '#7b1fa2',
  '#f06292', '#3949ab', '#00838f', '#757575',
  '#d81b60', '#e53935', '#8e24aa', '#6d4c41',
];

export function ColorField({ name, label = 'Color' }: { name: string; label?: string }) {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched && Boolean(meta.error);

  return (
    <Box mt={2}>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', alignItems: 'center' }}>
        {PRESET_COLORS.map((color) => (
          <Box
            key={color}
            role="button"
            aria-label={`Color ${color}`}
            onClick={() => helpers.setValue(color)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                helpers.setValue(color);
              }
            }}
            tabIndex={0}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: color,
              cursor: 'pointer',
              border: 2,
              borderColor: field.value === color ? 'primary.main' : 'transparent',
              '&:hover': { transform: 'scale(1.1)' },
              transition: 'all 0.15s',
            }}
          />
        ))}
        <Box
          component="label"
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: 'background.paper',
          }}
          title="Color personalizado"
        >
          <input
            type="color"
            value={field.value || '#607d8b'}
            onChange={(e) => helpers.setValue(e.target.value)}
            style={{ width: 0, height: 0, border: 'none', opacity: 0, position: 'absolute' }}
          />
          <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: field.value || '#607d8b' }} />
        </Box>
      </Box>
      {showError && <FormHelperText error>{meta.error}</FormHelperText>}
    </Box>
  );
}
