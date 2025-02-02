import React, { useState, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { SubmitHandler } from 'react-hook-form';

type BigSubmitButtonProps = {
  children: ReactNode;
  className?: string;
  onSubmit?: SubmitHandler<any>;
};

export function BigSubmitButton({
  children,
  className,
  onSubmit,
  ...props
}: BigSubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
      event.preventDefault();
      return;
    }

    try {
      setIsSubmitting(true);
      
      // If there's an onSubmit prop, call it
      if (onSubmit) {
        await onSubmit(event as any);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      // Re-enable the button after a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000); // 2 seconds prevention window
    }
  };

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={className}
      style={{ 
        backgroundColor: isSubmitting ? "#a0a0a0" : "#1537e8",
        cursor: isSubmitting ? 'not-allowed' : 'pointer'
      }}
      onClick={handleSubmit}
      {...props}
    >
      {isSubmitting ? 'Submitting...' : children}
    </Button>
  );
}