import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function LessonListSkeleton() {
  return (
    <div className='space-y-2'>
      {Array.from({length: 10}, (_, index) => (
        <Skeleton className='h-[53px]' key={index}/>
      ))}
    </div>
  )
}
