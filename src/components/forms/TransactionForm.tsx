// form for Income and Expenses
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the schema based on transaction type
const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().optional(),
});

const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  description: z.string().optional(),
});

type TransactionFormProps = {
  type: "expense" | "income";
  onSuccess?: (formData: any) => void;
};

export default function TransactionForm({ type, onSuccess }: TransactionFormProps) {
  const session = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const schema = type === "expense" ? expenseSchema : incomeSchema;

  // Initialize the form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: type === "expense" 
      ? {
          category: "",
          amount: "",
          description: "",
        }
      : {
          source: "",
          amount: "",
          description: "",
        },
  }); 

  useEffect(() => {
    setIsSignedIn(!!session);
  }, [session]);

  function onSubmit(values: z.infer<typeof schema>) {
    if (!session) {
      toast.error("Please sign-in to perform this action.");
      return;
    }

    console.log('Form submitted with values:', values);
    toast.success(
      `${type === "expense" ? "Expense" : "Income"} recorded`,
      {
        description: `${type === "expense" ? "Expense" : "Income"} has been successfully recorded.`,
      }
    );
    form.reset();
    // Pass the values to the onSuccess callback if provided
    if (onSuccess) {
      onSuccess(values);
    }
  }

  // Expense categories
  const expenseCategories = [
    "Utilities",
    "Rent",
    "Salaries",
    "Marketing",
    "Office Supplies",
    "Travel",
    "Insurance",
    "Maintenance",
    "Software",
    "Other",
  ];

  // Income sources
  const incomeSources = [
    "Product Sales",
    "Services",
    "Consulting",
    "Investments",
    "Interest",
    "Royalties",
    "Other",
  ];

  return (
    <Card className="form-card">
      <CardHeader>
        <CardTitle>
          {type === "expense" ? "Record Expense" : "Record Income"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {type === "expense" ? (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Income Source</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select income source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {incomeSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (R)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div></div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter description" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Record {type === "expense" ? "Expense" : "Income"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
