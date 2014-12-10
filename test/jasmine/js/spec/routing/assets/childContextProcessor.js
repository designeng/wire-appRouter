define(["core/plugin/routing/default/childContextProcessor", "when", "wire"], function(ChildContextProcessor, When, wire) {
  return describe("childContextProcessor", function() {
    beforeEach(function(done) {
      this.processor = new ChildContextProcessor();
      return done();
    });
    return it("distributeTasks", function(done) {
      expect(this.processor.distributeTasks(["one", "filter:firstFilter", "two", "filter:secondFilter"])).toEqual({
        filters: ["firstFilter", "secondFilter"],
        tasks: ["one", "two"]
      });
      return done();
    });
  });
});
