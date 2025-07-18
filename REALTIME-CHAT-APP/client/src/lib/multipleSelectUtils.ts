import React from "react";
import type { Option } from "@/store/Interface";

export function useDebounce<T>(value: T, delay?: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function transToGroupOption(options: Option[], groupBy?: keyof Option | null): Record<string, Option[]> {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: Record<string, Option[]> = {};
  options.forEach((option: Option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

export function removePickedOption(groupOption: Record<string, Option[]>, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = (value as Option[]).filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}

export function isOptionsExist(groupOption: Record<string, Option[]>, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}
