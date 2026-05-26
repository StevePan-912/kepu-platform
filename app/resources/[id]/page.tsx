import ResourceDetailClient from './ResourceDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  return {
    title: `科普资源 | 科普漫步`,
    description: `查看科普资源详情 - ${id}`,
  }
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ResourceDetailClient id={id} />
}
