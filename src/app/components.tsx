'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export function ExpirationRecordSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add Record</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a Drug Expiration Record</SheetTitle>
        </SheetHeader>
        <ExpirationRecordForm />
      </SheetContent>
    </Sheet>
  );
}

const Schema = z.object({
  name: z.string(),
  date: z.date(),
});
export type Schema = z.infer<typeof Schema>;

export function ExpirationRecordForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(Schema),
    defaultValues: {
      date: new Date(),
      name: '',
    },
  });
  const drugs = [
    {
      label: 'Paracetamol',
      value: 'paracetamol',
    },
    {
      label: 'Ibuprofen',
      value: 'ibuprofen',
    },
    {
      label: 'Aspirin',
      value: 'aspirin',
    },
    {
      label: 'Amoxicillin',
      value: 'amoxicillin',
    },
    {
      label: 'Ciprofloxacin',
      value: 'ciprofloxacin',
    },
    {
      label: 'Doxycycline',
      value: 'doxycycline',
    },
  ];
  const onSubmit = (data: Schema) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Drug</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? drugs.find((drug) => drug.value === field.value)
                            ?.label
                        : 'Select Drug'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search drug..." />
                    <CommandEmpty>No drug found.</CommandEmpty>
                    <CommandGroup>
                      {drugs.map((drug) => (
                        <CommandItem
                          value={drug.label}
                          key={drug.value}
                          onSelect={() => {
                            form.setValue('name', drug.value);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              drug.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {drug.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the name of the drug you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the date when the drug will expire.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
