import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function CourseCreatorHeaderSkeleton() {
  return (
    <div className='w-full flex items-center gap-4'>
      <Skeleton className='h-[59px] w-[59px] rounded-md'/>
      <div className='flex-1 flex justify-between gap-4'>
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-full max-w-[150px] rounded-md'/>
          <Skeleton className='h-10 w-full max-w-[500px] rounded-md'/>
        </div>
        <div className='flex-1 flex flex-col items-end gap-2'>
          <Skeleton className='h-4 w-full max-w-[150px] rounded-md'/>
          <Skeleton className='h-10 w-full max-w-[300px] rounded-md'/>
        </div>
      </div>
    </div>
  )
}
