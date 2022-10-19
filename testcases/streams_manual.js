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


sizes = [100, 10000, 100000, 1000000]

// test manual insertion source

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}-{BYTES}
        name: "ManualInsertion".concat(size.toString()),
        tags: ['streams'],
        pre: function (collection) {
            //collection.getDB()["ManualInsertion0"].drop()
            //collection.getDB()["output0"].drop()

            //sleep(5000)

            let agg = []

            agg.push({
                $merge: { into: { db: "test0", coll: "output0" } }
            })

            collection.getDB().createStream("ManualInsertion".concat(size.toString()), agg)
            // print(Object.bsonsize(doc))
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ManualInsertion".concat(size.toString()),
                doc: doc
            }
        ],
        post: function (collection) {
            print("@START_TEST_PRINT@")
            print("Count of total into manual insertion: ", collection.getDB()["output0"].count())
            print("@END_TEST_PRINT@")
            collection.getDB()["ManualInsertion".concat(size.toString())].drop()
            collection.getDB()["output0"].drop()
            sleep(5000)
            // collection.drop()
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

// sizes.forEach(size => {
//     // Create the documents
//     doc = { "fieldName": 'x'.repeat(size) }

//     tests.push({
//         name: "ManualInsertion".concat(size.toString()),
//         tags: ['insert', 'regression'],
//         pre: function (collection) {
//             let agg = []

//             // agg.push({
//             //     $match: { fieldName: "Nothin" }
//             // })

//             agg.push({ $window: { type: 'sliding', size: 5, gap: 5, unit: 'second' } })

//             agg.push({
//                 $groups: { _id: null, count: { $sum: 1 } }
//             })

//             agg.push(
//                 { "$project": { "_id": 0 } }
//             )

//             agg.push({
//                 $merge: { into: { db: "test0", coll: "output0" } }
//             })

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
//             printjson(collection.getDB()["output0"].findOne())
//             print("@END_TEST_PRINT@")
//             collection.getDB()["ManualInsertion".concat(size.toString())].drop()
//             collection.getDB()["output0"].drop()
//             sleep(5000)
//             // collection.drop()
//         }
//     })
// });