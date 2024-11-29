'use client'

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState } from 'react'
import { userSchema, UserFormData } from '@/schemas/userSchema'
import { submitUserForm } from '@/actions/userActions'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function UserForm() {
  const [useClientValidation, setUseClientValidation] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useActionState(submitUserForm, null)

  const form = useForm<UserFormData>({
    resolver: useClientValidation ? zodResolver(userSchema) : undefined,
    defaultValues: {
      name: '',
      email: '',
      age: undefined,
      isSubscribed: false,
    },
  })

  const { handleSubmit, reset, setError, formState: { errors } } = form

  useEffect(() => {
    if (state?.success) {
      reset()
    } else if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        setError(key as keyof UserFormData, {
          type: 'server',
          message: Array.isArray(value) ? value[0] : value,
        })
      })
    }
  }, [state, reset, setError])

  const onSubmit = (data: UserFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    console.log('Client submitting form data:', data)

    startTransition(() => {
      dispatch(formData)
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Information Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSubscribed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Subscribe to newsletter</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="client-validation"
                checked={useClientValidation}
                onCheckedChange={setUseClientValidation}
              />
              <label htmlFor="client-validation">
                Enable client-side validation
              </label>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
        {state?.success && (
          <p className="mt-4 text-green-600">{state.message}</p>
        )}
        {state?.success === false && state.message && (
          <p className="mt-4 text-red-600">{state.message}</p>
        )}
      </CardContent>
    </Card>
  )
}

