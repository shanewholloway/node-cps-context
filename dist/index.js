'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cps_context;
const { createHook, triggerAsyncId, executionAsyncId } = require('async_hooks');

const db = new Map();

const skipByType = new Set(['PROMISE', 'TIMERWRAP', 'TickObject']);

const hook = createHook({
  destroy(asyncId) {
    db.delete(asyncId);
  },

  init(asyncId, type, triggerId, resource) {
    const ctx = db.get(triggerId) || null;

    if (null === ctx) {
      db.set(asyncId, Object.create(null, {
        _rootAsyncId_: { value: asyncId },
        _asyncId_: { value: asyncId },
        inspect: { value: inspect_cps_context } }));
    } else if (!skipByType.has(type)) {
      db.set(asyncId, Object.create(ctx, {
        _asyncId_: { value: asyncId } }));
    } else {
      db.set(asyncId, ctx);
    }
  } });

function inspect_cps_context() {
  return `«cps_context ${this._asyncId_} ${this._rootAsyncId_}»`;
}function cps_context(useTriggerId) {
  return db.get(useTriggerId ? triggerAsyncId() : executionAsyncId());
}

module.exports = exports = Object.assign(cps_context, {
  default: cps_context,
  tip: cps_context,

  isActive() {
    return hook.active;
  },

  install() {
    if (undefined !== hook && !hook.active) {
      hook.enable();
      hook.active = true;
    }
    return this;
  },

  uninstall() {
    db.clear();
    if (undefined !== hook) {
      hook.disable();
      hook.active = false;
    }
    return this;
  } });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2NvZGUvaW5kZXguanN5Il0sIm5hbWVzIjpbImNwc19jb250ZXh0IiwiY3JlYXRlSG9vayIsInRyaWdnZXJBc3luY0lkIiwiZXhlY3V0aW9uQXN5bmNJZCIsInJlcXVpcmUiLCJkYiIsIk1hcCIsInNraXBCeVR5cGUiLCJTZXQiLCJob29rIiwiZGVzdHJveSIsImFzeW5jSWQiLCJkZWxldGUiLCJpbml0IiwidHlwZSIsInRyaWdnZXJJZCIsInJlc291cmNlIiwiY3R4IiwiZ2V0Iiwic2V0IiwiT2JqZWN0IiwiY3JlYXRlIiwiX3Jvb3RBc3luY0lkXyIsInZhbHVlIiwiX2FzeW5jSWRfIiwiaW5zcGVjdCIsImluc3BlY3RfY3BzX2NvbnRleHQiLCJoYXMiLCJ1c2VUcmlnZ2VySWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiYXNzaWduIiwiZGVmYXVsdCIsInRpcCIsImlzQWN0aXZlIiwiYWN0aXZlIiwiaW5zdGFsbCIsInVuZGVmaW5lZCIsImVuYWJsZSIsInVuaW5zdGFsbCIsImNsZWFyIiwiZGlzYWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBZ0N3QkEsVztBQWhDeEIsTUFBTSxFQUFDQyxVQUFELEVBQWFDLGNBQWIsRUFBNkJDLGdCQUE3QixLQUFpREMsUUFBUSxhQUFSLENBQXZEOztBQUVBLE1BQU1DLEtBQUssSUFBSUMsR0FBSixFQUFYOztBQUVBLE1BQU1DLGFBQWEsSUFBSUMsR0FBSixDQUFVLENBQzNCLFNBRDJCLEVBRTNCLFdBRjJCLEVBRzNCLFlBSDJCLENBQVYsQ0FBbkI7O0FBS0EsTUFBTUMsT0FBT1IsV0FBYTtBQUN4QlMsVUFBUUMsT0FBUixFQUFpQjtBQUNmTixPQUFHTyxNQUFILENBQVlELE9BQVo7QUFBbUIsR0FGRzs7QUFJeEJFLE9BQUtGLE9BQUwsRUFBY0csSUFBZCxFQUFvQkMsU0FBcEIsRUFBK0JDLFFBQS9CLEVBQXlDO0FBQ3ZDLFVBQU1DLE1BQU1aLEdBQUdhLEdBQUgsQ0FBT0gsU0FBUCxLQUFxQixJQUFqQzs7QUFFQSxRQUFHLFNBQVNFLEdBQVosRUFBbUI7QUFDakJaLFNBQUdjLEdBQUgsQ0FBU1IsT0FBVCxFQUFrQlMsT0FBT0MsTUFBUCxDQUFnQixJQUFoQixFQUF3QjtBQUN4Q0MsdUJBQWUsRUFBRUMsT0FBT1osT0FBVCxFQUR5QjtBQUV4Q2EsbUJBQVcsRUFBRUQsT0FBT1osT0FBVCxFQUY2QjtBQUd4Q2MsaUJBQVMsRUFBRUYsT0FBT0csbUJBQVQsRUFIK0IsRUFBeEIsQ0FBbEI7QUFHeUMsS0FKM0MsTUFNSyxJQUFHLENBQUVuQixXQUFXb0IsR0FBWCxDQUFlYixJQUFmLENBQUwsRUFBNEI7QUFDL0JULFNBQUdjLEdBQUgsQ0FBU1IsT0FBVCxFQUNFUyxPQUFPQyxNQUFQLENBQWdCSixHQUFoQixFQUF1QjtBQUNyQk8sbUJBQVcsRUFBRUQsT0FBT1osT0FBVCxFQURVLEVBQXZCLENBREY7QUFFaUMsS0FIOUIsTUFLQTtBQUNITixTQUFHYyxHQUFILENBQVNSLE9BQVQsRUFBa0JNLEdBQWxCO0FBQXFCO0FBQUEsR0FuQkQsRUFBYixDQUFiOztBQXFCQSxTQUFTUyxtQkFBVCxHQUErQjtBQUFHLFNBQVEsZ0JBQWUsS0FBS0YsU0FBVSxJQUFHLEtBQUtGLGFBQWMsR0FBNUQ7QUFBOEQsQ0FFakYsU0FBU3RCLFdBQVQsQ0FBcUI0QixZQUFyQixFQUFtQztBQUNoRCxTQUFPdkIsR0FBR2EsR0FBSCxDQUFTVSxlQUFlMUIsZ0JBQWYsR0FBa0NDLGtCQUEzQyxDQUFQO0FBQW9FOztBQUV0RTBCLE9BQU9DLE9BQVAsR0FBaUJBLFVBQVVWLE9BQU9XLE1BQVAsQ0FBZ0IvQixXQUFoQixFQUErQjtBQUN4RGdDLFdBQVNoQyxXQUQrQztBQUV4RGlDLE9BQUtqQyxXQUZtRDs7QUFJeERrQyxhQUFXO0FBQUcsV0FBT3pCLEtBQUswQixNQUFaO0FBQWtCLEdBSndCOztBQU14REMsWUFBVTtBQUNSLFFBQUdDLGNBQWM1QixJQUFkLElBQXNCLENBQUVBLEtBQUswQixNQUFoQyxFQUF5QztBQUN2QzFCLFdBQUs2QixNQUFMO0FBQ0E3QixXQUFLMEIsTUFBTCxHQUFjLElBQWQ7QUFBa0I7QUFDcEIsV0FBTyxJQUFQO0FBQVcsR0FWMkM7O0FBWXhESSxjQUFZO0FBQ1ZsQyxPQUFHbUMsS0FBSDtBQUNBLFFBQUdILGNBQWM1QixJQUFqQixFQUF3QjtBQUN0QkEsV0FBS2dDLE9BQUw7QUFDQWhDLFdBQUswQixNQUFMLEdBQWMsS0FBZDtBQUFtQjtBQUNyQixXQUFPLElBQVA7QUFBVyxHQWpCMkMsRUFBL0IsQ0FBM0IiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7Y3JlYXRlSG9vaywgdHJpZ2dlckFzeW5jSWQsIGV4ZWN1dGlvbkFzeW5jSWR9ID0gcmVxdWlyZSgnYXN5bmNfaG9va3MnKVxuXG5jb25zdCBkYiA9IG5ldyBNYXAoKVxuXG5jb25zdCBza2lwQnlUeXBlID0gbmV3IFNldCBAI1xuICAnUFJPTUlTRSdcbiAgJ1RJTUVSV1JBUCdcbiAgJ1RpY2tPYmplY3QnXG5cbmNvbnN0IGhvb2sgPSBjcmVhdGVIb29rIEA6XG4gIGRlc3Ryb3koYXN5bmNJZCkgOjpcbiAgICBkYi5kZWxldGUgQCBhc3luY0lkXG5cbiAgaW5pdChhc3luY0lkLCB0eXBlLCB0cmlnZ2VySWQsIHJlc291cmNlKSA6OlxuICAgIGNvbnN0IGN0eCA9IGRiLmdldCh0cmlnZ2VySWQpIHx8IG51bGxcblxuICAgIGlmIG51bGwgPT09IGN0eCAgOjpcbiAgICAgIGRiLnNldCBAIGFzeW5jSWQsIE9iamVjdC5jcmVhdGUgQCBudWxsLCBAOlxuICAgICAgICBfcm9vdEFzeW5jSWRfOiB7IHZhbHVlOiBhc3luY0lkIH1cbiAgICAgICAgX2FzeW5jSWRfOiB7IHZhbHVlOiBhc3luY0lkIH1cbiAgICAgICAgaW5zcGVjdDogeyB2YWx1ZTogaW5zcGVjdF9jcHNfY29udGV4dCB9XG5cbiAgICBlbHNlIGlmICEgc2tpcEJ5VHlwZS5oYXModHlwZSkgOjpcbiAgICAgIGRiLnNldCBAIGFzeW5jSWQsXG4gICAgICAgIE9iamVjdC5jcmVhdGUgQCBjdHgsIEA6XG4gICAgICAgICAgX2FzeW5jSWRfOiB7IHZhbHVlOiBhc3luY0lkIH1cblxuICAgIGVsc2UgOjpcbiAgICAgIGRiLnNldCBAIGFzeW5jSWQsIGN0eFxuXG5mdW5jdGlvbiBpbnNwZWN0X2Nwc19jb250ZXh0KCkgOjogcmV0dXJuIGDCq2Nwc19jb250ZXh0ICR7dGhpcy5fYXN5bmNJZF99ICR7dGhpcy5fcm9vdEFzeW5jSWRffcK7YFxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcHNfY29udGV4dCh1c2VUcmlnZ2VySWQpIDo6XG4gIHJldHVybiBkYi5nZXQgQCB1c2VUcmlnZ2VySWQgPyB0cmlnZ2VyQXN5bmNJZCgpIDogZXhlY3V0aW9uQXN5bmNJZCgpXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gQCBjcHNfY29udGV4dCwgQDpcbiAgZGVmYXVsdDogY3BzX2NvbnRleHRcbiAgdGlwOiBjcHNfY29udGV4dFxuXG4gIGlzQWN0aXZlKCkgOjogcmV0dXJuIGhvb2suYWN0aXZlXG5cbiAgaW5zdGFsbCgpIDo6XG4gICAgaWYgdW5kZWZpbmVkICE9PSBob29rICYmICEgaG9vay5hY3RpdmUgOjpcbiAgICAgIGhvb2suZW5hYmxlKClcbiAgICAgIGhvb2suYWN0aXZlID0gdHJ1ZVxuICAgIHJldHVybiB0aGlzXG5cbiAgdW5pbnN0YWxsKCkgOjpcbiAgICBkYi5jbGVhcigpXG4gICAgaWYgdW5kZWZpbmVkICE9PSBob29rIDo6XG4gICAgICBob29rLmRpc2FibGUoKVxuICAgICAgaG9vay5hY3RpdmUgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzXG5cbiJdfQ==