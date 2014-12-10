define(["core/plugin/routing/default/RouteObserver"], function(RouteObserver) {
  var empty, five, four, m0, m1, notEmpty, notEmptySecond, one, p0, p1, six, three, two;
  empty = [];
  notEmpty = ["search"];
  notEmptySecond = ["order", "search"];
  one = ["order", "info", "123"];
  two = ["order", "info", "123"];
  three = ["order", "info", "123", "test"];
  four = ["order", "info", "12345"];
  five = ["order", "info", 123];
  six = ["info", "order", "123"];
  m0 = [1, 2, 3];
  p0 = [2];
  m1 = [];
  p1 = [];
  return describe("RouteObserver theSame", function() {
    beforeEach(function(done) {
      this.observer = new RouteObserver();
      return done();
    });
    it("theSame", function(done) {
      expect(this.observer.theSame(one, two)).toBe(true);
      return done();
    });
    it("not theSame", function(done) {
      expect(this.observer.theSame(one, three)).toBe(false);
      expect(this.observer.theSame(one, four)).toBe(false);
      expect(this.observer.theSame(one, five)).toBe(false);
      expect(this.observer.theSame(empty, notEmpty)).toBe(false);
      expect(this.observer.theSame(notEmpty, empty)).toBe(false);
      expect(this.observer.theSame(one, six)).toBe(false);
      return done();
    });
    it("indexesOfMutation should be equial", function(done) {
      expect(this.observer.indexesOfMutation(one, six)).toEqual([0, 1]);
      expect(this.observer.indexesOfMutation(one, four)).toEqual([2]);
      expect(this.observer.indexesOfMutation(one, five)).toEqual([2]);
      expect(this.observer.indexesOfMutation(empty, notEmpty)).toEqual([0]);
      expect(this.observer.indexesOfMutation(empty, notEmptySecond)).toEqual([0, 1]);
      return done();
    });
    it("changes occurred", function(done) {
      expect(this.observer.changesOccurred(m0, p0)).toBe(true);
      return done();
    });
    return it("changes not occurred", function(done) {
      expect(this.observer.changesOccurred(m1, p1)).not.toBe(true);
      return done();
    });
  });
});
