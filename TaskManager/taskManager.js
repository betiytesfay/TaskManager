use taskManagerDB
db.users.insertOne({ _id: 1, name: "Beti", email: "Beti@gmail.com" })
db.users.insertOne({ _id: 2, name: "Selam", email: "Selam@gmail.com" })

db.tasks.insertOne({ title: "Finish project", assignedTo: 1, status: "pending", tags: ["urgent", "personal"] })
db.tasks.insertOne({ title: "Buy groceries", assignedTo: 2, status: "done", tags: ["personal", "for cooking"] })

db.tasks.insertOne({ title: "Plan trip", assignedTo: 1, status: "in progress", tags: ["travel", "passport"] })

db.users.find()
db.tasks.find({ assignedTo: 1 })
db.tasks.find({ status: "done" })
db.tasks.find({}, { title: 1, _id: 0 })

db.users.updateOne({ name: "Beti" }, { $set: { email: "betinew@gmail.com" } })
db.tasks.updateMany({ status: "pending" }, { $set: { status: "in progress" } })
db.tasks.updateOne({ title: "Plan trip" }, { $push: { tags: "vacation" } })

db.users.deleteOne({ name: "Selam" })
db.tasks.deleteMany({ status: "done" })
