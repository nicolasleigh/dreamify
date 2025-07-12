import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ImageUp, ImageUpIcon } from "lucide-react";
import React, { ChangeEvent, useRef } from "react";

interface DropzoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  classNameWrapper?: string;
  className?: string;
  dropMessage: string;
  handleOnDrop: (acceptedFiles: FileList | null) => void;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, classNameWrapper, dropMessage, handleOnDrop, accept, selectedImage, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    // Function to handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      handleOnDrop(null);
    };

    // Function to handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { files } = e.dataTransfer;
      if (inputRef.current) {
        inputRef.current.files = files;
        handleOnDrop(files);
      }
    };

    // Function to simulate a click on the file input element
    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };
    return (
      <Card
        ref={ref}
        className={cn(
          `border border-dashed hover:cursor-pointer rounded-md shadow-none hover:bg-muted md:w-full h-[400px] transition-all duration-500`,
          classNameWrapper
        )}
      >
        <CardContent
          className='flex flex-col items-center justify-center px-0 py-4 text-sm h-full '
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className='flex items-center justify-center text-muted-foreground'>
            {selectedImage ? (
              <img src={selectedImage} className='h-[400px] w-full rounded-md aspect-video ' />
            ) : (
              <div className='flex flex-col items-center'>
                <ImageUpIcon className='' strokeWidth={1.2} />
                <span className=''>{dropMessage}</span>
              </div>
            )}

            <Input
              {...props}
              value={undefined}
              ref={inputRef}
              type='file'
              className={cn("hidden", className)}
              accept={accept}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleOnDrop(e.target.files)}
              onClick={(e) => (e.target.value = null)}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);

export default Dropzone;
