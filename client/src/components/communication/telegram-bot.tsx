import React from 'react'
import { Button } from '../ui/button'

export const TelegramBot: React.FC<{ botUrl: string }> = ({ botUrl }) => (
  <div>
    <a href={botUrl} target="_blank" rel="noopener noreferrer" aria-label="Join Telegram Bot">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <img src="/icons/telegram.svg" alt="Telegram Logo" className="w-5 h-5" />
        Connect to Telegram
      </Button>
    </a>
  </div>
)