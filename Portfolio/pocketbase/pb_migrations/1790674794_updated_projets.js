/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // add field
  collection.fields.addAt(3, new Field({
    "convertURLs": false,
    "help": "",
    "hidden": false,
    "id": "editor4008348701",
    "maxSize": 0,
    "name": "processus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // remove field
  collection.fields.removeById("editor4008348701")

  return app.save(collection)
})
