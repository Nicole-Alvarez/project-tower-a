import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Skeleton } from '../ui/skeleton';

interface CommonBreadcrumbData {
  type: 'link' | 'page',
  link?: string;
  label: string;
  loading?: boolean; 
}

interface Props {
  data: CommonBreadcrumbData[]
}

export default function CommonBreadcrumb({data}: Props) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map((item, index) => (
          <>
            {item.type === 'link' 
              ? (
                <BreadcrumbItem>
                  {item.loading 
                    ? <Skeleton className='h-[25px] w-[150px]'/>
                    : <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
                  }
                </BreadcrumbItem>
              ) 
              : (
                <BreadcrumbItem>
                  {item.loading 
                    ? <Skeleton className='h-[25px] w-[150px]'/>
                    : <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  }
                </BreadcrumbItem>
              )
            }
            {(index + 1) < data.length && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
  </Breadcrumb>
  )
}
