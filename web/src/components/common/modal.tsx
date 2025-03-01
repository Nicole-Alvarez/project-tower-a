import * as DialogPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { cn } from '@/lib/utils'

const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalClose = DialogPrimitive.Close

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className="fixed inset-0 bg-[#031926]/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        {...props}
        style={{
            zIndex: 1000,
        }}
    />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        onOverlayClick?: React.MouseEventHandler
    }
>(({ className, children, onOverlayClick, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <ModalOverlay onClick={onOverlayClick} />
        <DialogPrimitive.Content
            className={cn(
                'fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=open]:z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
                className
            )}
            {...props}
            style={{ zIndex: 1000 }}
        >
            {children}
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            'text-lg font-semibold leading-none tracking-tight',
            className
        )}
        {...props}
    />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col space-y-1.5 text-center sm:text-left',
            className
        )}
        {...props}
    />
)
ModalHeader.displayName = 'ModalHeader'

const ModalFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            className
        )}
        {...props}
    />
)
ModalFooter.displayName = 'ModalFooter'

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
    />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

//   export const Modal = ({ title, isOpen, onOpenChange, dialogTrigger, children, closeButton = false,height = 300, width = 300}: any) => {
//     return (
//         <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
//             <Dialog.Trigger>
//                 {dialogTrigger}
//             </Dialog.Trigger>

//         </Dialog.Root>
//     )
//   }
export {
    Modal,
    ModalPortal,
    ModalOverlay,
    ModalClose,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
}
