declare global {
  interface Window {
    DateTimePicker: {
      new (options: DateTimePickerOptions): DateTimePicker;
      (options: DateTimePickerOptions): DateTimePicker;
    }
  }
}

import { useEffect, useRef } from 'react';

interface DateTimePickerOptions {
  minDate?: Date;
  maxDate?: Date | null;
  onConfirm?: (date: Date) => void;
  isRangePicker?: boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  linkedPicker?: DateTimePicker | null;
  dateOnly?: boolean;
  enabled?: boolean;
}

interface DateTimePicker {
  options: DateTimePickerOptions;
  visible: boolean;
  selectedDate: Date;
  attach: (input: HTMLInputElement) => void;
  show: () => void;
  hide: () => void;
  confirm: () => void;
  setMinDate: (date: Date) => void;
}

export function useDateTimePicker(
  onConfirm?: (date: Date) => void,
  options: Partial<DateTimePickerOptions> = {}
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<DateTimePicker | null>(null);

  useEffect(() => {
    if (inputRef.current && (!pickerRef.current || options.enabled === false)) {
      if (pickerRef.current) {
        inputRef.current.value = '';
        pickerRef.current = null;
      }

      if (options.enabled !== false) {
        pickerRef.current = new window.DateTimePicker({
          minDate: new Date(),
          onConfirm: (date: Date) => {
            if (onConfirm) {
              onConfirm(date);
            }
          },
          ...options
        });
        pickerRef.current?.attach(inputRef.current);
      }
    }
  }, [onConfirm, options.enabled]);

  return [inputRef, pickerRef] as const;
} 