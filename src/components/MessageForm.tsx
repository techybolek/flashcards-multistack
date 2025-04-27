import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      alert('Message submitted: ' + message);
      setMessage('');
    } else {
      alert('Please enter a message first!');
    }
  };

  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Type your message here..." 
        className="min-h-[150px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex justify-end">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
} 