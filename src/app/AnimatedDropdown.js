import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

export default function AnimatedDropdown({ label, value, onChange, options, name, required, sx }) {
  const [open, setOpen] = React.useState(false);
  return (
    <FormControl fullWidth variant="outlined" sx={{ ...sx }}>
      <Select
        displayEmpty
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderValue={(selectedValue) => {
          if (!selectedValue) {
            return (
              <span style={{ color: '#6b7280', fontWeight: 400 }}>
                {label}
              </span>
            );
          }
          const selectedOption = options.find(opt => opt.value === selectedValue);
          return selectedOption ? selectedOption.label : '';
        }}
        sx={{
          borderRadius: '16px',
          boxShadow: open ? "0 8px 32px rgba(124,58,237,0.18)" : "0 2px 8px rgba(124,58,237,0.07)",
          transition: "box-shadow 0.3s cubic-bezier(.4,2,.3,1)",
          background: "#fafaff",
          fontWeight: 500,
          fontFamily: 'Roboto, Be Vietnam Pro, Arial, Helvetica, sans-serif',
          border: '1.5px solid #a78bfa',
          fontSize: '16px',
          color: '#222',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          '& .MuiSelect-select': {
            padding: '10px 16px',
          },
          ...sx
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '16px',
              boxShadow: "0 12px 48px rgba(124,58,237,0.18)",
              animation: open ? "dropdownFadeIn 0.35s cubic-bezier(.4,2,.3,1)" : "none",
              fontSize: '17px',
              fontWeight: 500,
              color: '#222',
              fontFamily: 'Roboto, Be Vietnam Pro, Arial, Helvetica, sans-serif',
            },
          },
        }}
      >
        {options.map((opt) => {
          if (opt.value === '') return null;
          return (
            <MenuItem key={opt.value} value={opt.value} sx={{
              fontWeight: 500,
              fontSize: 17,
              color: '#222',
              letterSpacing: '0.01em',
              transition: 'background 1s',
              '&:hover': { background: '#ede9fe' },
            }}>{opt.label}</MenuItem>
          );
        })}
      </Select>
      <style>{`
        @keyframes dropdownFadeIn {
          0% { opacity: 0; transform: translateY(-16px) scaleY(0.95); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); }
        }
      `}</style>
    </FormControl>
  );
}