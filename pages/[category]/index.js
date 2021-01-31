import Layout from '../../components/Layout'
import { getCategories, getTools } from '../../lib/data'
import { categoryNameToSlug, categorySlugToName } from '../../lib/slugs'
import ToolCard from '../../components/ToolCard'

export default function Category({ categories, category, tools }) {

  if (!category) return <Layout>Loading....</Layout>

  return (
    <Layout categories={categories} title={category.fields.name} header={category.fields.name}>  
      <ToolCard.Group tools={tools} />
    </Layout>
  )
}

export async function getStaticProps(ctx) {
  const categoryName = categorySlugToName(ctx.params.category)
  const categories = await getCategories()
  let category

  categories.forEach(c => {
    if (c.fields.name === categoryName) {
      c.isSelected = true
      category = c
    }
  })

  if (!category) return { notFound: true }

  const tools = await getTools().then(t => t.filter(t => category?.fields?.tools?.includes(t.id)))

  return {
    props: { categories, category, tools },
    revalidate: 1,
  }
}

export async function getStaticPaths() {
  return {
    paths: (await getCategories())?.map(c => '/' + categoryNameToSlug(c.fields.name)),
    fallback: true
  }
}
