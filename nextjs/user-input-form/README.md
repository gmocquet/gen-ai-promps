# user-input-form

NextJS 15 - React 19 rc - zod - react-hook-form - client & server validation

# v0.dev AI Prompt

## Optimized prompt using Claude 3.5 Sonnet

Create a Form page to collect and store user input in a database using NextJS 15.0.3 (App Router) and React 19-rc.

Requirements:
- Follow KISS principle with TypeScript for static type checking
- Use Zod for form schema validation:
  - Apply schema on both client and server
  - Handle Server Action errors using FormData input
  - Use safeParse for validation
  - Return validation errors as a structured object
  - Server action requires prevState and formData parameters due to useActionState

- Implement form management:
  - Use react-hook-form for client-side error highlighting
  - Utilize useActionState (React 19-rc) named "dispatch" for form processing
  - Use useTransition hook
  - Handle submission via onSubmit with startTransition
  - Create FormData object with non-null values only
  - Prevent server action triggering before initial call
  - Use useEffect for response handling

- Error handling:
  - Implement server try/catch blocks
  - Return JSON response with success boolean
  - Include Zod validation errors when applicable
  - Process server response on client to display field-specific errors

- Development features:
  - Add console.logs for form data on both client (just before calling the server action and on server action return) and server
  - Reset fields after successful submission
  - Add a client-side message after the submit button comming from the server-side to inform user that the form successfully processed after submition success
  - Use shadcn/ui components (Form, Card, Input, Label, Button, Switch)
  - Center content both horizontally and vertically
  - Add client-side validation toggle switch:
    - When disabled: undefined resolver, server receives raw data
    - When enabled: use zodResolver with schema

- File structure:
  - Separate files for:
    - Server action (use server ; in /actions directory) 
    - Form component (in /components directory)
    - Page definition (in /app router directory)
    - Zod schema (in /schemas directory)
    - Shared code like utils (in /lib directory)

- Best practices:
  - Use public online shadcn/ui components
  - Ensure value props use ?? operator for null safety
  - Use useFormField within <FormField> context

## Initial prompt

How to create a page with a Form to collect user input and store given elements in a database using NextJS 15.0.3 with App Router using React 19-rc.

Requirements are:
- Follow KISS principle
- Strong static type checking using TypeScript
- Zod to create form schema and validate data both on Server and Client side
- Handle the Server Action errors linked to the Zod validation. The input of the Server Action is a FormData. Use the same Zod schema for both client and server side. Use the safeParse method for validation of submitted data. Collect errors using issues and return an object that will be used by the client side to show errors field by field. Due to usage of useActionState, the server action has 2 parameters: the first is the prevState and the second the formData.
- react-hook-form to manage form on client side to highlight errors field by field
- Use React 19-rc useActionState (from react module) to manage form submission and processing link between client and server action. Name the useActionState formAction "dispatch".
- With useActionState, don't handle the form submission using the action method. Instead, use the onSubmit attribute. Inside the onSubmit call function, use startTransition to properly dispatch the form submission. Inside this function create a new FormData object to transmit data from client to server using a simple object. Submit only non-null values.
- With useActionState, manage the fact that the server action and code used to handle the server action response don't trigger anything before the first call.
- Use useEffect hook to handle the server action response
- Server has try/catch blocks to prevent errors. The output of the Server Action is a JSON with success: boolean and in case of form error due to Zod validation failure, an errors JSON object composed of Zod errors of all fields having an error
- On client side, if the client-side Zod validation succeeds, call the server action and take JSON output from Server Action and interact with form to inform user about errors field by field
- Add console.log to view submitted form data from client side
- Add console.log to view received form data inside the server action
- Reset form fields when form has been successfully submitted
- For UI rely on shadcn/ui components like Form, Card, Input, Label, Button, Switch
- Center the content in both width and height
- Add a switch to allow users to disable client-side form validation. When it's disabled, form zod resolver equals undefined; otherwise zodResolver using the zod schema. If it is the case, the server action receives the raw form data directly.
- Create a dedicated file for the server action code using "use server". Create a dedicated file to store the form component. Create a dedicated file to store the page definition. Only the page is located inside the app router directory. Create a dedicated file to store the zod schema.
- For the Demo, rely on public online shadcn/ui components.
- On the client side form, make sure the value prop is never null. Use the ?? operator to put empty string instead of null value
- Make sure useFormField should be used within <FormField>