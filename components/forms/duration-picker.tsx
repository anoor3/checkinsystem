"use client";

import { useController, type Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DurationPickerProps<T> {
  control: Control<T>;
  name: keyof T & string;
  label: string;
  description?: string;
}

export function DurationPicker<T>({ control, name, label, description }: DurationPickerProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input id={name} type="number" min={5} max={180} {...field} value={field.value ?? 20} />
        <span className="text-sm text-muted-foreground">minutes</span>
      </div>
      <p className={cn("text-xs text-muted-foreground", error && "text-destructive")}>{error?.message ?? description}</p>
    </div>
  );
}
