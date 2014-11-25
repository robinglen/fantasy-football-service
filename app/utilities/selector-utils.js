var selectorsUtils = (function() {

    /**
     * @param  {string} imageURL
     */
    function checkPositionMovement (imageURL,postionObj) {
      switch (imageURL) {
        case postionObj.unchanged:
          return "static"
        case postionObj.up:
          return "up"
        case postionObj.down:
          return "down"
        default:
          return "static"
      }
    }

    return {
      checkPositionMovement:checkPositionMovement
    };

});


module.exports = {
    selectorsUtils: selectorsUtils
};