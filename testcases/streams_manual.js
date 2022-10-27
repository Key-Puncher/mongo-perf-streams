// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

// sizes = [100]
sizes = [100, 10000, 100000, 1000000]

// Clear existing file
run("bash", "-c", `> output-data-manual-insertion.csv`);

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
                $merge: { into: { db: "test0", coll: `${streamName}-output` } }
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

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        name: "ManualInsertion.EmptyMatch".concat(size.toString()),
        tags: ["streams", "manual-insert"],
        pre: function (collection) {
            let agg = []

            agg.push({
                $match: { fieldName: "Nothin" }
            })

            collection.getDB().createStream("ManualInsertion.EmptyMatch".concat(size.toString()), agg)
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ManualInsertion.EmptyMatch".concat(size.toString()),
                doc: doc
            }
        ],
        post: function (collection, env) {
            print("@START_TEST_PRINT@")
            let streamName = "ManualInsertion.EmptyMatch".concat(size.toString())
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
    })
});


// TEST window count
// TEST manual insertion source

sizes.forEach((size) => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        name: "ManualInsertion.Window".concat(size.toString()),
        tags: ['manual-insert', 'streams', 'windows'],
        pre: function (collection) {
            let streamName = "ManualInsertion.Window".concat(size.toString());

            //collection.getDB()[`${streamName}-output`].drop()

            let agg = []

            agg.push({ $window: { type: 'tumbling', size: 5, unit: 'second' } })

            agg.push({
                $groups: { _id: null, count: { $sum: 1 } }
            })

            agg.push({
                $set: { _id: "$count" }
            })

            agg.push({
                $merge: { into: { db: "test0", coll: `${streamName}-output` } }
            })

            collection.getDB().createStream(streamName, agg)
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ManualInsertion.Window".concat(size.toString()),
                doc: doc
            }
        ],
        post: function (collection, env) {
            print("@START_TEST_PRINT@")
            let streamName = "ManualInsertion.Window".concat(size.toString());

            printjson(collection.getDB()[`${streamName}-output`].findOne())

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
    })
});