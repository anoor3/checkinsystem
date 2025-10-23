"use client";

import { useController, type Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateTimePickerProps<T> {
  control: Control<T>;
  name: keyof T & string;
  label: string;
  description?: string;
}

export function DateTimePicker<T>({ control, name, label, description }: DateTimePickerProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type="datetime-local" {...field} value={field.value ?? ""} />
      <p className={cn("text-xs text-muted-foreground", error && "text-destructive")}>{error?.message ?? description}</p>
    </div>
  );
}
