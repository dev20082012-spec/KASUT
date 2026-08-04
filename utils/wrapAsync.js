module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// const wrapAsync = (fn) => {
//     return function(req, res, next) {
//         fn(req, res, next).catch(next);
//     }
// };