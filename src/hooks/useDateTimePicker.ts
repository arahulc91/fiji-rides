import { useEffect, useRef } from 'react';

interface DateTimePickerOptions {
  minDate?: Date;
  maxDate?: Date | null;
  onConfirm?: (date: Date) => void;
  isRangePicker?: boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  linkedPicker?: unknown;
}

interface DateTimePicker {
  new (options: DateTimePickerOptions): {
    attach: (element: HTMLElement) => void;
    setMinDate: (date: Date) => void;
    hide: () => void;
    show: () => void;
    updateUI: () => void;
  };
}

declare global {
  interface Window {
    DateTimePicker: DateTimePicker;
  }
}

export function useDateTimePicker(onChange?: (date: Date) => void) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const picker = new window.DateTimePicker({
        minDate: new Date(),
        onConfirm: onChange
      });
      picker.attach(inputRef.current);
    }
  }, [onChange]);

  return inputRef;
} 