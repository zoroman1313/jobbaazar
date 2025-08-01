'use client'

import { useRouter } from 'next/navigation'
import GPTSetup from '../GPTSetup'

export default function GPTSetupPage() {
  const router = useRouter()

  const handleComplete = (aiEnabled: boolean) => {
    console.log('AI Enabled:', aiEnabled)
    router.push('/auth')
  }

  return <GPTSetup onComplete={handleComplete} />
} 