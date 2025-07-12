"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Dropzone from "../dropzone";
import { Image as ImageFormType } from "@/types/blocks/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      prompt: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("image", values.image);
    values.prompt && formData.append("prompt", values.prompt);
    const res = await fetch("/api/edit-image", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result) {
      // console.log("res-result:", result);
      setResultUrl(result.data);
    } else {
      // TODO:
      console.log("Error editing image");
    }
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
    <section className='py-24 '>
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
                    {/* <Input className='w-full pr-10' value={prompt} /> */}
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

                  <Button type='submit' className='rounded-full mt-5 w-full mb-2'>
                    {section.button}
                  </Button>
                  <a href='#' className='flex items-center justify-center w-full'>
                    <span>✨</span>
                    <span className='text-xs border-b border-dashed border-primary font-bold text-primary'>
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
              <img src={resultUrl} alt='Edited result' className='rounded-md' />
            ) : (
              <p className='text-center mt-40 text-neutral-500'>{section.result_text_content}</p>
            )}
          </CardContent>
          <CardFooter className='flex flex-col items-start'></CardFooter>
        </Card>
      </div>
    </section>
  );
}
