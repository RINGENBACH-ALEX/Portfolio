/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_735139002")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2673742485",
    "maxSelect": 0,
    "name": "maitrise",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Faible",
      "Moyen",
      "Expert"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_735139002")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2673742485",
    "maxSelect": 0,
    "name": "maitrise",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Débutant"
    ]
  }))

  return app.save(collection)
})
