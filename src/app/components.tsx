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
import { CalendarIcon, Check, ChevronsUpDown, Plus } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFormStatus } from 'react-dom';
import { createExpirationRecord, findDrugs } from './actions';
import { useQuery } from '@tanstack/react-query';

type Drugs = Array<{
  label: string;
  value: string;
}>;

export function ExpirationRecordSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-fit self-end">
          <Plus className="mr-2 h-4 w-4" />
          Create Expiration Record
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a Drug Expiration Record</SheetTitle>
        </SheetHeader>
        <ExpirationRecordForm onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function useFindDrugs(searchTerm: string) {
  const query = useQuery({
    queryKey: ['drugs'],
    queryFn: () => findDrugs(searchTerm),
    enabled: searchTerm.length >= 3,
  });
  return query;
}

const Schema = z.object({
  name: z.string(),
  date: z.date(),
});
export type Schema = z.infer<typeof Schema>;

export function ExpirationRecordForm(props: { onClose: () => void }) {
  const form = useForm<Schema>({
    resolver: zodResolver(Schema),
    defaultValues: {
      date: new Date(),
      name: '',
    },
  });
  const pending = form.formState.isSubmitting;
  const [searchTerm, setSearchTerm] = useState('');
  const query = useFindDrugs(searchTerm);
  const handleSearch = async (value: string) => {
    console.log({ value });
    setSearchTerm(value);
  };
  console.log(query.status);
  const drugs = query.data ?? [];
  console.log({ drugs });
  const onSubmit = async (data: Schema) => {
    await createExpirationRecord(data);
    props.onClose();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 py-4">
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
                        'w-full justify-between h-full',
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
                <PopoverContent className="w-[300px] p-0 ">
                  <Command>
                    <CommandInput
                      placeholder="Search drug..."
                      onValueChange={handleSearch}
                      value={searchTerm}
                    />
                    <CommandEmpty className="px-1.5">
                      {searchTerm.length < 3
                        ? 'Please enter at least 3 characters to start searching.'
                        : 'No drug found.'}
                    </CommandEmpty>
                    <ScrollArea className="h-72">
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
                    </ScrollArea>
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
        <Button type="submit">{pending ? 'Saving ...' : 'Add Record'}</Button>
      </form>
    </Form>
  );
}
