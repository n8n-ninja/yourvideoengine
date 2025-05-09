// app/routes/scripts.tsx

import {
  type MetaFunction,
  type ActionFunctionArgs,
  redirect,
} from "@remix-run/cloudflare"
import { Form, useNavigation } from "@remix-run/react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { initSupabaseServerClient } from "~/lib/supabase.server"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"

export const meta: MetaFunction = () => [
  { title: "Add Script - YourVideoEngine" },
]

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  intro: z.string().optional(),
  content: z.string().optional(),
  outro: z.string().optional(),
})

export type ScriptForm = z.infer<typeof schema>

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const values = Object.fromEntries(formData)
  const result = schema.safeParse(values)

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { title, intro, content, outro } = result.data
  const supabase = initSupabaseServerClient(request)
  const { error } = await supabase.supabase
    .from("client1_scripts")
    .insert([{ title, intro, content, outro }])

  if (error) {
    return { error: error.message }
  }

  return redirect("/scripts")
}

export default function AddScript() {
  const navigation = useNavigation()

  const form = useForm<ScriptForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      intro: "",
      content: "",
      outro: "",
    },
  })

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Script</h1>

      <FormProvider {...form}>
        <Form method="post">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intro"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Intro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="outro"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Outro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-6"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Add Script"}
          </Button>
        </Form>
      </FormProvider>
    </div>
  )
}
