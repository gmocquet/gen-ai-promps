'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { fetchUserData } from '../lib/actions'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ServerActionResponse, ErrorTypeGuards } from '../lib/types'

export function UserDataFetcher() {
  const [state, dispatch] = useActionState<ServerActionResponse, void>(fetchUserData, null)
  const [error, setError] = useState<string | null>(null)

  const handleFetchData = () => {
    setError(null)
    dispatch()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Fetch User Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleFetchData}>Fetch Data</Button>
        {error && (
          <Alert className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {state && (
          <div className="mt-4">
            {state.success ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                {JSON.stringify(state.data.rawData, null, 2)}
              </pre>
            ) : (
              (() => {
                if (ErrorTypeGuards.isEmptyResultError(state.error)) {
                  return <Alert><AlertDescription>{state.error.message}</AlertDescription></Alert>
                } else if (ErrorTypeGuards.isDatabaseError(state.error) || 
                           ErrorTypeGuards.isUnknownError(state.error)) {
                  setError(state.error.message)
                }
                return null
              })()
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

