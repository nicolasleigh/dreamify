"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image as ImageFormType } from "@/types/blocks/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Dropzone from "../dropzone";

const MAX_IMAGE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const validateImage = (file, ctx) => {
  if (!file) return;
  if (file.size > MAX_IMAGE_SIZE) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Image cannot be greater than ${MAX_IMAGE_SIZE}`,
      fatal: true,
    });
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please upload a valid image file (PNG/JPG/JPEG)",
      fatal: true,
    });
  }
};

const formSchema = z.object({
  image: z
    .instanceof(File, {
      message: "Please select an image file",
    })
    .superRefine(validateImage),
  prompt: z.string().optional(),
});

export default function ImageForm({ section }: { section: ImageFormType }) {
  const [selectedImage, setSelectedImage] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      prompt: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsBusy(true);
    const formData = new FormData();
    formData.append("image", values.image);
    values.prompt && formData.append("prompt", values.prompt);
    const res = await fetch("/api/edit-image", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result) {
      setResultUrl(result.data);
    } else {
      // TODO:
      console.log("Error editing image");
    }
    setIsBusy(false);
  }

  const showSelectedImage = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedImage(url);
  };

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
      const fileType = allowedTypes.find((type) => type === acceptedFiles[0].type);
      if (!fileType) {
        form.setValue("image", null);
        form.setError("image", {
          message: "File type is not valid",
          type: "typeError",
        });
      } else {
        form.setValue("image", acceptedFiles[0]);
        showSelectedImage(acceptedFiles[0]);
        form.clearErrors("image");
      }
    } else {
      form.setValue("image", null);
      form.setError("image", {
        message: "Image file is required",
        type: "typeError",
      });
    }
  }

  return (
    <section id='generate' className='py-20 '>
      <div className='container grid md:grid-cols-2 gap-8'>
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>{section.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='flex gap-4 flex-col'>
                <div className='flex flex-col gap-4 w-full'>
                  <FormField
                    control={form.control}
                    name='image'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Dropzone
                            {...field}
                            dropMessage={section.dropzone}
                            handleOnDrop={handleOnDrop}
                            accept='image/*'
                            selectedImage={selectedImage}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <p className='text-xs mb-3'>{section.prompt_title}</p>

                  <div className='relative w-full'>
                    <FormField
                      control={form.control}
                      name='prompt'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder='' {...field} className='w-full pr-10' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Sparkles
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-primary opacity-45'
                      strokeWidth={1.2}
                    />
                  </div>

                  <Button type='submit' className={"rounded-full mt-5 w-full mb-2 hover:opacity-85"} disabled={isBusy}>
                    {isBusy ? (
                      <>
                        {section.generating} <Loader2Icon className='animate-spin' />
                      </>
                    ) : (
                      section.button
                    )}
                  </Button>
                  <a href='/#pricing' className='flex items-center justify-center w-full'>
                    <span>✨</span>
                    <span className='text-xs border-b border-dashed border-primary font-bold text-primary hover:opacity-85'>
                      {section.pro}
                    </span>
                    <span>✨</span>
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Result */}
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>{section.result_title}</CardTitle>
          </CardHeader>
          <CardContent>
            {resultUrl ? (
              <img src={resultUrl} width={500} height={500} alt='Edited result' className='rounded-md' />
            ) : (
              <p className='text-center my-40 text-neutral-500'>{section.result_text_content}</p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col items-start'></CardFooter>
        </Card>
      </div>
    </section>
  );
}
