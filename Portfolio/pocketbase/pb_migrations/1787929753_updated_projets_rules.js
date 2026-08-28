/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // lecture publique (List + View) pour le front
  collection.listRule = ""
  collection.viewRule = ""

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  collection.listRule = null
  collection.viewRule = null

  return app.save(collection)
})
