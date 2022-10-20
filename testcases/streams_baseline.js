// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

sizes = [100, 5000, 10000, 50000]

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}-{BYTES}
        name: "Baseline-".concat(size.toString()),
        tags: ['streams'],
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
