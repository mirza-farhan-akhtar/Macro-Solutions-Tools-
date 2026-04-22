import { createContext, useContext, useState } from 'react';

const LeadFormContext = createContext(null);

export function LeadFormProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState({});

  const openLeadForm = (data = {}) => {
    setPrefill(data);
    setOpen(true);
  };

  const closeLeadForm = () => {
    setOpen(false);
    setPrefill({});
  };

  return (
    <LeadFormContext.Provider value={{ open, openLeadForm, closeLeadForm, prefill }}>
      {children}
    </LeadFormContext.Provider>
  );
}

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) throw new Error('useLeadForm must be used inside LeadFormProvider');
  return ctx;
}
