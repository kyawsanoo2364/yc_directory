"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-markdown-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/action";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };
      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation Failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occured",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: "An unexpected error has occured",
        status: "ERROR",
      };
    } finally {
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form className="startup-form" action={formAction}>
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          className="startup-form_input"
          id="title"
          name="title"
          placeholder="Startup Title"
          required
        />
        {errors.title && <p className="startup-form_error">{errors?.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          className="startup-form_textarea"
          id="description"
          name="description"
          placeholder="Startup Description"
          required
        />
        {errors.description && (
          <p className="startup-form_error">{errors?.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          className="startup-form_input"
          id="category"
          name="category"
          placeholder="Startup Category (Education,Robots...)"
          required
        />
        {errors.category && (
          <p className="startup-form_error">{errors?.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          className="startup-form_input"
          id="link"
          name="link"
          placeholder="Startup Image URL"
          required
        />
        {errors.link && <p className="startup-form_error">{errors?.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value)}
          id="pitch"
          editable
          height={"300px"}
          style={{ borderRadius: 20, overflow: "hidden" }}
          placeholder={"Briefly describe your idea and what problem it solves"}
          previewProps={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors?.pitch}</p>}
      </div>
      <Button
        className="startup-form_btn w-full flex items-center text-white "
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};
export default StartupForm;
