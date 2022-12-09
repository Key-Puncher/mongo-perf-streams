// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

// Create a document

sizes = [100, 10000, 100000, 1000000]


// TEST change streams source
// Clear existing file
run("bash", "-c", `> output-data-change-streams.csv`);

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}{BYTES}
        name: "ChangeStreams".concat(size.toString()),
        tags: ["streams", "change-stream"],
        pre: function (collection) {

            let agg = []
            let streamName = "ChangeStreams".concat(size.toString())

            agg.push({
                $in: { db: "test0", coll: streamName }
            })

            agg.push({
                $merge: { into: { db: "test0", coll: `${streamName}-output` } }
            })

            collection.getDB().createStream("Stream".concat(size.toString()), agg)
        },
        ops: [
            {
                op: "insert",
                ns: "test0.ChangeStreams".concat(size.toString()),
                doc: doc
            },
        ],
        post: function (collection, env) {
            print("@START_TEST_PRINT@")
            let streamName = "ChangeStreams".concat(size.toString())
            let totalCount = collection.getDB()[`${streamName}-output`].count()

            const data = `${streamName},${env.threads},${totalCount}`
            const command = `echo ${data} >> output-data-change-streams.csv`
            run("bash", "-c", command);

            print("@END_TEST_PRINT@")
            collection.getDB()["Stream".concat(size.toString())].drop()
            collection.getDB()[streamName].drop()
            collection.getDB()[`${streamName}-output`].drop()
            sleep(5000)
        }
    })
});