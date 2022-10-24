// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}


// batchSize = 100;
// // byte string size in the document
// var docSize = 100;
// function makeDocument(docSize) {
//     var doc = { "fieldName": "" };
//     while (Object.bsonsize(doc) < docSize) {
//         doc.fieldName += "x";
//     }
//     return doc;
// }
// doc = makeDocument(docSize);


// sizes = [100]
sizes = [100, 10000, 1000000, 10000000]

// Clear existing file
const command = `> output-data-manual-insertion.csv`
run("bash", "-c", command);

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}{BYTES}
        name: "ManualInsertion".concat(size.toString()),
        tags: ["streams", "manual-insert"],
        pre: function (collection) {
            let streamName = "ManualInsertion".concat(size.toString());

            collection.getDB()[`${streamName}-output`].drop()

            let agg = []

            agg.push({
                $merge: { into: { db: "test0", coll: `${streamName}-output`} }
            })

            collection.getDB().createStream(streamName, agg)
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ManualInsertion".concat(size.toString()),
                doc: doc
            }
        ],
        post: function (collection, env) {
            print("@START_TEST_PRINT@")
            let streamName = "ManualInsertion".concat(size.toString())
            let totalCount = collection.getDB()[`${streamName}-output`].count()

            const dropStream = collection.getDB()[streamName].drop()
            print(`Drop stream status`, dropStream)

            const dropCollection = collection.getDB()[`${streamName}-output`].drop()
            print(`Drop collection status`, dropCollection)

            const data = `${streamName},${env.threads},${totalCount}`
            const command = `echo ${data} >> output-data-manual-insertion.csv`
            run("bash", "-c", command);
            print("@END_TEST_PRINT@")
        }
    });
});


// TEST empty $match pipeline

// sizes.forEach(size => {
//     // Create the documents
//     doc = { "fieldName": 'x'.repeat(size) }

//     tests.push({
//         name: "ManualInsertion".concat(size.toString()),
//         tags: ['insert', 'regression'],
//         pre: function (collection) {
//             let agg = []

//             agg.push({
//                 $match: { fieldName: "Nothin" }
//             })

//             // agg.push({
//             //     $merge: { into: { db: "test0", coll: "output0" } }
//             // })

//             collection.getDB().createStream("ManualInsertion".concat(size.toString()), agg)
//         },
//         ops: [
//             {
//                 op: "insert",
//                 ns: "test0.ManualInsertion".concat(size.toString()),
//                 doc: doc
//             }
//         ],
//         post: function (collection) {
//             print("@START_TEST_PRINT@")
//             print("Count of total into manual insertion: ", collection.getDB()["output0"].count())
//             //printjson(collection.getDB()["output0"].findOne())
//             print("@END_TEST_PRINT@")
//             collection.getDB()["ManualInsertion".concat(size.toString())].drop()
//             collection.getDB()["output0"].drop()
//             sleep(5000)
//             // collection.drop()
//         }
//     })
// });


// TEST window count
// TEST manual insertion source

// sizes.forEach((size) => {
//     // Create the documents
//     doc = { "fieldName": 'x'.repeat(size) }

//     tests.push({
//         name: `ManualInsertion${size}`,
//         tags: ['insert', 'regression'],
//         pre: function (collection) {
//             let agg = []

//             print("@START_TEST_PRINT@")

//             let streamName = collection.getName()

//             const dropRes1 = collection.getDB()[streamName].drop()

//             print("collection.getDB()", collection.getDB(), `${streamName}-output`)
//             const dropRes2 = collection.getDB()[`${streamName}-output`].drop()

//             print(`Count of total into manual insertion ${streamName}: `, collection.getDB()[`${streamName}-output`].count())

//             print("PRE dropRes1", dropRes1)
//             print("PRE dropRes2", dropRes2)
//             sleep(5000)

//             // let agg = []

//             // agg.push({
//             //     $merge: { into: { db: "test0", coll: `${streamName}-output`} }
//             // })

//             // agg.push({ $window: { type: 'tumbling', size: 5, unit: 'second' } })

//             // agg.push({
//             //     $groups: { _id: null, count: { $sum: 1 } }
//             // })

//             // agg.push({
//             //     $set: { _id: "$count" }
//             // })

//             agg.push({
//                 $merge: { into: { db: "test0", coll: `${streamName}-output` } }
//             })

//             const createStreamRes = collection.getDB().createStream(streamName, agg)

//             printjson(createStreamRes)
//             print("@END_TEST_PRINT@")
//         },
//         ops: [
//             {
//                 op: "insert",
//                 ns: "test0.ManualInsertion".concat(size.toString()),
//                 doc: doc
//             }
//         ],
//         post: function (collection) {
//             print("@START_TEST_PRINT@")
//             // let streamName = `ManualInsertion-${size}`
//             let streamName = collection.getName()
//             print("collection.getDB()", collection.getDB())

//             print(`Count of total into manual insertion ${streamName}: `, collection.getDB()[`${streamName}-output`].count())
//             printjson(collection.getDB()[`${streamName}-output`].findOne())

//             const dropRes1 = collection.getDB()[streamName].drop()
//             const dropRes2 = collection.getDB()[`${streamName}-output`].drop()

//             print("POST dropRes1", dropRes1)
//             print("POST dropRes2", dropRes2)

//             print(">>>>>>>>>>>>>>>>")
//             print("@END_TEST_PRINT@")
//             sleep(5000)
//             // collection.drop()
//         }
//     })
// });