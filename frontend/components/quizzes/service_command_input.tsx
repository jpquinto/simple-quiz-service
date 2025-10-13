"use client";

import * as React from "react";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useServicesStore } from "@/stores/use-services";

interface ServiceCommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  serviceNameFormatter?: (name: string) => string;
}

export const ServiceCommandInput = ({
  value,
  onChange,
  onSubmit,
  serviceNameFormatter,
}: ServiceCommandInputProps) => {
  const [open, setOpen] = React.useState(false);
  const services = useServicesStore((state) => state.services);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Apply formatter to services if provided
  const formattedServices = React.useMemo(() => {
    return serviceNameFormatter
      ? services.map((service) => serviceNameFormatter(service))
      : services;
  }, [services, serviceNameFormatter]);

  // Filter services based on input
  const filteredServices = React.useMemo(() => {
    if (!value) return formattedServices.slice(0, 10);

    const searchTerm = value.toLowerCase();
    return formattedServices
      .filter((service) => service.toLowerCase().includes(searchTerm))
      .slice(0, 10);
  }, [value, formattedServices]);

  const handleSelect = (selectedService: string) => {
    onChange(selectedService);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        setOpen(false);
        onSubmit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!open) setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Enter service name..."
          className="w-full px-4 py-3 border border-amazon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-border bg-option-background focus:bg-blue-background"
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-card"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>No service found.</CommandEmpty>
            <CommandGroup heading="AWS Services">
              {filteredServices.map((service) => (
                <CommandItem
                  key={service}
                  value={service}
                  onSelect={() => handleSelect(service)}
                  className="cursor-pointer bg-card"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === service ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {service}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
