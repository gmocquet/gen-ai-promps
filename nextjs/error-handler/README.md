# user-input-form

NextJS 15 - React 19 rc - zod - react-hook-form - client & server validation - Prisma - SQLite

# v0.dev AI Prompt

## Prompts experiments

### Create a Prisma schema & store FormData inside a database table

I want to improve error handling between client and server. Instead of defining on each action the JSON response, I want a cenral place where I can define a global error handling system. 

Requirements:
- Follow KISS principle with TypeScript for static type checking
- Use Zod for form schema validation:
  - Apply schema on both client and server
  - Handle Server Action errors using FormData input
  - Use safeParse for validation
  - Return validation errors as a structured object
  - Server action requires prevState and formData parameters due to useActionState

I want a way to structure the JSON error response I might to output in case of validatedFields failure. I want to be able to relay on static type checking on both client and server side
