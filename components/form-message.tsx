import React from 'react';

export type Message = 
  | { success: string } 
  | { error: string } 
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  // Custom error message mapping
  const getErrorMessage = (error: string) => {
    return error === "Invalid login credentials" 
      ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" 
      : error;
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm text-gray-700">
      {("success" in message) && (
        <div className="text-foreground border-l-2 border-foreground px-4 text-gray-700">
          {message.success}
        </div>
      )}
      
      {("error" in message) && (
        <div className="text-foreground border-l-2 border-destructive-foreground px-4 text-rose-500">
          {getErrorMessage(message.error)}
        </div>
      )}
      
      {("message" in message) && (
        <div className="text-foreground border-l-2 px-4 text-gray-700">
          {message.message}
        </div>
      )}
    </div>
  );
}

export default FormMessage;