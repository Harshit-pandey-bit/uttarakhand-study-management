import React from 'react'

interface ScratchEmbedProps {
  projectId: string
}

export const ScratchEmbed: React.FC<ScratchEmbedProps> = ({ projectId }) => (
  <iframe
    src={`https://scratch.mit.edu/projects/embed/${projectId}/?autostart=false`}
    allow="autoplay; encrypted-media"
    allowFullScreen
    className="w-full h-[480px] rounded-lg border"
    title="Scratch Project Embed"
  />
)