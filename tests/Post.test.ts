import { db } from '../api/db'
import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensures that a draft can be created and published', async () => {
  const count = await db.post.count()

  // Create a new draft
  const draftResult = await ctx.client.request(` 
    mutation {
      createDraft(title: "Nexus", body: "...") {
        id
        title
        body
        published
      }
    }
  `)

  const lastPost = await db.post.findFirst({ skip: count })
  const id = lastPost?.id

  // Snapshot that draft and expect `published` to be false
  expect(draftResult).toMatchInlineSnapshot(`
    Object {
      "createDraft": Object {
        "body": "...",
        "id": ${id},
        "published": false,
        "title": "Nexus",
      },
    }
  `)

  // Publish the previously created draft
  const publishResult = await ctx.client.request(
    `
    mutation publishDraft($draftId: Int!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id },
  )

  await db.post.delete({ where: { id } })
  const countAfter = await db.post.count()

  expect(count).toEqual(countAfter)

  // Snapshot the published draft and expect `published` to be true
  expect(publishResult).toMatchInlineSnapshot(`
    Object {
      "publish": Object {
        "body": "...",
        "id": ${id},
        "published": true,
        "title": "Nexus",
      },
    }
  `)
})
