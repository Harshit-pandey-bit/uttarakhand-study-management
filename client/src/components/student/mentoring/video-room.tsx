import React from 'react'

interface VideoRoomProps {
  sessionId: string
}

export const VideoRoom: React.FC<VideoRoomProps> = ({ sessionId }) => {
  // Placeholder for video integration (Google Meet, Zoom SDK integrations planned)
  return (
    <div className="w-full h-[600px] bg-black text-white flex items-center justify-center rounded-md">
      Video Room for session ID: {sessionId}
    </div>
  )
}