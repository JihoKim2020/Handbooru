const {userDB} = require('../database/MongoDB');
bcrypt = require('bcrypt');

class loginmodel {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    matchuser() {
        return userDB.findOne({email: this.email});
    }

    async matchpassword() { // async await 해야하는 지 모르겠네
        const cryptedpassword = await bcrypt.hash(this.password, 12);
        return bcrypt.compare(this.password, cryptedpassword);
    }
}

module.exports = loginmodel;