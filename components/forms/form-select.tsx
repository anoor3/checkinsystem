"use client";

import { useController, type Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps<T> {
  control: Control<T>;
  name: keyof T & string;
  label: string;
  options: Option[];
  placeholder?: string;
  description?: string;
}

export function FormSelect<T>({ control, name, label, options, placeholder, description }: FormSelectProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select onValueChange={field.onChange} value={field.value ?? ""}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className={cn("text-xs text-muted-foreground", error && "text-destructive")}>{error?.message ?? description}</p>
    </div>
  );
}
