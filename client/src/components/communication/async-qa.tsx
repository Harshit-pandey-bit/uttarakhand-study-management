import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface Question {
  id: number
  text: string
  response?: string
}

export const AsyncQA: React.FC<{ questions?: Question[] }> = ({ questions: initialQuestions = [] }) => {
  const [questions, setQuestions] = useState(initialQuestions)
  const [newQuestion, setNewQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const submitQuestion = () => {
    if (!newQuestion.trim()) return
    const id = questions.length ? questions[questions.length - 1].id + 1 : 1
    setLoading(true)
    setTimeout(() => {
      setQuestions([...questions, { id, text: newQuestion, response: 'Please wait for response...' }])
      setNewQuestion('')
      setLoading(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Async Q&A</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {questions.map(q => (
            <div key={q.id} className="mb-3 border rounded p-2">
              <p className="font-medium">{q.text}</p>
              <p className="mt-1 text-xs text-gray-600 italic">{q.response || 'Pending response'}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow"
          />
          <Button disabled={loading} onClick={submitQuestion}>Ask</Button>
        </div>
      </CardContent>
    </Card>
  )
}