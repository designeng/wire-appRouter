define [
    "core/plugin/routing/default/RouteObserver"
], (RouteObserver) ->

    empty = []
    notEmpty = ["search"]
    notEmptySecond = ["order", "search"]
    one = ["order", "info", "123"]
    two = ["order", "info", "123"]
    three = ["order", "info", "123", "test"]
    four = ["order", "info", "12345"]
    five = ["order", "info", 123]
    six = ["info", "order", "123"]

    m0 = [1, 2, 3]
    p0 = [2]

    m1 = []
    p1 = []

    describe "RouteObserver theSame", ->

        beforeEach (done) ->
            @observer = new RouteObserver()
            done()

        it "theSame", (done) ->
            expect(@observer.theSame one, two).toBe true
            done()

        it "not theSame", (done) ->
            expect(@observer.theSame one, three).toBe false
            expect(@observer.theSame one, four).toBe false
            expect(@observer.theSame one, five).toBe false
            expect(@observer.theSame empty, notEmpty).toBe false
            expect(@observer.theSame notEmpty, empty).toBe false
            expect(@observer.theSame one, six).toBe false
            done()

        it "indexesOfMutation should be equial", (done) ->
            expect(@observer.indexesOfMutation one, six).toEqual [0, 1]
            expect(@observer.indexesOfMutation one, four).toEqual [2]
            expect(@observer.indexesOfMutation one, five).toEqual [2]
            expect(@observer.indexesOfMutation empty, notEmpty).toEqual [0]
            expect(@observer.indexesOfMutation empty, notEmptySecond).toEqual [0, 1]
            done()

        # changesOccurred
        it "changes occurred", (done) ->
            expect(@observer.changesOccurred m0, p0).toBe true
            done()

        it "changes not occurred", (done) ->
            expect(@observer.changesOccurred m1, p1).not.toBe true
            done()