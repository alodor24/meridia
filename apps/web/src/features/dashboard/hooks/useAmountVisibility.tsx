import { useState } from "react";

const STORAGE_KEY = "meridia-amount-visibility";

const useAmountVisibility = () => {
  const getValueStored = (): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== null ? JSON.parse(stored) : true;
  };

  const [isVisible, setIsVisible] = useState(getValueStored);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return {
    isVisible,
    toggleVisibility,
  };
};

export default useAmountVisibility;
