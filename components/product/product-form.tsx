"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ImageUpload } from "@/components/product/image-upload"
import { useToast } from "@/hooks/use-toast"

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Please select a category"),
  condition: z.string().min(1, "Please select a condition"),
  images: z.array(z.string()).min(1, "Please provide at least one image"),
  quantity: z.coerce.number().int().positive("Quantity must be a positive integer"),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().positive().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  originalPackaging: z.boolean().default(false),
  manualIncluded: z.boolean().default(false),
  workingCondition: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: ProductFormValues & { id?: string }
  isEditing?: boolean
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues: Partial<ProductFormValues> = initialData || {
    title: "",
    description: "",
    price: 0,
    category: "",
    condition: "",
    images: [],
    quantity: 1,
    brand: "",
    model: "",
    year: undefined,
    material: "",
    color: "",
    originalPackaging: false,
    manualIncluded: false,
    workingCondition: "",
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true)

      const productId = isEditing && initialData ? initialData.id : undefined;
      const response = await fetch(isEditing && productId ? `/api/products/${productId}` : "/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save product")
      }

      const product = await response.json()

      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: isEditing
          ? "Your product has been updated successfully"
          : "Your product has been created successfully",
      })

      router.push(`/products/${product._id}`)
      router.refresh()
    } catch (error: any) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <ImageUpload value={field.value} onChange={field.onChange} disabled={isSubmitting} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Toys">Toys</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Model name/number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Manufacture (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Material" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your product in detail" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workingCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working Condition (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the working condition of your product"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="originalPackaging"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Original Packaging</FormLabel>
                  <FormDescription>Product comes with original packaging</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manualIncluded"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Manual/Instructions Included</FormLabel>
                  <FormDescription>Product comes with manual or instructions</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </form>
    </Form>
  )
}
// filepath: c:\Users\Nimis\Downloads\ecofinds\app\products\new\page.tsximport { redirect } from "next/navigation"import { getCurrentUser } from "@/lib/auth"import { ProductForm } from "@/components/product/product-form"export default async function NewProductPage() {  const user = await getCurrentUser()  if (!user) {    redirect("/sign-in")  }  return (    <div className="container py-8">      <div className="max-w-4xl mx-auto">        <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Product</h1>        <ProductForm />      </div>    </div>  )}