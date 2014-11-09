var fantasySelectorsHelpers = {

    /**
     * @param  {string} imageURL
     */
    checkPositionMovement:function (imageURL,postionObj) {
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


};


module.exports = {
    checkPositionMovement: fantasySelectorsHelpers.checkPositionMovement
};