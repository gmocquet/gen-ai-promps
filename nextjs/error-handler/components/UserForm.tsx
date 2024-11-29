'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState } from 'react'
import { userSchema, UserFormData } from '../lib/schema'
import { submitUserData } from '../lib/actions'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UserForm() {
  const [clientValidation, setClientValidation] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useActionState(submitUserData, null)
  const [submissionTime, setSubmissionTime] = useState<string | null>(null)

  const form = useForm<UserFormData>({
    resolver: clientValidation ? zodResolver(userSchema) : undefined,
    defaultValues: {
      name: 'John',
      email: 'jdoe@acme.com',
      age: 25,
      bio: 'I\'m an American',
    },
  })

  const onSubmit = (data: UserFormData) => {
    startTransition(() => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString())
        }
      })
      console.log('Form data on client:', form.getValues())
      console.log('Emit formData to server:')
      console.log(formData)
      dispatch(formData)
    })
  }

  useEffect(() => {
    if (state?.success) {
      // form.reset()
      setSubmissionTime(state.timeField)
    } else if (state?.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        form.setError(key as keyof UserFormData, { type: 'server', message: value })
      })
    }
  }, [state, form])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input {...field} type="number" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="client-validation"
                checked={clientValidation}
                onCheckedChange={setClientValidation}
              />
              <label htmlFor="client-validation">Enable client-side validation</label>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
        {submissionTime && (
          <Alert className="mt-4">
            <AlertDescription>
              Form submitted successfully at: {new Date(submissionTime).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

