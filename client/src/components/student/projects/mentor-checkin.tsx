import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

interface MentorCheckinProps {
  onCheckin?: () => void
}

export const MentorCheckin: React.FC<MentorCheckinProps> = ({ onCheckin }) => {
  const [checkedIn, setCheckedIn] = useState(false)

  const handleCheckin = () => {
    setCheckedIn(true)
    onCheckin?.()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        {checkedIn ? (
          <p className="text-green-600 font-semibold">You have checked in with your mentor.</p>
        ) : (
          <Button variant="primary" onClick={handleCheckin}>Check In Now</Button>
        )}
      </CardContent>
    </Card>
  )
}