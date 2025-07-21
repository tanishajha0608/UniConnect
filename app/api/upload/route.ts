import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const userId = formData.get("user_id") as string

    if (!file || !bucket || !userId) {
      return NextResponse.json({ error: "File, bucket, and user_id are required" }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
