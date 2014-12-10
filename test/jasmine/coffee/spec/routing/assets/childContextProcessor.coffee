define [
    "core/plugin/routing/default/childContextProcessor"
    "when"
    "wire"
], (ChildContextProcessor, When, wire) ->

    describe "childContextProcessor", ->

        beforeEach (done) ->
            @processor = new ChildContextProcessor()
            done()

        it "distributeTasks", (done) ->
            expect(@processor.distributeTasks ["one", "filter:firstFilter", "two", "filter:secondFilter"]).toEqual {filters: ["firstFilter", "secondFilter"], tasks: ["one", "two"]}
            done()