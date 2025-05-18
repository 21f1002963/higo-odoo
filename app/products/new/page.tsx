import { ProductForm } from "@/components/product/product-form"

export default async function NewProductPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Product</h1>
        <ProductForm />
      </div>
    </div>
  )
}
