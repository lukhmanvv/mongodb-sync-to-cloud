const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}


module.exports.connect = function (done) {
    const url = 'mongodb+srv://moneymanager:9etP68xdYZXVp9N@moneymanagement.mox7y.mongodb.net'
    const dbname = 'wizzo'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done()
    })
    

}

module.exports.get = function(){
    return state.db
}