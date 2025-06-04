"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // Get authentication parameters for ImageKit
      const authResponse = await fetch("/api/imagekit/auth")
      
      if (!authResponse.ok) {
        const errorData = await authResponse.json().catch(() => ({ message: "Failed to get ImageKit authentication parameters: Invalid server response" }));
        console.error("Failed to get ImageKit auth params:", errorData);
        throw new Error(errorData.message || "Failed to get ImageKit authentication parameters");
      }
      
      const authData = await authResponse.json()

      if (!authData.signature || !authData.expire || !authData.token) {
        console.error("Invalid authentication parameters received:", authData);
        toast({
          title: "Upload Authentication Error",
          description: "Received invalid authentication parameters from the server.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      if (!publicKey) {
        console.error("ImageKit public key is not configured. Set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variable.");
        toast({
          title: "Upload Configuration Error",
          description: "ImageKit public key is not configured. Please contact support or check environment variables.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("publicKey", publicKey) // Use the public key from env
        formData.append("signature", authData.signature)
        formData.append("expire", authData.expire) // ImageKit expects a number (Unix timestamp)
        formData.append("token", authData.token)
        formData.append("fileName", `ecofinds_${Date.now()}_${file.name}`)
        formData.append("folder", "/ecofinds/products") // Optional: ensure this folder path is desired

        const uploadResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }

        const uploadData = await uploadResponse.json()
        return uploadData.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedUrls])

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${uploadedUrls.length} image(s)`,
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = ""
    }
  }

  const onRemove = (url: string) => {
    onChange(value.filter((current) => current !== url))
  }

  if (!isMounted) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="images">Product Images</Label>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="images"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">{isUploading ? "Uploading..." : "Upload Images"}</div>
              <div className="text-xs text-muted-foreground">Drag and drop or click to upload</div>
            </div>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onUpload}
              disabled={disabled || isUploading}
            />
          </Label>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative aspect-square rounded-md overflow-hidden border">
              <Image src={url || "/placeholder.svg"} alt="Product image" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemove(url)}
                  disabled={disabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
