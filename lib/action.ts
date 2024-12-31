"use server";

import { auth } from "@/auth";
import { parseServerResponse } from "./utils";

import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write_client";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();
  if (!session)
    return parseServerResponse({ error: "Not signed in", status: "ERROR" });

  const { title, description, link, category } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      image: link,
      category,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerResponse({ ...result, error: "", status: "SUCCESS" });
  } catch (error) {
    console.log(error);

    return parseServerResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
