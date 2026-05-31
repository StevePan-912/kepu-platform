/**
 * Supabase Storage 工具函数
 * 提供文件上传、下载、删除等操作封装
 */
import { supabase, createServerClient } from './client'

// ============================================================
// 存储桶名称常量（需先在 Supabase Dashboard 创建）
// ============================================================
export const STORAGE_BUCKETS = {
  RESOURCES: 'resources',       // 科普资源文件（图片/音频/视频）
  AVATARS: 'avatars',           // 用户头像
  AR_MODELS: 'ar-models',       // AR 3D 模型文件（glb/gltf）
  EXPORTS: 'exports',           // 数据导出文件
} as const

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

// ============================================================
// 文件路径生成
// ============================================================

/**
 * 生成唯一文件路径
 * @param bucket 存储桶
 * @param folder 文件夹（可选）
 * @param fileName 原始文件名
 * @returns 唯一路径，如 "resources/images/abc123.jpg"
 */
export function generateStoragePath(
  bucket: StorageBucket,
  folder: string,
  fileName: string
): string {
  const ext = fileName.split('.').pop() ?? 'bin'
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`
  return `${bucket}/${folder}/${uniqueName}`
}

// ============================================================
// 上传
// ============================================================

interface UploadResult {
  path: string
  publicUrl: string
}

/**
 * 上传文件到 Supabase Storage
 * @param bucket 存储桶
 * @param folder 文件夹
 * @param file File 对象（浏览器）或 Buffer
 * @param fileName 原始文件名或自定义名
 * @param contentType MIME 类型
 */
export async function uploadFile(
  bucket: StorageBucket,
  folder: string,
  file: File | Buffer | ArrayBuffer,
  fileName: string,
  contentType?: string
): Promise<{ data: UploadResult | null; error: string | null }> {
  try {
    const path = generateStoragePath(bucket, folder, fileName)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      data: { path: data.path, publicUrl: urlData.publicUrl },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 服务端上传（使用 service_role 绕过 RLS）
 */
export async function uploadFileServer(
  bucket: StorageBucket,
  folder: string,
  file: Buffer | ArrayBuffer,
  fileName: string,
  contentType?: string
): Promise<{ data: UploadResult | null; error: string | null }> {
  try {
    const client = createServerClient()
    const path = generateStoragePath(bucket, folder, fileName)

    const { data, error } = await client.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      data: { path: data.path, publicUrl: urlData.publicUrl },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ============================================================
// 删除
// ============================================================

/**
 * 删除存储文件
 */
export async function deleteFile(
  bucket: StorageBucket,
  paths: string | string[]
): Promise<{ error: string | null }> {
  try {
    const pathArray = Array.isArray(paths) ? paths : [paths]
    const { error } = await supabase.storage.from(bucket).remove(pathArray)
    if (error) throw error
    return { error: null }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

// ============================================================
// 公共 URL
// ============================================================

/**
 * 获取文件的公开访问 URL
 */
export function getPublicUrl(
  bucket: StorageBucket,
  path: string
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * 批量获取文件公开 URL
 */
export function getPublicUrls(
  bucket: StorageBucket,
  paths: string[]
): string[] {
  return paths.map((path) => getPublicUrl(bucket, path))
}

// ============================================================
// 文件列表
// ============================================================

/**
 * 列出存储桶中指定文件夹下的文件
 */
export async function listFiles(
  bucket: StorageBucket,
  folder: string,
  limit = 100,
  offset = 0
): Promise<{
  data: { name: string; size: number; created_at: string }[] | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit,
        offset,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) throw error

    return {
      data:
        data?.map((f) => ({
          name: f.name,
          size: f.metadata?.size ?? 0,
          created_at: f.created_at ?? '',
        })) ?? [],
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}
