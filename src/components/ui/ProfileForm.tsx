import {Button} from "@/components/shadcn/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/Form";
import {Input} from "@/components/shadcn/Input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {DatePickerForm} from "@/components/shadcn/DatePicker"; // Assumed component for date input

// Updated form schema to include all required fields
const formSchema = z.object({
  pTal: z.string().min(9).max(9, "pTal must be exactly 9 characters."),
  firstName: z.string() /*.min(1, "First name is required.")*/,
  middleName: z.string().optional(),
  lastName: z.string() /*.min(1, "Last name is required.")*/,
  dateOfBirth: z.date(),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pTal: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: new Date(), // Default to current date or another sensible default
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Field for pTal */}
        <FormField
          control={form.control}
          name="pTal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pTal (dømi: 123456000)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
            control={form.control} 
            name="firstName"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornavn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
        />

        <FormField 
            control={form.control} 
            name="middleName"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Millumnavn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
        />

        <FormField 
            control={form.control} 
            name="lastName"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Eftirnavn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
        />

        {/* Additional fields for firstName, middleName, lastName, dateOfBirth */}
        {/* Repeat similar structure for each field, adjusting labels and placeholders as necessary. */}
        {/* Note: The DatePicker component is assumed. Replace with your actual date picker component. */}

        {/* <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                {/* Adjust this to use your actual DatePicker component, if available */}
                {/* <DatePickerForm /> */}
              {/* </FormControl> */}
              {/* <FormMessage /> */}
            {/* </FormItem> */}
          {/* )} */}
        {/* /> */}

        {/* Repeat the structure for firstName, middleName, and lastName */}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
