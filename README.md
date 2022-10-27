# MONGO-PERF-STREAMS:

This project uses the existing mongo-perf framework to benchmark the streaming implementation of MongoDB Labs. It modifies the tests and inputs to insert into a stream instead of a MongoDB collection.

The tests that are relevant to streaming have the `"streams"` tag, and 

### DEPENDENCIES:
Running these performance tests requires a custom mongod to be used from streaming branch of [mongodb-labs/mongo](https://github.com/mongodb-labs/mongo/tree/streaming), and the streaming branch from [labs-modules](https://github.com/mongodb-labs/labs-modules/tree/streaming).

To see details on how to build the server, see the documentation in [mongodb-labs/mongo](https://github.com/mongodb-labs/mongo/tree/streaming).

### RUNNING THE TESTS:

First, activate the virtual environment then start up the mongod server from mongodb-labs/mongo

`./build/opt/install/bin/mongod --port 27017 --dbpath /data/db --replSet rs0 --logpath /data/log/mongod.log --bind_ip localhost --fork`

Then specify the directory containing the custom mongo shell location.
`python benchrun.py -f <list of testfiles> -t <list of thread configs> -s <shell path> [--trialTime <seconds>] [--trialCount <number of trials] [--summary <output file name>]`

For example, to run all streaming tests with 1 thread, 5 trials each test and 5 seconds for each trial, outputting all results into a summary csv:
`python benchrun.py -f testcases/* -t 1 -s ~/mongo/build/opt/install/bin/mongo --includeFilter streams --trialTime 5 --trialCount 5 --summary summary.csv`

To run only manual insertion tests with 1, and 10 threads:
`python benchrun.py -f testcases/streams_manual.js -t 1 10 -s ~/mongo/build/opt/install/bin/mongo --trialTime 5 --trialCount 5`

For a complete list of options :  
`python benchrun.py --help`

For further information, see the full mongo-perf documentation at [mongodb/mongo-perf](https://github.com/mongodb/mongo-perf).
