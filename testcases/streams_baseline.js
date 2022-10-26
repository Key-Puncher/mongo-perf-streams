// Testing create stream

if (typeof (tests) != "object") {
    tests = [];
}

sizes = [100, 10000, 100000, 1000000]

run("bash", "-c", `> output-data-baseline.csv`);

sizes.forEach(size => {
    // Create the documents
    doc = { "fieldName": 'x'.repeat(size) }

    tests.push({
        // Naming convention is {TEST_NAME}{BYTES}
        name: "Baseline".concat(size.toString()),
        tags: ['streams'],
        pre: function (collection) { collection.drop(); },
        ops: [
            {
                op: "insert",
                doc: doc
            }
        ],
        post: function (collection, env) {
            print("@START_TEST_PRINT@")

            let name = "Baseline".concat(size.toString())
            let totalCount = collection.count()

            const data = `${name},${env.threads},${totalCount}`
            const command = `echo ${data} >> output-data-baseline.csv`
            run("bash", "-c", command)

            print("@END_TEST_PRINT@")
        }
    })
});
