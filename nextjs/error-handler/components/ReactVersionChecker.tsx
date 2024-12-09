'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReactVersionChecker() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>React Version Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p>React Version: {React.version}</p>
      </CardContent>
    </Card>
  )
}
