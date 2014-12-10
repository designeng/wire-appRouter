define(["underscore", "when", "when/sequence"], function(_, When, sequence) {
  var BehaviorProcessor;
  return BehaviorProcessor = (function() {
    function BehaviorProcessor() {}

    BehaviorProcessor.prototype.sequenceBehavior = function(childCTX) {
      return When(this.pluginWireFn.getProxy(childCTX.behavior), function(behaviorObject) {
        var tasks;
        tasks = behaviorObject.target;
        if (_.isFunction(tasks)) {
          tasks = [tasks];
        }
        return sequence(tasks, childCTX);
      }, function() {}).then(function() {
        return childCTX;
      }, function(error) {
        return console.error("BehaviorProcessor::sequenceBehavior ERROR:", error);
      });
    };

    return BehaviorProcessor;

  })();
});
