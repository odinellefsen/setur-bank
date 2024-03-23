import React, {useEffect, useRef, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {v4 as uuidv4} from 'uuid';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/shadcn/Form';
import {CiSquarePlus} from 'react-icons/ci';
import {Button} from '../shadcn/Button';
import {Input} from '../shadcn/Input';
import {MdDeleteOutline} from "react-icons/md";
import {useUser} from '@clerk/nextjs';

interface PersonAddress {
  pTal: string;
  addressID: string;
}

// Update your schema definitions to match the requirement for dynamic email fields
const personSchema = z.object({
  pTal: z.string().min(9).max(9, "pTal must be exactly 9 characters."),
  clerkID: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  dateOfBirth: z.date(),
});

const emailSchema = z.object({
  emails: z.array(z.object({
    emailID: z.string(),
    pTal: z.string().min(9).max(9),
    emailAddress: z.string().min(3),
  }))
});

const phoneNumberSchema = z.object({
  phoneNumbers: z.array(z.object({
    phoneNumberID: z.string(),
    pTal: z.string().min(9).max(9),
    phoneNumber: z.string().min(1),
  }))
});

const addressesSchema = z.object({
  addresses: z.array(z.object({
    addressID: z.string(),
    city: z.string(),
    zipCode: z.string(),
    streetAddress: z.string(),
  }))
});

const personsAddressesSchema = z.object({
  personsAddresses: z.array(z.object({
    pTal: z.string().min(9).max(9),
    addressID: z.string(),
  }))
});

export function ProfileForm() {
  const [isPersonSubmitted, setIsPersonSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {user} = useUser();

  const personForm = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: {
      pTal: '',
      clerkID: user?.id,
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: new Date(),
    },
  });

  const emailsForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      emails: [{ emailID: uuidv4(), pTal: '', emailAddress: '' }],
    },
  });

  const phoneNumberForm = useForm({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumbers: [{ phoneNumberID: uuidv4(), pTal: '', phoneNumber: '' }],
    },
  });

  const personAddressesForm = useForm({
    resolver: zodResolver(personsAddressesSchema),
    defaultValues: {
      personAddresses: [{ pTal: '', addressID: uuidv4() }],
    },
  });

  const addressesForm = useForm({
    resolver: zodResolver(addressesSchema),
    defaultValues: {
      addresses: [{ addressID: uuidv4(), city: '', zipCode: '', streetAddress: '' }],
    },
  });
  const watchedFirstAddressID = addressesForm.watch(`addresses.0.addressID`);

  // length of arrray
  const watchedAddresses = addressesForm.watch('addresses'); // Watches the entire addresses array
  const numberOfAddresses = watchedAddresses.length;

  const currentAddressId = useRef(watchedFirstAddressID);

  const { fields: phoneNumberFields, append: appendPhoneNumbers } = useFieldArray({
    control: phoneNumberForm.control,
    name: "phoneNumbers",
  });

  
  const { fields: emailsFields, append: appendEmails} = useFieldArray({
    control: emailsForm.control,
    name: "emails"
  })
  
  const { fields: addressFields, append: appendAddresses} = useFieldArray({
    control: addressesForm.control,
    name: "addresses"
  })
  
  const { fields: personAddressesFields, append: appendPersonAddresses} = useFieldArray({
    control: personAddressesForm.control,
    name: "personAddresses"
  })

  useEffect(() => {
    currentAddressId.current = watchedFirstAddressID;
  }, [watchedFirstAddressID]);
  
  const watchedPTal = personForm.watch("pTal");

  useEffect(() => {
    if (numberOfAddresses === 1) {
      const currentPersonAddresses = personAddressesForm.getValues("personAddresses");
      const newPersonAddresses = watchedAddresses.map(address => ({
        pTal: watchedPTal,
        addressID: address.addressID,
      }));

      // Assuming you want to compare the first addressID only when there's one address
      if (currentPersonAddresses[0]?.addressID !== newPersonAddresses[0]?.addressID) {
  
        if (JSON.stringify(newPersonAddresses) !== JSON.stringify(currentPersonAddresses)) {
          personAddressesForm.setValue("personAddresses", newPersonAddresses);
        }
      }
    }
  }, [numberOfAddresses, watchedPTal, watchedAddresses, personAddressesForm]);
  


  // Use a ref to track the current pTal value
  const currentPTal = useRef(watchedPTal);

  useEffect(() => {
    // Check if pTal has actually changed to prevent unnecessary updates
    if (currentPTal.current !== watchedPTal) {
      phoneNumberForm.setValue("phoneNumbers", phoneNumberFields.map(field => ({
        ...field,
        pTal: watchedPTal,
      })));
      emailsForm.setValue("emails", emailsFields.map(field => ({
        ...field,
        pTal: watchedPTal,
      })));
      personAddressesForm.setValue("personAddresses", personAddressesFields.map(field => ({
        ...field,
        pTal: watchedPTal
      })));
      // Update the current pTal ref
      currentPTal.current = watchedPTal;
    }
  }, [watchedPTal]);

  // Function to dynamically add an email input
  const addEmailInput = () => {
    appendEmails({ emailID: uuidv4(), pTal: watchedPTal, emailAddress: '' });
  };

  const addPhoneNumberInput = () => {
    appendPhoneNumbers({ phoneNumberID: uuidv4(), pTal: watchedPTal, phoneNumber: ''})
  }

  const addressesuuidv4 = uuidv4();

  const addAddressInput = () => {
    appendAddresses({ addressID: addressesuuidv4, city: '', zipCode: '', streetAddress: '' });
    appendPersonAddresses({ addressID: addressesuuidv4, pTal: watchedPTal });
  };

  // Handles submission for the person form
  async function onPersonsSubmit(data:any) {
    const apiUrl = "/api/persons"; // Your API endpoint for person submission
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit person data');
      }

      const result = await response.json();
      console.log('Person form submitted successfully:', result);
      setIsPersonSubmitted(true);
    } catch (error) {
      console.error('Error submitting person form:', error);
      setIsPersonSubmitted(false);
      setSubmitError('Failed to submit person form');
    }
  }

  async function onEmailsSubmit(data:any) {
    if (!isPersonSubmitted) {
      console.error('email form not successfully submitted, cannot submit email form.');
      return;
    }

    // Assuming your API can handle batch submission of emails
    const apiUrl = "/api/emails"; // Your API endpoint for email submission
    try {
      const responses = await Promise.all(data.emails.map((email:any) => 
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(email),
        })
      ));

      for (const response of responses) {
        if (!response.ok) {
          throw new Error('Failed to submit email data');
        }
      }

      console.log('All email forms submitted successfully');
    } catch (error) {
      console.error('Error submitting email forms:', error);
      setSubmitError('Failed to submit email forms');
    }
  }

  async function onPhoneNumbersSubmit(data:any) {
    if (!isPersonSubmitted) {
      console.error('Person form not successfully submitted, cannot submit email form.');
      return;
    }

    // Assuming your API can handle batch submission of emails
    const apiUrl = "/api/phoneNumbers"; // Your API endpoint for email submission
    try {
      const responses = await Promise.all(data.phoneNumbers.map((phoneNumber:any) => 
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(phoneNumber),
        })
      ));

      for (const response of responses) {
        if (!response.ok) {
          throw new Error('Failed to submit email data');
        }
      }

      console.log('All phone numbers forms submitted successfully');
    } catch (error) {
      console.error('Error submitting phone numbers forms:', error);
      setSubmitError('Failed to submit phone number forms');
    }
  }

  async function onAddressesSubmit(data:any) {
    const apiUrl = "/api/addresses"; // Your API endpoint for address submission
    console.log('stringified', JSON.stringify(data))
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit address data');
      }

      const result = await response.json();
      console.log('Addresses submitted successfully:', result);
    } catch (error) {
      console.error('Error submitting address form:', error);
      setSubmitError('Failed to submit address form');
    }
  }

  async function onPersonsAddressesSubmit(personAddresses: PersonAddress[]) {
    console.log('Attempting to submit personAddresses data');

    const datatime = personAddresses.map(({ id, ...rest }: PersonAddress & { id?: string }) => rest);

    const payload = { personsAddresses: datatime };

    console.log('stringified', JSON.stringify(payload))
  
    const apiUrl = "/api/personsAddresses"; // Your API endpoint
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit personsAddress data');
      }
  
      const result = await response.json();
      console.log('personsAddresses:', result);
    } catch (error) {
      console.error('Error submitting personsAddresses form:', error);
      // Ensure setSubmitError is defined and accessible in this context
      setSubmitError('Failed to submit personsAddresses form');
    }
  }

  function sleep(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Handles combined submission logic
  async function handleSubmitAll(event:any) {
    event.preventDefault();
    setSubmitError('');
    setIsPersonSubmitted(false); // Reset submission state

    // Sequentially submit person form first
    await personForm.handleSubmit(onPersonsSubmit)();
    await sleep(2000);
    await emailsForm.handleSubmit(onEmailsSubmit)();
    await phoneNumberForm.handleSubmit(onPhoneNumbersSubmit)();
    // await addressesForm.handleSubmit(onAddressesSubmit)();
    // const personAddressesData = personAddressesForm.getValues("personAddresses");
    // await onPersonsAddressesSubmit(personAddressesData)
  }

  return (
    <div className="space-y-8">
    <Form {...personForm}>
      <form>
        {/* Field for pTal */}
        {/* PERSONS TABLE. PERSONS TABLE. PERSONS TABLE. PERSONS TABLE. PERSONS TABLE. */}
        <FormField
          control={personForm.control}
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
            control={personForm.control} 
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
            control={personForm.control} 
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
            control={personForm.control} 
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

        <FormField 
            control={personForm.control} 
            name="dateOfBirth"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="mr-6">Føðingardagur</FormLabel>
                    <FormControl>
                        <input 
                            type="date"
                            className="text-color bg-background"
                            {...field}
                            value={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value.toISOString().substring(0, 10) : ''}
                            onChange={(e) => {
                                // Check if the input value is a valid date string
                                const date = new Date(e.target.value);
                                if (!isNaN(date.getTime())) {
                                    field.onChange(date);
                                } else {
                                    // Handle invalid date (e.g., clear the field or set a default value)
                                    field.onChange(null); // or set to a default value, e.g., new Date()
                                }
                            }}
                        />                      
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
      </form>
    </Form>
    <Form {...emailsForm}>
        <form>
          {emailsFields.map((field, index) => (
            <FormField 
              key={field.id}
              control={emailsForm.control} 
              name={`emails.${index}.emailAddress`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email    value:{index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <CiSquarePlus className="w-8 h-8 cursor-pointer mt-1" onClick={addEmailInput} />
        </form>
      </Form>
      <Form {...phoneNumberForm}>
        <form onSubmit={handleSubmitAll}>
          {phoneNumberFields.map((field, index) => (
            <FormField 
              key={field.id}
              control={phoneNumberForm.control} 
              name={`phoneNumbers.${index}.phoneNumber`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon Nummar    value:{index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <CiSquarePlus className="w-8 h-8 cursor-pointer mt-1 mb-4" onClick={addPhoneNumberInput} />
          <Button type="submit">Submit All</Button>
        </form>
      </Form>
      {/* <Form {...addressesForm}>
        <form>
          {addressFields.map((field, index) => (
            <div key={field.id}>
              <FormField
                control={addressesForm.control} 
                name={`addresses.${index}.streetAddress`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bústaður t.d. Vestara Bryggja 15    value:{index + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressesForm.control} 
                name={`addresses.${index}.zipCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postnummar t.d. 160    value:{index + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addressesForm.control} 
                name={`addresses.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Býur/Bygd t.d. Tórshavn    value:{index + 1}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <CiSquarePlus className="w-8 h-8 cursor-pointer mt-1 mb-4" onClick={addAddressInput} />
          
        </form>
      </Form> */}
      {submitError && <p>Error: {submitError}</p>}
  </div>
  );
}
