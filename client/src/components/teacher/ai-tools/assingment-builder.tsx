import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export const AssignmentBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [generated, setGenerated] = useState('')

  async function handleGenerate() {
    // Simulate AI for demo; replace with API call to backend/LLM in your project
    setGenerated(`Sample assignment for: ${prompt}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assignment Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          label="Assignment Description"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter topic or keywords"
        />
        <Button onClick={handleGenerate} className="mt-2" disabled={!prompt}>Generate</Button>
        {generated && (
          <div className="mt-4 border p-2 rounded text-gray-700 bg-gray-50">{generated}</div>
        )}
      </CardContent>
    </Card>
  )
}