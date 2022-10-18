// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

sizes = [100, 10000, 100000, 1000000, 10000000]

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        name: "Insert.Baseline",
        tags: ['insert', 'regression'],
        pre: function (collection) { collection.drop(); },
        ops: [
            {
                op: "insert",
                doc: doc
            }
        ],
        post: function (collection) {
            print("@START_TEST_PRINT@")
            print("Count of total into baseline: ", collection.count())
            print("@END_TEST_PRINT@")
        }
    })
});
